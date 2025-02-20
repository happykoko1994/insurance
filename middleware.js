import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Проверяем, если пользователь зашел на /admin
  if (pathname.startsWith("/admin")) {
    const auth = req.headers.get("authorization");
    const expectedAuth = `Basic ${Buffer.from(
      `${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`
    ).toString("base64")}`;

    if (auth !== expectedAuth) {
      return new Response("Unauthorized", { 
        status: 401, 
        headers: { "WWW-Authenticate": "Basic" } 
      });
    }
  }

  return NextResponse.next(); // Позволяет доступ к остальным страницам
}
