import type { EstimateResponse } from "@/lib/schemas";

export async function explainEstimate(
  payload: EstimateResponse
): Promise<string | undefined> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return undefined;

  const body = {
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system" as const,
        content:
          "You are a collateral risk assistant for Indian secured lending. Explain the following STRICT JSON valuation result in 3 short paragraphs: (1) what the ranges mean, (2) liquidity and time-to-sell, (3) main drivers and flags. Do NOT invent numbers; only reference fields present in the JSON. Keep under 180 words. Plain English.",
      },
      {
        role: "user" as const,
        content: JSON.stringify(payload),
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return undefined;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text || undefined;
}
