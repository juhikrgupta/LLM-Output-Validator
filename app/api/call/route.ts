import { NextResponse } from "next/server";
import { openrouter } from "@/lib/openrouter";
import { UserSchema } from "@/app/schemas/userSchema";
import connectDB from "@/lib/mongodb";
import Validation from "@/database/Validation";

export async function POST(req: Request) {
  try {
    // connect database
    await connectDB();

    // get prompt from frontend
    const body = await req.json();
    const prompt = body.prompt;

    // call AI model
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

    // get AI response
    const output = completion.choices[0].message.content;

    // clean markdown
    const cleaned = output
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // convert string to JSON
    const parsed = JSON.parse(cleaned || "{}");

    // validate using zod
    const validated = UserSchema.safeParse(parsed);

    // validation failed
    if (!validated.success) {

      const formattedErrors = validated.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        expected: (issue as any).expected,
        received: (issue as any).received,
      }));

      // save failed validation
      await Validation.create({
        prompt,
        response: formattedErrors,
        success: false,
      });

      return NextResponse.json({
        success: false,
        type: "validation",
        errors: formattedErrors,
      });
    }

    // save successful validation
    await Validation.create({
      prompt,
      response: validated.data,
      success: true,
    });

    // return success response
    return NextResponse.json({
      success: true,
      data: validated.data,
    });

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}