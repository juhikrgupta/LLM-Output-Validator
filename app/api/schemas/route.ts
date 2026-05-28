import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Schema from "@/database/Schema";

export async function GET() {

  try {

    await connectDB();

    const schemas =
      await Schema.find();

    return NextResponse.json({
      success: true,
      schemas,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      message:
        error.message,
    });
  }
}

export async function POST(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    const created =
      await Schema.create({

        name:
          body.name,

        schema:
          body.schema,
      });

    return NextResponse.json({
      success: true,
      schema: created,
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      message:
        error.message,
    });
  }
}