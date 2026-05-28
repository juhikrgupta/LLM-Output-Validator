import { NextResponse } from "next/server";
import { openrouter } from "@/lib/openrouter";
import { UserSchema } from "@/app/schemas/userSchema";
import connectDB from "@/lib/mongodb";
import Validation from "@/database/Validation";

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const prompt = body.prompt;

    // CALL AI
    const completion = await openrouter.chat.completions.create({

      model: "openai/gpt-3.5-turbo",

      messages: [
        {
          role: "user",
          content: `
Return ONLY valid JSON.

Format:
{
  "name": "string",
  "age": number,
  "email": "string",
  "skills": ["string"]
}

Prompt:
${prompt}
`,
        },
      ],
    });

    // GET RESPONSE
    const output = completion.choices[0].message.content;

    // CLEAN RESPONSE
    const cleaned = output
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // PARSE JSON
    const parsed = JSON.parse(cleaned || "{}");

    // VALIDATE
    const validated = UserSchema.safeParse(parsed);

    // VALID RESPONSE
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

    // INVALID RESPONSE
    const formattedErrors = validated.error.issues.map((issue) => ({

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