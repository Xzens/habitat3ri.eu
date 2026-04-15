import { NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email(),
  locale: z.enum(["fr", "nl"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const data = {
      email: body.get("email") as string,
      locale: body.get("locale") as string,
    };

    const parsed = newsletterSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // In production, save to Supabase:
    // const { error } = await supabase
    //   .from("newsletter_subscribers")
    //   .upsert({ email: parsed.data.email, locale: parsed.data.locale });
    // if (error) throw error;

    console.log("[Newsletter]", parsed.data.email, parsed.data.locale);

    // Redirect back with success param
    const referer = request.headers.get("referer") || "/";
    return NextResponse.redirect(new URL(`${referer}?newsletter=success`), 303);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
