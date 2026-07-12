import { getServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await getServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get all players with their profiles, ordered by score
    const { data: players, error } = await supabase
      .from("players")
      .select("id, user_id, score, name, avatar")
      .order("score", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Deduplicate by user_id, keeping highest score
    const seen = new Map<string, typeof players[0]>();
    for (const p of players || []) {
      if (!p.user_id) continue;
      const existing = seen.get(p.user_id);
      if (!existing || (p.score || 0) > (existing.score || 0)) {
        seen.set(p.user_id, p);
      }
    }

    const leaderboard = Array.from(seen.values())
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 20)
      .map((p, i) => ({
        rank: i + 1,
        name: p.name || "Piloto",
        points: p.score || 0,
        avatar: p.avatar || "🎮",
        isMe: user ? p.user_id === user.id : false,
      }));

    // Get player count
    const { count } = await supabase
      .from("players")
      .select("id", { count: "exact", head: true })
      .not("user_id", "is", null);

    return NextResponse.json({ leaderboard, totalPlayers: count || 0 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
