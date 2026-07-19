import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { fromUserId, toUserId, gameId, gamePin } = await req.json();

    if (!fromUserId || !toUserId || !gameId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: toUserId,
        type: "invite",
        title: "Convite para jogo",
        description: `Foi-te convidado para um jogo (PIN: ${gamePin})`,
        data: { gameId, gamePin, fromUserId },
        read: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
