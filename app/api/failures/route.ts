import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Validation from "@/database/Validation";

export async function GET() {

  try {

    await connectDB();

    const failures = await Validation.find({
      success: false,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      failures,
    });

  } catch (error: any) {

    return NextResponse.json({

      success: false,

      message: error.message,
    });
  }
}