import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { validateGeneratePayload } from "@/lib/validation";
import { generateQuestionsWithFallback } from "@/lib/ai-service-fallback";
import { createContextLogger } from "@/lib/logger";

const log = createContextLogger("API/questions/generate");

export async function POST(req: NextRequest) {
  const rateLimitKey = getRateLimitKey(req, "generate");
  const rateLimitResult = rateLimit(rateLimitKey);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta novamente mais tarde.", resetIn: rateLimitResult.resetIn },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimitResult.resetIn / 1000)) } }
    );
  }

  try {
    const payload = await req.json();
    const validationErrors = validateGeneratePayload(payload);

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validação falhou", details: validationErrors }, { status: 400 });
    }

    const { prompt, count = 5, ageRating = "adults" } = payload;
    const { questions, provider } = await generateQuestionsWithFallback(prompt, count, ageRating);

    return NextResponse.json({ questions, provider });
  } catch (error: any) {
    log.error("Error generating questions", { prompt: payload?.prompt }, error);
    return NextResponse.json({ error: "Falha ao gerar perguntas", details: error.message }, { status: 500 });
  }
}