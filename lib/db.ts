import { Database } from "sqlite3"
import { open, type Database as SQLiteDatabase } from "sqlite"
import fs from "fs"
import path from "path"

// Убедимся, что директория для базы данных существует
const dbDir = path.join(process.cwd(), "db")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Убедимся, что директория для загрузок существует
const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const dbPath = path.join(dbDir, "real-estate.db")

let db: SQLiteDatabase | null = null

export async function getDb() {
  if (db) return db

  db = await open({
    filename: dbPath,
    driver: Database,
  })

  // Включаем поддержку внешних ключей
  await db.exec("PRAGMA foreign_keys = ON;")

  // Создаем таблицы, если они не существуют
  await db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      area REAL NOT NULL,
      type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Проверяем, существует ли столбец is_preview в таблице images
  const tableInfo = await db.all("PRAGMA table_info(images)")
  const hasIsPreviewColumn = tableInfo.some((column) => column.name === "is_preview")

  if (!hasIsPreviewColumn) {
    // Если таблица images существует, но нет столбца is_preview, добавляем его
    try {
      await db.exec(`
        ALTER TABLE images ADD COLUMN is_preview INTEGER DEFAULT 0;
      `)
      console.log("Добавлен столбец is_preview в таблицу images")
    } catch (error) {
      // Если таблицы еще нет, это нормально, она будет создана ниже
      console.log("Не удалось добавить столбец is_preview, возможно таблица еще не существует")
    }
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt TEXT,
      is_preview INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    );
  `)

  // Если столбец is_preview был только что добавлен, обновляем существующие записи
  if (!hasIsPreviewColumn) {
    try {
      // Для каждого объекта недвижимости устанавливаем первое изображение как превью
      const properties = await db.all("SELECT id FROM properties")

      for (const property of properties) {
        const firstImage = await db.get("SELECT id FROM images WHERE property_id = ? ORDER BY id ASC LIMIT 1", [
          property.id,
        ])
        if (firstImage) {
          await db.run("UPDATE images SET is_preview = 1 WHERE id = ?", [firstImage.id])
        }
      }

      console.log("Обновлены превью-изображения для существующих объектов")
    } catch (error) {
      console.error("Ошибка при обновлении превью-изображений:", error)
    }
  }

  return db
}

// Функция для закрытия соединения с базой данных
export async function closeDb() {
  if (db) {
    await db.close()
    db = null
  }
}

// Функция для инициализации базы данных с примерами данных
export async function initializeDb() {
  const db = await getDb()

  // Проверяем, есть ли уже данные в таблице properties
  const count = await db.get("SELECT COUNT(*) as count FROM properties")

  // Если данных нет, добавляем примеры
  if (count.count === 0) {
    console.log("Инициализация базы данных с примерами данных...")

    // Добавляем примеры объектов недвижимости
    const properties = [
      {
        title: "Современные апартаменты",
        area: 120,
        type: "apartments",
      },
      {
        title: "Пентхаус с террасой",
        area: 180,
        type: "apartments",
      },
      {
        title: "Студия в центре",
        area: 45,
        type: "apartments",
      },
      {
        title: "Офисное помещение",
        area: 200,
        type: "commercial",
      },
      {
        title: "Торговое помещение",
        area: 150,
        type: "commercial",
      },
      {
        title: "Двухуровневые апартаменты",
        area: 160,
        type: "apartments",
      },
    ]

    for (const property of properties) {
      const result = await db.run("INSERT INTO properties (title, area, type) VALUES (?, ?, ?)", [
        property.title,
        property.area,
        property.type,
      ])

      const propertyId = result.lastID

      // Добавляем примеры изображений для каждого объекта
      await db.run("INSERT INTO images (property_id, url, alt, is_preview) VALUES (?, ?, ?, ?)", [
        propertyId,
        "/placeholder.svg?height=400&width=600",
        `${property.title} - изображение 1`,
        1, // Первое изображение как превью
      ])

      await db.run("INSERT INTO images (property_id, url, alt, is_preview) VALUES (?, ?, ?, ?)", [
        propertyId,
        "/placeholder.svg?height=400&width=600",
        `${property.title} - изображение 2`,
        0,
      ])
    }

    console.log("База данных успешно инициализирована с примерами данных")
  } else {
    console.log("База данных уже содержит данные, инициализация не требуется")
  }
}
