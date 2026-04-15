import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  country: z.enum(["be", "nl", "lu", "fr"]),
  projectType: z.enum(["solar", "insulation", "renovation", "smartHome", "bundle", "other"]),
  message: z.string().max(2000).optional(),
  locale: z.enum(["fr", "nl"]),
  consent: z.literal("on"),
});

const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 3;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  requestLog.set(ip, recent);
  if (recent.length >= MAX_REQUESTS) return true;
  recent.push(now);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { consent: _consent, ...data } = parsed.data;

    // In production, save to Supabase:
    // const { error } = await supabase.from("contact_submissions").insert(data);
    // if (error) throw error;

    console.log("[Contact Form]", JSON.stringify(data));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
