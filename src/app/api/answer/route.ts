import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { validateAnswerPayload } from "@/lib/validation";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const rateLimitKey = getRateLimitKey(req, "answer");
  const rateLimitResult = rateLimit(rateLimitKey);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later.", resetIn: rateLimitResult.resetIn },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimitResult.resetIn / 1000)) } }
    );
  }

  try {
    const payload = await req.json();
    const validationErrors = validateAnswerPayload(payload);

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 });
    }

    const { gameId, playerId, questionId, chosenOption, timeTaken } = payload;

    console.log("🖥️ [API/answer] Received:", { gameId, playerId, questionId, chosenOption, timeTaken });

    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("settings")
      .eq("id", gameId)
      .single();

    if (gameError || !game) {
      console.error("❌ [API/answer] Game lookup failed:", gameError);
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const correctOption = game.settings?.current_correct_option;
    
    if (correctOption === undefined) {
      console.error("❌ [API/answer] correct_option not found in game settings");
      return NextResponse.json({ error: "Game state error" }, { status: 500 });
    }

    const isCorrect = correctOption === chosenOption;

    let points = 0;
    if (isCorrect) {
      const timeRatio = Math.max(0, 20 - timeTaken) / 20;
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
      console.error("❌ [API/answer] Insert failed:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log("✅ [API/answer] Answer saved:", insertedAnswer);

    if (points > 0) {
      const { error: scoreError } = await supabase.rpc('increment_score', {
        row_id: playerId,
        score_inc: points
      });

      if (scoreError) {
        console.warn("⚠️ [API/answer] RPC failed, using fallback:", scoreError.message);
        const { data: player } = await supabase.from('players').select('score').eq('id', playerId).single();
        await supabase.from('players').update({ score: (player?.score || 0) + points }).eq('id', playerId);
      }
    }

    return NextResponse.json({ success: true, isCorrect, points });

  } catch (error: any) {
    console.error("❌ [API/answer] Unhandled error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}