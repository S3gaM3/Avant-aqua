import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthSecret } from "@/lib/env";

export async function middleware(req: NextRequest) {
  const secret = getAuthSecret();
  const token = secret ? await getToken({ req, secret }) : null;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/account")) {
    if (!token) {
      const signIn = new URL("/api/auth/signin", req.url);
      signIn.searchParams.set("callbackUrl", `${path}${req.nextUrl.search}`);
      return NextResponse.redirect(signIn);
    }
    return NextResponse.next();
  }

  if (path.startsWith("/dev")) {
    if (!token) {
      const signIn = new URL("/api/auth/signin", req.url);
      signIn.searchParams.set("callbackUrl", `${path}${req.nextUrl.search}`);
      return NextResponse.redirect(signIn);
    }
    if (!token.wpIsAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/dev/:path*"],
};
