import { NextResponse } from "next/server";
import { estimateRequestSchema } from "@/lib/schemas";
import { runEstimate } from "@/lib/engine/run-estimate";
import { explainEstimate } from "@/lib/ai/explain";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = estimateRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const result = await runEstimate(parsed.data);
    if (parsed.data.include_ai_summary) {
      const summary = await explainEstimate(result);
      if (summary) result.ai_summary = summary;
    }
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Estimate failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
