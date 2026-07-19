import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = await getServerClient();
  const gameId = req.nextUrl.searchParams.get("gameId");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

  if (!gameId) {
    return NextResponse.json({ error: "gameId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { gameId, playerId, playerName, message } = await req.json();

    if (!gameId || !playerId || !playerName || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "Mensagem muito longa" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        game_id: gameId,
        player_id: playerId,
        player_name: playerName,
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
