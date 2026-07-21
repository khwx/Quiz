import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { validateAnswerPayload } from "@/lib/validation";
import { getServerClient } from "@/lib/supabase";
import { createContextLogger } from "@/lib/logger";
import {
  calculateEnhancedScore,
  calculateCategoryMastery,
} from "@/lib/scoring";

const log = createContextLogger("API/answer");

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
      log.error("Game lookup failed", { gameId }, gameError);
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const buzzerMode = game.settings?.buzzer_mode === true;
    let isBuzzer = false;

    if (buzzerMode) {
      const { count } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("game_id", gameId)
        .eq("question_id", questionId);
      isBuzzer = (count || 0) === 0;
    }

    let correctOption = game.settings?.current_correct_option;

    if (correctOption === undefined) {
      log.warn("current_correct_option not found in game settings. Falling back to DB.", { gameId });
      const { data: questionData } = await supabase
        .from("questions")
        .select("correct_option")
        .eq("id", questionId)
        .single();

      if (questionData && questionData.correct_option !== undefined) {
        correctOption = questionData.correct_option;
      } else {
        log.error("correct_option completely missing", { questionId });
        return NextResponse.json({ error: "Erro no estado do jogo" }, { status: 500 });
      }
    }

    const { data: questionData } = await supabase
      .from("questions")
      .select("category, age_rating, difficulty, timer")
      .eq("id", questionId)
      .single();

    const isCorrect = correctOption === chosenOption;

    const { data: playerStreakData } = await supabase
      .from('players')
      .select('current_streak, max_streak, category_stats, buzzer_wins, buzzer_attempts, buzzer_losses, total_questions')
      .eq('id', playerId)
      .single();

    const currentStreak = playerStreakData?.current_streak || 0;
    const maxStreak = playerStreakData?.max_streak || 0;
    const categoryStats = playerStreakData?.category_stats || {};

    const questionCategory = questionData?.category || 'CULTURA_GERAL';
    const ageRating = questionData?.age_rating || 10;
    const timerDuration = questionData?.timer || 30;

    const catStats = categoryStats[questionCategory] || { correct: 0, total: 0 };

    const enhancedScore = isCorrect ? calculateEnhancedScore({
      isCorrect: true,
      timeTaken,
      timerDuration,
      category: questionCategory,
      ageRating,
      currentStreak,
      categoryStreak: currentStreak,
      categoryCorrect: catStats.correct,
      categoryTotal: catStats.total,
      isBuzzerMode: isBuzzer,
      isBuzzerWinner: isBuzzer && isCorrect,
      buzzerWins: playerStreakData?.buzzer_wins || 0,
      buzzerAttempts: playerStreakData?.buzzer_attempts || 0,
      buzzerLosses: playerStreakData?.buzzer_losses || 0,
      totalQuestions: playerStreakData?.total_questions || 0,
    }) : null;

    const points = enhancedScore?.points || 0;
    const streakBonus = enhancedScore?.streakResult?.streakBonus || 0;
    const categoryBonus = enhancedScore?.categoryBonus || 0;
    const timeBonus = enhancedScore?.timeBonus || 0;
    const buzzerBonus = enhancedScore?.breakdown?.buzzer || 0;
    const difficultyMultiplier = enhancedScore?.finalMultiplier || 1.0;

    if (buzzerMode && isBuzzer && !isCorrect) {
      // keep points at 0 for buzzer mode wrong answer
    }

    const { error: insertError } = await supabase.from("answers").insert({
      game_id: gameId,
      player_id: playerId,
      question_id: questionId,
      chosen_option: chosenOption,
      time_taken: timeTaken,
      is_correct: isCorrect,
      points,
      streak_at_answer: isCorrect ? currentStreak + 1 : 0,
      category_bonus: categoryBonus,
      time_bonus: timeBonus,
      streak_bonus: streakBonus,
      difficulty_multiplier: difficultyMultiplier,
      buzzer_bonus: buzzerBonus,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (isCorrect) {
      const newStreak = currentStreak + 1;
      const newMaxStreak = Math.max(maxStreak, newStreak);

      const newCategoryStats = { ...categoryStats };
      if (!newCategoryStats[questionCategory]) {
        newCategoryStats[questionCategory] = { correct: 0, total: 0 };
      }
      newCategoryStats[questionCategory].correct += 1;
      newCategoryStats[questionCategory].total += 1;

      const { data: player } = await supabase.from('players').select('score, lives, eliminated, user_id').eq('id', playerId).single();
      const newScore = (player?.score || 0) + points;

      const { error: scoreError } = await supabase
        .from('players')
        .update({
          score: newScore,
          current_streak: newStreak,
          max_streak: newMaxStreak,
          category_stats: newCategoryStats,
        })
        .eq('id', playerId);

      if (scoreError) {
        log.warn("Score update failed", { playerId });
      }

      if (player?.user_id) {
        const xpGained = Math.round(points / 10);
        const { data: profile } = await supabase.from('profiles').select('xp, level').eq('id', player.user_id).single();
        const newXp = (profile?.xp || 0) + xpGained;
        const xpForNextLevel = (profile?.level || 1) * 100;
        const newLevel = newXp >= xpForNextLevel ? (profile?.level || 1) + 1 : (profile?.level || 1);
        await supabase.from('profiles').update({ xp: newXp, level: newLevel }).eq('id', player.user_id);
      }

      const { data: updatedPlayer } = await supabase
        .from('players')
        .select('score, lives, eliminated, current_streak, max_streak, category_stats, buzzer_wins, buzzer_attempts, buzzer_losses, total_questions')
        .eq('id', playerId)
        .single();

      const newlyUnlocked = checkNewAchievements(
        updatedPlayer?.category_stats || {},
        updatedPlayer?.current_streak || 0,
        updatedPlayer?.max_streak || 0,
        isCorrect,
        isBuzzer,
        new Set()
      );

      for (const achId of newlyUnlocked) {
        await supabase.from('achievements').insert({
          player_id: playerId,
          achievement_id: achId,
          game_id: gameId,
          unlocked_at: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        success: true,
        isCorrect,
        points,
        isBuzzer,
        streak: updatedPlayer?.current_streak || 0,
        maxStreak: updatedPlayer?.max_streak || 0,
        categoryBonus,
        timeBonus,
        streakBonus,
        difficultyMultiplier,
        buzzerBonus,
        totalPoints: points,
        newAchievements: newlyUnlocked,
        categoryMastery: calculateCategoryMastery(
          updatedPlayer?.category_stats || {},
          questionCategory
        ),
        breakdown: enhancedScore?.breakdown || null,
      });
    } else {
      const { data: player } = await supabase.from('players').select('lives, eliminated').eq('id', playerId).single();
      const currentLives = player?.lives ?? 3;
      const newLives = Math.max(0, currentLives - 1);
      const isEliminated = newLives === 0;

      const { error: livesError } = await supabase
        .from('players')
        .update({
          lives: newLives,
          eliminated: isEliminated,
          current_streak: 0,
        })
        .eq('id', playerId);

      if (livesError) {
        log.warn("Lives update failed", { playerId });
      }

      const newCategoryStats = { ...categoryStats };
      if (!newCategoryStats[questionCategory]) {
        newCategoryStats[questionCategory] = { correct: 0, total: 0 };
      }
      newCategoryStats[questionCategory].total += 1;

      await supabase
        .from('players')
        .update({ category_stats: newCategoryStats })
        .eq('id', playerId);

      return NextResponse.json({
        success: true,
        isCorrect,
        points,
        lives: newLives,
        eliminated: isEliminated,
        isBuzzer,
        streak: 0,
        maxStreak,
        categoryBonus: 0,
        timeBonus: 0,
        streakBonus: 0,
      });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    const gameId = error instanceof Error ? (error as unknown as Record<string, unknown>).gameId as string | undefined : undefined;
    log.error("Unhandled error", { gameId }, error instanceof Error ? error : undefined);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function checkNewAchievements(
  categoryStats: Record<string, { correct: number; total: number }>,
  currentStreak: number,
  maxStreak: number,
  isCorrect: boolean,
  isBuzzer: boolean,
  unlockedAchievementIds: Set<string>
): string[] {
  const newlyUnlocked: string[] = [];

  if (currentStreak >= 3 && !unlockedAchievementIds.has('STREAK_3')) newlyUnlocked.push('STREAK_3');
  if (currentStreak >= 5 && !unlockedAchievementIds.has('STREAK_5')) newlyUnlocked.push('STREAK_5');
  if (currentStreak >= 7 && !unlockedAchievementIds.has('STREAK_7')) newlyUnlocked.push('STREAK_7');
  if (currentStreak >= 10 && !unlockedAchievementIds.has('STREAK_10')) newlyUnlocked.push('STREAK_10');
  if (currentStreak >= 15 && !unlockedAchievementIds.has('STREAK_15')) newlyUnlocked.push('STREAK_15');

  for (const [category, stats] of Object.entries(categoryStats)) {
    const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
    if (stats.total >= 20 && accuracy >= 0.9) {
      const masteryId = getCategoryMasteryId(category);
      if (masteryId && !unlockedAchievementIds.has(masteryId)) {
        newlyUnlocked.push(masteryId);
      }
    }
  }

  return newlyUnlocked;
}

function getCategoryMasteryId(category: string): string | null {
  const masteryMap: Record<string, string> = {
    'CIENCIA': 'SCIENCE_MASTER',
    'HISTÓRIA': 'HISTORY_MASTER',
    'GEOGRAFIA': 'GEOGRAPHY_MASTER',
    'CAPITAIS_DO_MUNDO': 'CAPITALS_MASTER',
    'BANDEIRAS': 'FLAGS_MASTER',
  };
  return masteryMap[category] || null;
}
