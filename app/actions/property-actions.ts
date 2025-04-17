"use server"

import { revalidatePath } from "next/cache"
import { saveFileToPublic } from "@/lib/upload"
import { getDb } from "@/lib/db"

export async function addProperty(formData: FormData) {
  try {
    const db = await getDb()

    // Извлекаем данные из формы
    const title = formData.get("title") as string
    const area = Number.parseFloat(formData.get("area") as string)
    const type = formData.get("type") as "apartments" | "commercial"

    console.log("Добавление объекта:", { title, area, type })

    // Добавляем объект в базу данных
    const result = await db.run("INSERT INTO properties (title, area, type) VALUES (?, ?, ?)", [title, area, type])

    const propertyId = result.lastID
    console.log("Объект добавлен с ID:", propertyId)

    // Обрабатываем загруженные изображения
    const imageFiles = formData.getAll("images") as File[]
    console.log(`Получено ${imageFiles.length} изображений`)

    // Сохраняем каждое изображение и создаем запись в базе данных
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      if (file && file.size > 0) {
        try {
          console.log(`Обработка изображения ${i + 1}, размер: ${file.size} байт, имя: ${file.name}`)

          // Сохраняем файл и получаем URL
          const imageUrl = await saveFileToPublic(file)
          console.log(`Изображение сохранено по пути: ${imageUrl}`)

          // Создаем запись об изображении в базе данных
          // Первое изображение помечаем как превью
          const isPreview = i === 0 ? 1 : 0
          await db.run("INSERT INTO images (property_id, url, alt, is_preview) VALUES (?, ?, ?, ?)", [
            propertyId,
            imageUrl,
            `${title} - изображение ${i + 1}`,
            isPreview,
          ])
          console.log(`Запись об изображении добавлена в базу данных, превью: ${isPreview}`)
        } catch (error) {
          console.error(`Ошибка при сохранении изображения ${i + 1}:`, error)
          // Продолжаем с другими изображениями
        }
      } else {
        console.log(`Изображение ${i + 1} пустое или имеет нулевой размер`)
      }
    }

    // Если изображений нет или все они не удалось сохранить, добавляем плейсхолдер
    const imageCount = await db.get("SELECT COUNT(*) as count FROM images WHERE property_id = ?", [propertyId])
    if (imageCount.count === 0) {
      console.log("Добавление плейсхолдера, так как нет сохраненных изображений")
      await db.run("INSERT INTO images (property_id, url, alt, is_preview) VALUES (?, ?, ?, ?)", [
        propertyId,
        "/placeholder.svg?height=400&width=600",
        `${title} - плейсхолдер`,
        1, // Плейсхолдер всегда превью
      ])
    }

    // Обновляем кэш страниц
    revalidatePath("/offers")
    revalidatePath("/admin")

    return { success: true, message: "Объект недвижимости успешно добавлен" }
  } catch (error) {
    console.error("Ошибка при добавлении объекта:", error)
    return { success: false, message: `Произошла ошибка при добавлении объекта: ${error.message}` }
  }
}

export async function getProperties() {
  try {
    const db = await getDb()

    // Получаем все объекты недвижимости
    const properties = await db.all("SELECT * FROM properties ORDER BY created_at DESC")

    // Для каждого объекта получаем изображения
    const result = []

    for (const property of properties) {
      // Получаем превью-изображение
      const previewImage = await db.get("SELECT url FROM images WHERE property_id = ? AND is_preview = 1 LIMIT 1", [
        property.id,
      ])

      // Получаем все изображения для объекта
      const images = await db.all("SELECT url FROM images WHERE property_id = ? ORDER BY is_preview DESC", [
        property.id,
      ])
      const imageUrls = images.map((img) => img.url)

      result.push({
        id: property.id,
        title: property.title,
        area: property.area,
        type: property.type,
        image: previewImage ? previewImage.url : imageUrls[0] || "/placeholder.svg?height=400&width=600",
        images: imageUrls,
      })
    }

    return result
  } catch (error) {
    console.error("Ошибка при получении объектов недвижимости:", error)
    return []
  }
}

export async function getPropertyById(id: number) {
  try {
    const db = await getDb()

    // Получаем объект недвижимости по ID
    const property = await db.get("SELECT * FROM properties WHERE id = ?", [id])

    if (!property) {
      return null
    }

    // Получаем превью-изображение
    const previewImage = await db.get("SELECT url FROM images WHERE property_id = ? AND is_preview = 1 LIMIT 1", [id])

    // Получаем все изображения для объекта
    const images = await db.all("SELECT url FROM images WHERE property_id = ? ORDER BY is_preview DESC", [id])
    const imageUrls = images.map((img) => img.url)

    return {
      ...property,
      image: previewImage ? previewImage.url : imageUrls[0] || "/placeholder.svg?height=400&width=600",
      images: imageUrls,
    }
  } catch (error) {
    console.error(`Ошибка при получении объекта с ID ${id}:`, error)
    return null
  }
}

export async function deleteProperty(id: number) {
  try {
    const db = await getDb()

    // Удаляем объект недвижимости (каскадное удаление также удалит связанные изображения)
    await db.run("DELETE FROM properties WHERE id = ?", [id])

    // Обновляем кэш страниц
    revalidatePath("/offers")
    revalidatePath("/admin")

    return { success: true, message: "Объект недвижимости успешно удален" }
  } catch (error) {
    console.error(`Ошибка при удалении объекта с ID ${id}:`, error)
    return { success: false, message: "Произошла ошибка при удалении объекта" }
  }
}

export async function updatePropertyPreview(propertyId: number, imageUrl: string) {
  try {
    const db = await getDb()

    // Сначала сбрасываем все флаги превью
    await db.run("UPDATE images SET is_preview = 0 WHERE property_id = ?", [propertyId])

    // Устанавливаем новое превью-изображение
    await db.run("UPDATE images SET is_preview = 1 WHERE property_id = ? AND url = ?", [propertyId, imageUrl])

    // Обновляем кэш страниц
    revalidatePath("/offers")
    revalidatePath("/admin")

    return { success: true, message: "Превью-изображение успешно обновлено" }
  } catch (error) {
    console.error(`Ошибка при обновлении превью для объекта с ID ${propertyId}:`, error)
    return { success: false, message: "Произошла ошибка при обновлении превью-изображения" }
  }
}
