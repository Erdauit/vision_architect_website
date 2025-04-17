const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Проверяем, существует ли директория для базы данных
const dbDir = path.join(process.cwd(), "db")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Проверяем, существует ли директория для загрузок
const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Запускаем инициализацию базы данных
console.log("Инициализация базы данных...")
try {
  // Запускаем Next.js сервер на короткое время для инициализации базы данных
  const server = execSync("npx next start -p 3001", { timeout: 5000 }).toString()
  console.log(server)
} catch (error) {
  // Игнорируем ошибку таймаута, так как нам нужно только запустить сервер на короткое время
}

// Делаем запрос к API для инициализации базы данных
try {
  execSync("curl http://localhost:3001/api/init-db")
  console.log("База данных успешно инициализирована!")
} catch (error) {
  console.error("Ошибка при инициализации базы данных:", error.message)
}

// Останавливаем сервер
try {
  execSync("npx kill-port 3001")
} catch (error) {
  // Игнорируем ошибку, если сервер уже остановлен
}
