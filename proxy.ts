import { auth } from "@/auth";

export const proxy = auth;

export const config = {
  matcher: ["/((?!login|about|api/auth|_next/static|_next/image|favicon.ico).*)"],
};
