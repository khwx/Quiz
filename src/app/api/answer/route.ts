import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { gameId, playerId, questionId, chosenOption, timeTaken } = await req.json();

        console.log("🖥️ [API/answer] Received:", { gameId, playerId, questionId, chosenOption, timeTaken });

        // 1. Get correct answer
        const { data: question, error: qError } = await supabase
            .from("questions")
            .select("correct_option")
            .eq("id", questionId)
            .single();

        if (qError || !question) {
            console.error("❌ [API/answer] Question lookup failed:", qError);
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        const isCorrect = question.correct_option === chosenOption;

        // 2. Calculate Score
        let points = 0;
        if (isCorrect) {
            const timeRatio = Math.max(0, 20 - timeTaken) / 20;
            points = Math.round(600 + (400 * timeRatio));
        }

        // 3. Save Answer
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

        // 4. Update Player Score
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
