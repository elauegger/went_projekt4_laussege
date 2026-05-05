// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * PUBLIC_ROUTES:
 * Alle Routen, die NICHT geschützt werden sollen.
 * - Subpaths werden automatisch ausgeschlossen (z. B. /login/*)
 * - Keine Substring-Probleme (z. B. /login123 wird NICHT ausgeschlossen)
 */
const PUBLIC_ROUTES = [
  "/",            // Landing Page
  "/signin",
  "/signup",
  "/favicon.ico",
  "/public",
  "/api/auth",
  "/_next",
  "/static",
];

/**
 * Middleware-Proxy:
 * - Schützt alle Routen außer PUBLIC_ROUTES
 * - Leitet nicht eingeloggte User auf "/" weiter
 */
export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Wenn Route öffentlich → Middleware überspringen
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Geschützte Route → Session prüfen
  if (sessionCookie) {
    return NextResponse.next();
  }

  // Kein Login → redirect auf "/"
  const redirectUrl = new URL("/", request.url);
  redirectUrl.searchParams.set("protected", "1");
  return NextResponse.redirect(redirectUrl);
}

/**
 * Matcher:
 * - Middleware wird nur auf App-Router-Routen angewendet
 * - PUBLIC_ROUTES werden durch die Logik oben ausgeschlossen
 */
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
