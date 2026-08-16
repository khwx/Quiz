import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = await getServerClient();
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código em falta" }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar, invite_code")
    .eq("invite_code", normalized)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Código inválido" }, { status: 404 });
  }

  return NextResponse.json({ profile: data });
}
