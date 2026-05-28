import { NextResponse } from "next/server";

import { openrouter } from "@/lib/openrouter";

import { schemaRegistry } from "@/lib/schemaRegistry";

import connectDB from "@/lib/mongodb";

import Validation from "@/database/Validation";

function getSchemaExample(schema: string) {

  if (schema === "user") {

    return `
{
  "name": "Juhi",
  "age": 21,
  "email": "juhi@gmail.com",
  "skills": ["React", "AI"]
}
`;
  }

  if (schema === "product") {

    return `
{
  "productName": "Laptop",
  "price": 50000,
  "category": "Electronics",
  "inStock": true
}
`;
  }

  if (schema === "employee") {

    return `
{
  "name": "Rahul",
  "age": 28,
  "department": "IT",
  "salary": 70000,
  "isActive": true
}
`;
  }

  return "{}";
}

export async function POST(req: Request) {

  const startTime = Date.now();

  try {

    await connectDB();

    const body = await req.json();

    const prompt = body.prompt;

    const schema =
      body.schema || "user";
    const strategy =
      body.strategy || "json";

    const selectedSchema =
      schemaRegistry[
        schema as keyof typeof schemaRegistry
      ];

    let attempts = 1;

    let correctionNeeded = false;

    const MAX_ATTEMPTS = 3;

    // INITIAL LLM CALL

    let completion =
      await openrouter.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",

content:

strategy === "json"

? `

Respond ONLY with valid JSON matching this schema.

Schema Example:

${getSchemaExample(schema)}

Prompt:

${prompt}
`

: strategy === "fewshot"

? `

Here is an example of correctly formatted output:

${getSchemaExample(schema)}

Follow the same structure exactly.

Prompt:

${prompt}
`

: `

Return valid structured JSON.

Prompt:

${prompt}
`,
          },
        ],
      });

    let output =
      completion.choices[0]
        .message.content;

    let cleaned = output
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {

      parsed =
        JSON.parse(cleaned || "{}");

    } catch {

      parsed = {};
    }

    let validated =
      selectedSchema.safeParse(parsed);

    // RETRY LOGIC

    while (
      !validated.success &&
      attempts < MAX_ATTEMPTS
    ) {

      correctionNeeded = true;

      attempts++;

      const correctionPrompt = `
Your previous response failed validation.

Validation Errors:

${JSON.stringify(
  validated.error.issues,
  null,
  2
)}

Expected JSON Format:

${getSchemaExample(schema)}

Previous Invalid Response:

${JSON.stringify(parsed, null, 2)}

Return ONLY corrected valid JSON.
`;

      completion =
        await openrouter.chat.completions.create({

          model:
            "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "user",

              content:
                correctionPrompt,
            },
          ],
        });

      output =
        completion.choices[0]
          .message.content;

      cleaned = output
        ?.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {

        parsed =
          JSON.parse(cleaned || "{}");

      } catch {

        parsed = {};
      }

      validated =
        selectedSchema.safeParse(parsed);
    }

    const latency =
      `${Date.now() - startTime}ms`;

    // SUCCESS

    if (validated.success) {

      await Validation.create({

        prompt,

        schema,
        strategy,

        response:
          validated.data,

        success: true,

        attempts,

        correctionNeeded,

        latency,
      });

      return NextResponse.json({

        success: true,

        data:
          validated.data,

        attempts,

        correctionNeeded,

        latency,
      });
    }

    // FAILURE

    await Validation.create({

      prompt,

      schema,

      response: parsed,

      success: false,

      attempts,

      correctionNeeded,

      latency,

      errors:
        validated.error.issues,
    });

    return NextResponse.json({

      success: false,

      message:
        "Validation failed after retries",

errors:
  validated.error.issues.map(
    (issue) => ({
      path: issue.path,
      message: issue.message,
    })
  ),

      attempts,

      correctionNeeded,

      latency,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({

      success: false,

      message:
        error.message,
    });
  }
}