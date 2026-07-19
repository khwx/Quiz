import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return Response.json({ error: "gameId é obrigatório." }, { status: 400 });
    }

    await supabase.from("answers").delete().eq("game_id", gameId);
    await supabase.from("players").delete().eq("game_id", gameId);
    await supabase.from("games").update({ status: "LOBBY", settings: {} }).eq("id", gameId);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Erro ao reiniciar jogo." }, { status: 500 });
  }
}
