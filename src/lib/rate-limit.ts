type RateLimiterStore = {
  [key: string]: { count: number; resetTime: number };
};

const store: RateLimiterStore = {};

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

export function rateLimit(key: string): { success: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store[key];

  if (!entry || now > entry.resetTime) {
    store[key] = { count: 1, resetTime: now + WINDOW_MS };
    return { success: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count, resetIn: entry.resetTime - now };
}

export function getRateLimitKey(req: Request, prefix: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             "unknown";
  return `${prefix}:${ip}`;
}