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
  "skills": ["React", "Node"]
}
`;
  }

  if (schema === "product") {
    return `
{
  "productName": "Laptop",
  "price": 50000,
  "inStock": true,
  "tags": ["electronics", "gaming"]
}
`;
  }

  if (schema === "employee") {
    return `
{
  "name": "Rahul",
  "department": "IT",
  "salary": 80000,
  "skills": ["Java", "MongoDB"]
}
`;
  }

  return "{}";
}
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const prompt = body.prompt;

    // GET SELECTED SCHEMA
    const schema = body.schema || "user";

    const selectedSchema =
      schemaRegistry[
        schema as keyof typeof schemaRegistry
      ];

    // CALL AI
    const completion =
      await openrouter.chat.completions.create({
        model: "openai/gpt-3.5-turbo",

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

    // GET RESPONSE
    const output =
      completion.choices[0].message.content;

    // CLEAN RESPONSE
    const cleaned = output
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // PARSE JSON
    const parsed = JSON.parse(cleaned || "{}");

    // VALIDATE RESPONSE
    const validated =
      selectedSchema.safeParse(parsed);

    // SUCCESS
    if (validated.success) {
      await Validation.create({
        prompt,

        response: validated.data,

        success: true,
      });

      return NextResponse.json({
        success: true,

        data: validated.data,
      });
    }

    // VALIDATION FAILED
    const formattedErrors =
      validated.error.issues.map((issue) => ({
        field: issue.path.join("."),

        message: issue.message,

        expected: (issue as any).expected,

        received: (issue as any).received,
      }));

    await Validation.create({
      prompt,

      response: {
        invalidData: parsed,

        errors: formattedErrors,
      },

      success: false,
    });

    return NextResponse.json({
      success: false,

      invalidData: parsed,

      errors: formattedErrors,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({
      success: false,

      message: error.message,
    });
  }
}