import { NextResponse }
from "next/server";

import { openrouter }
from "@/lib/openrouter";

import { schemaRegistry }
from "@/lib/schemaRegistry";

import connectDB
from "@/lib/mongodb";

import Validation
from "@/database/Validation";

function getSchemaExample(
  schema: string
) {

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
  "inStock": true
}
`;
  }

  if (schema === "employee") {

    return `
{
  "name": "Rahul",
  "department": "IT",
  "salary": 70000
}
`;
  }

  return "{}";
}

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    const prompt =
      body.prompt;

    const schema =
      body.schema || "user";

    const selectedSchema =
      schemaRegistry[
        schema as keyof typeof schemaRegistry
      ];

    const completion =
      await openrouter.chat.completions.create({

        model:
          "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",

            content: `
Return ONLY valid JSON.

Format example:

${getSchemaExample(schema)}

Prompt:

${prompt}
`,
          },
        ],
      });

    const output =
      completion.choices[0]
      .message.content;

    const cleaned = output
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed =
      JSON.parse(cleaned || "{}");

    const validated =
      selectedSchema.safeParse(parsed);

    if (validated.success) {

      await Validation.create({

        prompt,

        response:
          validated.data,

        success: true,
      });

      return NextResponse.json({

        success: true,

        data:
          validated.data,
      });
    }

    await Validation.create({

      prompt,

      response: parsed,

      success: false,
    });

    return NextResponse.json({

      success: false,

      errors:
        validated.error.issues,
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