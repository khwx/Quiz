import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // Get profile data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    // Get player's answers
    const { data: answers } = await supabase
      .from("answers")
      .select("game_id, is_correct, score")
      .eq("player_id", user.id);
    
    const userAnswers = answers || [];
    const totalGames = new Set(userAnswers.map(a => a.game_id)).size;
    const correctAnswers = userAnswers.filter(a => a.is_correct).length;
    const totalPoints = userAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
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
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}