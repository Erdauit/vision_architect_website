import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Функция для сохранения файла с уникальным именем
export async function saveFileToPublic(file: File | Blob): Promise<string> {
  try {
    // Создаем директорию для загрузок, если она не существует
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Получаем оригинальное имя файла, если оно есть
    let originalName = ""
    if (file instanceof File) {
      originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    }

    // Генерируем уникальное имя файла с временной меткой и UUID
    const timestamp = new Date().getTime()
    const uniqueId = uuidv4().substring(0, 8)
    const fileName = `${timestamp}_${uniqueId}_${originalName || "image.jpg"}`
    const filePath = path.join(uploadDir, fileName)

    // Преобразуем File/Blob в Buffer и сохраняем
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(filePath, buffer)

    // Возвращаем путь к файлу для использования в приложении
    return `/uploads/${fileName}`
  } catch (error) {
    console.error("Ошибка при сохранении файла:", error)
    return "/placeholder.svg?height=400&width=600"
  }
}
