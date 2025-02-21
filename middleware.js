import { NextResponse } from "next/server";

const failedAttempts = new Map(); // Хранилище попыток (IP -> { count, blockedUntil })
const BLOCK_TIME = 60 * 1000; // 1 минута блокировки
const MAX_FAILED_ATTEMPTS = 5; // Количество попыток перед блокировкой

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.ip || "unknown";

    // Проверяем, не заблокирован ли IP
    const record = failedAttempts.get(ip);
    if (record && record.blockedUntil && record.blockedUntil > Date.now()) {
      return new Response("Превышен лимит неудачных попыток, попробуйте позже.", { status: 403 });
    }

    // Проверяем авторизацию
    const auth = req.headers.get("authorization")?.trim();
    
    const adminUser = process.env.ADMIN_USER;
    const adminPass = process.env.ADMIN_PASS;

    if (!adminUser || !adminPass) {
      console.error("ADMIN_USER или ADMIN_PASS не заданы!");
      return new Response("Ошибка сервера", { status: 500 });
    }
    
    const expectedAuth = `Basic ${Buffer.from(`${adminUser}:${adminPass}`).toString("base64")}`;

    if (auth !== expectedAuth) {
      // Записываем неудачную попытку
      const attempts = record ? record.count + 1 : 1;
      
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        failedAttempts.set(ip, { count: attempts, blockedUntil: Date.now() + BLOCK_TIME });
        return new Response("Превышен лимит неудачных попыток, попробуйте позже.", { status: 403 });
      }

      failedAttempts.set(ip, { count: attempts, blockedUntil: null });
      return new Response("Unauthorized", { status: 401, headers: { "WWW-Authenticate": "Basic" } });
    }

    // Если вход успешный — сбрасываем счетчик попыток
    failedAttempts.delete(ip);
  }

  return NextResponse.next();
}
