import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { gameId, playerId, questionId, chosenOption, timeTaken } = await req.json();

        // 1. Get correct answer
        const { data: question } = await supabase
            .from("questions")
            .select("correct_option")
            .eq("id", questionId)
            .single();

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        const isCorrect = question.correct_option === chosenOption;

        // 2. Calculate Score (Max 1000, decreases with time)
        // timeTaken is how long they took. Max time is 20s.
        // Formula: 1000 * (1 - (timeTaken / 20) / 2) -> If instant: 1000. If 20s: 500.
        // Simplified: 600 base + 400 * (remaining_time / 20)
        let points = 0;
        if (isCorrect) {
            const timeRatio = Math.max(0, 20 - timeTaken) / 20;
            points = Math.round(600 + (400 * timeRatio));
        }

        // 3. Save Answer
        await supabase.from("answers").insert({
            game_id: gameId,
            player_id: playerId,
            question_id: questionId,
            chosen_option: chosenOption,
            time_taken: timeTaken,
            is_correct: isCorrect,
            points: points
        });

        // 4. Update Player Score
        if (points > 0) {
            const { error: scoreError } = await supabase.rpc('increment_score', {
                row_id: playerId,
                score_inc: points
            });

            // Fallback if RPC doesn't exist (less safe concurrent but works for proto)
            if (scoreError) {
                const { data: player } = await supabase.from('players').select('score').eq('id', playerId).single();
                await supabase.from('players').update({ score: (player?.score || 0) + points }).eq('id', playerId);
            }
        }

        return NextResponse.json({ success: true, isCorrect, points });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
