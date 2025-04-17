import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Получаем токен из cookies
  const token = request.cookies.get("auth_token")?.value

  // Если это запрос к админской панели и токен отсутствует
  if (request.nextUrl.pathname.startsWith("/admin") && !token) {
    // Если это запрос к странице входа, пропускаем
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Иначе перенаправляем на страницу входа
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: ["/admin/:path*"],
}
