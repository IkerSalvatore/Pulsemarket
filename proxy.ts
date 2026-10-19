import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
