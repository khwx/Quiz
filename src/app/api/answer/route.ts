import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { validateAnswerPayload } from "@/lib/validation";
import { getServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const rateLimitKey = getRateLimitKey(req, "answer");
  const rateLimitResult = rateLimit(rateLimitKey);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta novamente mais tarde.", resetIn: rateLimitResult.resetIn },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimitResult.resetIn / 1000)) } }
    );
  }

  try {
    const payload = await req.json();
    const validationErrors = validateAnswerPayload(payload);

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validação falhou", details: validationErrors }, { status: 400 });
    }

    const { gameId, playerId, questionId, chosenOption, timeTaken } = payload;

    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("settings")
      .eq("id", gameId)
      .single();

    if (gameError || !game) {
      console.error("❌ [API/answer] Game lookup failed:", gameError);
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    let correctOption = game.settings?.current_correct_option;
    
    // Fallback for older games or if setting is missing
    if (correctOption === undefined) {
      console.warn("⚠️ [API/answer] current_correct_option not found in game settings. Falling back to DB.");
      const { data: questionData } = await supabase
        .from("questions")
        .select("correct_option")
        .eq("id", questionId)
        .single();
        
      if (questionData && questionData.correct_option !== undefined) {
        correctOption = questionData.correct_option;
      } else {
        console.error("❌ [API/answer] correct_option completely missing.");
        return NextResponse.json({ error: "Erro no estado do jogo" }, { status: 500 });
      }
    }

    const isCorrect = correctOption === chosenOption;

    let points = 0;
    if (isCorrect) {
      const timerDuration = game.settings?.timer_duration || 20;
      const timeRatio = Math.max(0, timerDuration - timeTaken) / timerDuration;
      points = Math.round(600 + (400 * timeRatio));
    }

    const { data: insertedAnswer, error: insertError } = await supabase.from("answers").insert({
      game_id: gameId,
      player_id: playerId,
      question_id: questionId,
      chosen_option: chosenOption,
      time_taken: timeTaken,
      is_correct: isCorrect,
      points: points
    }).select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (points > 0) {
      const { data: player } = await supabase.from('players').select('score').eq('id', playerId).single();
      const newScore = (player?.score || 0) + points;
      const { error: scoreError } = await supabase
        .from('players')
        .update({ score: newScore })
        .eq('id', playerId);

      if (scoreError) {
        console.warn("⚠️ [API/answer] Score update failed:", scoreError.message);
      }
    }

    return NextResponse.json({ success: true, isCorrect, points });

  } catch (error: any) {
    console.error("❌ [API/answer] Unhandled error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}