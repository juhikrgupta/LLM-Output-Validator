import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";

import Validation from "@/database/Validation";

export async function GET() {

  try {

    await connectDB();

    const validations =
      await Validation.find();

    const total =
      validations.length;

    const successCount =
      validations.filter(
        (v) => v.success
      ).length;

    const failureCount =
      total - successCount;

    const correctionCount =
      validations.filter(
        (v) => v.correctionNeeded
      ).length;

    const successRate =
      total > 0
        ? (
            (successCount / total) *
            100
          ).toFixed(1)
        : "0";

    const latencies =
      validations.map((v) =>
        Number(
          String(v.latency)
            .replace("ms", "")
        )
      );

    const averageLatency =
      latencies.length > 0
        ? Math.round(
            latencies.reduce(
              (a, b) => a + b,
              0
            ) / latencies.length
          )
        : 0;

    return NextResponse.json({

      total,

      successCount,

      failureCount,

      correctionCount,

      successRate,

      averageLatency:
        `${averageLatency}ms`,
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