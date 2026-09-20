import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { getDiscordAuthorizeUrl } from "../../lib/discord";
import { OAUTH_STATE_COOKIE, stateCookieOptions } from "../../lib/session";

export const prerender = false;

export const GET: APIRoute = ({ cookies, url, redirect }) => {
  const state = crypto.randomUUID();
  cookies.set(OAUTH_STATE_COOKIE, state, stateCookieOptions(url));

  const redirectUri = `${url.origin}/auth/callback`;
  const authorizeUrl = getDiscordAuthorizeUrl(env.DISCORD_CLIENT_ID, redirectUri, state);
  return redirect(authorizeUrl);
};
