import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = await getServerClient();
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ friends: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { userId, friendId } = await req.json();

    if (!userId || !friendId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (userId === friendId) {
      return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("friends")
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Pedido já existe" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ friend: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { userId, friendId, status } = await req.json();

    if (!userId || !friendId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("friends")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("user_id", friendId)
      .eq("friend_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ friend: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { userId, friendId } = await req.json();

    if (!userId || !friendId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error } = await supabase
      .from("friends")
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
