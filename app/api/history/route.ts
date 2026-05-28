import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Validation from "@/database/Validation";

export async function GET() {

  try {

    await connectDB();

    const history =
      await Validation.find()
        .sort({ createdAt: -1 });

    return NextResponse.json(
      history
    );

  } catch (error: any) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        error.message,
    });
  }
}

export async function DELETE(
  req: Request
) {

  try {

    await connectDB();

    const body =
      await req.json();

    const ids =
      body.ids || [];

    await Validation.deleteMany({

      _id: {
        $in: ids,
      },
    });

    return NextResponse.json({

      success: true,
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