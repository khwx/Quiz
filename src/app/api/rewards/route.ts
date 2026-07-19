import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export async function GET() {
  const supabase = await getServerClient();

  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .order("cost", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rewards: data || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  
  try {
    const { userId, rewardId } = await req.json();

    if (!userId || !rewardId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", rewardId)
      .single();

    if (rewardError || !reward) {
      return NextResponse.json({ error: "Reward not found" }, { status: 404 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("xp")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.xp < reward.cost) {
      return NextResponse.json({ error: "XP insuficiente" }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from("user_rewards")
      .insert({
        user_id: userId,
        reward_id: rewardId,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json({ error: "Já possuis esta recompensa" }, { status: 409 });
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const newXp = profile.xp - reward.cost;
    await supabase.from("profiles").update({ xp: newXp }).eq("id", userId);

    return NextResponse.json({ success: true, newXp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
