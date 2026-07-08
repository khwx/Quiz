import { getServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await getServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    
    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    // Get player IDs linked to this auth user
    const { data: userPlayers } = await supabase
      .from("players")
      .select("id, game_id")
      .eq("user_id", user.id);
    
    const playerIds = userPlayers?.map(p => p.id) || [];
    
    // Get player's answers
    const { data: answers } = playerIds.length > 0
      ? await supabase
          .from("answers")
          .select("game_id, is_correct, points")
          .in("player_id", playerIds)
      : { data: [] };
    
    const userAnswers = answers || [];
    const totalGames = new Set(userAnswers.map(a => a.game_id)).size;
    const correctAnswers = userAnswers.filter(a => a.is_correct).length;
    const totalPoints = userAnswers.reduce((sum, a) => sum + (a.points || 0), 0);
    const accuracy = userAnswers.length > 0 
      ? Math.round((correctAnswers / userAnswers.length) * 100) 
      : 0;
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || profile?.username || "Player",
        avatar: profile?.avatar || "🎮",
        ...profile,
      },
      stats: {
        totalGames,
        correctAnswers,
        totalPoints,
        accuracy,
        wins: correctAnswers,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}