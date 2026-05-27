import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Validation from "@/database/Validation";

export async function GET() {
  try {
    await connectDB();

    const history = await Validation.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}