import { type NextRequest, NextResponse } from "next/server"
import { SignJWT, jwtVerify } from "jose"

// Фиксированные учетные данные для админа
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "vision2024"

// Секретный ключ для JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long-here")

// Функция для проверки учетных данных
export async function authenticate(username: string, password: string) {
  // Проверяем, совпадают ли учетные данные
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Создаем JWT токен
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Токен действителен 24 часа
      .sign(JWT_SECRET)

    return { success: true, token }
  }

  return { success: false, message: "Неверное имя пользователя или пароль" }
}

// Функция для проверки JWT токена
export async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  if (!token) {
    return false
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return !!verified.payload.username
  } catch (error) {
    return false
  }
}

// Middleware для защиты маршрутов
export async function authMiddleware(request: NextRequest) {
  const isAuthenticated = await verifyAuth(request)

  // Если это запрос к админской панели и пользователь не аутентифицирован
  if (request.nextUrl.pathname.startsWith("/admin") && !isAuthenticated) {
    // Если это запрос к странице входа, пропускаем
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Иначе перенаправляем на страницу входа
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return NextResponse.next()
}
