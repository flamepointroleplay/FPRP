import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { exchangeCodeForToken, fetchDiscordProfile } from "../../lib/discord";
import { getUserByDiscordId, createPendingUser, refreshUserProfile, createSession } from "../../lib/db";
import { OAUTH_STATE_COOKIE, SESSION_COOKIE, sessionCookieOptions } from "../../lib/session";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, url, redirect }) => {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = cookies.get(OAUTH_STATE_COOKIE)?.value;
  cookies.delete(OAUTH_STATE_COOKIE, { path: "/" });

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirect("/login?error=state");
  }

  const redirectUri = `${url.origin}/auth/callback`;
  const tokenRes = await exchangeCodeForToken(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET, code, redirectUri);
  if (!tokenRes) return redirect("/login?error=token");

  const profile = await fetchDiscordProfile(tokenRes.access_token);
  if (!profile) return redirect("/login?error=profile");

  const db = env.DB;
  let user = await getUserByDiscordId(db, profile.id);
  if (!user) {
    user = await createPendingUser(db, {
      discordId: profile.id,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
    });
  } else {
    await refreshUserProfile(db, user.id, { username: profile.username, avatarUrl: profile.avatarUrl });
  }

  if (user.status === "suspended") {
    return redirect("/login?error=suspended");
  }

  const token = await createSession(db, user.id);
  cookies.set(SESSION_COOKIE, token, sessionCookieOptions(url));

  return redirect(user.status === "pending" ? "/pending" : "/member");
};
