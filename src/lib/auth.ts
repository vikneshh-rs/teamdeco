import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "deco_admin_session";

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || "deco-portal-default-secret-key-32-chars-long";
}

export function generateToken(payload: string): string {
  const secret = getSessionSecret();
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export function verifyToken(token: string): boolean {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;
    const payload = Buffer.from(payloadB64, "base64url").toString("utf-8");
    const expected = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      const data = JSON.parse(payload);
      if (data.exp && Date.now() < data.exp) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken && verifyToken(sessionToken)) {
    return true;
  }

  // Also check Supabase Auth session if available
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return true;
    }
  } catch {
    // Ignore error
  }

  return false;
}

export async function setAdminSession(identifier: string) {
  const cookieStore = await cookies();
  const payload = JSON.stringify({
    user: identifier,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  });
  const token = generateToken(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);

  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    // Ignore error
  }
}
