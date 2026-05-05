import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/account"]; // anpassen

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!PROTECTED.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Nur Cookie check (Name ggf. an Better Auth Cookie-Namen anpassen)
  const hasSession = req.cookies.get("better-auth.session")?.value;
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*"], // anpassen
};