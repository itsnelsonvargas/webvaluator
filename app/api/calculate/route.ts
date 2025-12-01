import { NextRequest, NextResponse } from "next/server";
import { calculateCost } from "@/app/lib/costCalculator";
import { estimatorFormSchema } from "@/app/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = estimatorFormSchema.parse(body);
    const result = calculateCost(validatedData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

