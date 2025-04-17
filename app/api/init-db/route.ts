import { NextResponse } from "next/server"
import { initializeDb } from "@/lib/db"

export async function GET() {
  try {
    await initializeDb()
    return NextResponse.json({ success: true, message: "База данных успешно инициализирована" })
  } catch (error) {
    console.error("Ошибка при инициализации базы данных:", error)
    return NextResponse.json(
      { success: false, message: "Произошла ошибка при инициализации базы данных" },
      { status: 500 },
    )
  }
}
