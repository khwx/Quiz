import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfexrtxrxmeajxtuoof.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9UJr6k6WUFOIOn4Iebynpg_ROzznDve';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client that reads auth from cookies
export async function getServerClient() {
  const { cookies } = await import('next/headers');
  const { createServerClient: createSSRClient } = await import('@supabase/ssr');

  const cookieStore = await cookies();

  return createSSRClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component - ignore
        }
      },
    },
  });
}
