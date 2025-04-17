"use server"

import { cookies } from "next/headers"
import { authenticate } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function login(username: string, password: string) {
  const result = await authenticate(username, password)

  if (result.success) {
    // Устанавливаем cookie с токеном
    cookies().set({
      name: "auth_token",
      value: result.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 часа
    })

    return { success: true }
  }

  return { success: false, message: "Неверное имя пользователя или пароль" }
}

export async function logout() {
  cookies().delete("auth_token")
  redirect("/admin/login")
}
