export const SESSION_COOKIE = "fprp_session";
export const OAUTH_STATE_COOKIE = "fprp_oauth_state";

export function sessionCookieOptions(url: URL) {
  return {
    path: "/",
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

export function stateCookieOptions(url: URL) {
  return {
    path: "/",
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax" as const,
    maxAge: 60 * 10, // 10 minutes
  };
}
