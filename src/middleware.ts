import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { getUserBySessionToken } from "./lib/db";
import { tierAtLeast } from "./lib/tier";
import { SESSION_COOKIE } from "./lib/session";

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, locals, url, redirect } = context;
  const token = cookies.get(SESSION_COOKIE)?.value;

  locals.user = null;

  if (token) {
    const user = await getUserBySessionToken(env.DB, token);
    if (user) locals.user = user;
  }

  const path = url.pathname;
  const user = locals.user;

  if (path === "/login") {
    if (user?.status === "active") return redirect("/member");
    return next();
  }

  if (path.startsWith("/auth/")) return next();

  if (path === "/pending") {
    if (!user) return redirect("/login");
    if (user.status === "active") return redirect("/member");
    return next();
  }

  const isProtected =
    path === "/member" || path.startsWith("/member/") ||
    path === "/team" || path.startsWith("/team/") ||
    path === "/staff" || path.startsWith("/staff/");

  if (isProtected) {
    if (!user) return redirect("/login");
    if (user.status !== "active") return redirect("/pending");

    if ((path === "/team" || path.startsWith("/team/")) && !tierAtLeast(user.tier, "supervisor")) {
      return redirect("/member");
    }
    if ((path === "/staff" || path.startsWith("/staff/")) && !tierAtLeast(user.tier, "staff")) {
      return redirect("/member");
    }
  }

  return next();
});
