# VISION ARCHITECTS - Сайт недвижимости

Минималистичный веб-сайт для компании недвижимости с возможностью управления объектами через админ-панель.

![Сайт недвижимости VISION ARCHITECTS](/placeholder.svg?height=400&width=600)

## Содержание

- [Описание проекта](#описание-проекта)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
- [Настройка базы данных](#настройка-базы-данных)
- [Администрирование](#администрирование)
- [Развертывание на продакшн](#развертывание-на-продакшн)
- [Настройка на собственном сервере](#настройка-на-собственном-сервере)
- [Дополнительные настройки](#дополнительные-настройки)
- [Поддержка и обновления](#поддержка-и-обновления)

## Описание проекта

VISION ARCHITECTS - это веб-сайт для компании недвижимости, разработанный с использованием Next.js и SQLite. Сайт обладает следующими функциями:

- Минималистичный дизайн с адаптивной версткой
- Каталог объектов недвижимости с фильтрацией
- Детальные страницы объектов с галереей изображений
- Админ-панель для управления объектами
- Защищенная система аутентификации для администраторов
- Локальное хранение изображений
- Многоязычность (заготовка)

## Требования

Для работы с проектом вам потребуется:

- Node.js 18.x или выше
- npm 7.x или выше (включен в Node.js)
- SQLite (включен как зависимость, не требует отдельной установки)
- Современный веб-браузер
- Минимум 1 ГБ свободного места на диске

## Установка и запуск

### Клонирование репозитория

\`\`\`bash
git clone <url_репозитория>
cd real-estate-website
\`\`\`

### Установка зависимостей

\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

> **Примечание**: Флаг `--legacy-peer-deps` необходим из-за конфликта зависимостей с библиотекой date-fns.

### Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

\`\`\`
JWT_SECRET=ваш_секретный_ключ_минимум_32_символа
\`\`\`

> **Важно**: Секретный ключ должен быть надежным и содержать не менее 32 символов. Вы можете сгенерировать его, выполнив в терминале:
> \`\`\`bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Инициализация базы данных

\`\`\`bash
npm run init-db
\`\`\`

Эта команда создаст базу данных SQLite с начальными данными для демонстрации.

### Запуск в режиме разработки

\`\`\`bash
npm run dev
\`\`\`

После запуска сайт будет доступен по адресу [http://localhost:3000](http://localhost:3000)

### Сборка для продакшна

\`\`\`bash
npm run build
\`\`\`

### Запуск в продакшн-режиме

\`\`\`bash
npm start
\`\`\`

## Настройка базы данных

Проект использует SQLite в качестве базы данных, которая хранится локально в директории `/db`.

### Структура базы данных

База данных содержит две основные таблицы:

- `properties` - объекты недвижимости
- `images` - изображения объектов недвижимости

### Резервное копирование данных

Рекомендуется регулярно создавать резервные копии файла базы данных:

\`\`\`bash
# Создание резервной копии
cp db/real-estate.db db/real-estate.db.backup-$(date +%Y%m%d)
\`\`\`

### Импорт/экспорт данных

Для экспорта/импорта данных можно использовать стандартные инструменты SQLite:

\`\`\`bash
# Экспорт данных
sqlite3 db/real-estate.db .dump > dump.sql

# Импорт данных
sqlite3 db/real-estate.db < dump.sql
\`\`\`

## Администрирование

### Доступ к админ-панели

Админ-панель доступна по адресу [http://localhost:3000/admin](http://localhost:3000/admin)

### Учетные данные по умолчанию

\`\`\`
Имя пользователя: admin
Пароль: vision2024
\`\`\`

> **Важно**: После первого входа рекомендуется изменить пароль по умолчанию в файле `lib/auth.ts`.

### Управление объектами недвижимости

В админ-панели вы можете:

- Добавлять новые объекты недвижимости
- Загружать изображения объектов (несколько за раз)
- Выбирать превью-изображение для каждого объекта
- Удалять существующие объекты

## Развертывание на продакшн

### Подготовка к деплою

1. Соберите проект для продакшн:
   \`\`\`bash
   npm run build
   \`\`\`

2. Убедитесь, что все переменные окружения настроены правильно.

### Деплой на Vercel (рекомендуется)

1. Установите Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. Авторизуйтесь в Vercel:
   \`\`\`bash
   vercel login
   \`\`\`

3. Деплой проекта:
   \`\`\`bash
   vercel --prod
   \`\`\`

4. Настройте переменные окружения в панели управления Vercel.

5. Для хранения изображений на Vercel необходимо использовать Vercel Blob Storage или внешнее облачное хранилище.

### Деплой на Netlify

1. Установите Netlify CLI:
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. Авторизуйтесь в Netlify:
   \`\`\`bash
   netlify login
   \`\`\`

3. Деплой проекта:
   \`\`\`bash
   netlify deploy --prod
   \`\`\`

4. Настройте переменные окружения в панели управления Netlify.

5. Для корректной работы серверных функций необходимо настроить Netlify Functions.

## Настройка на собственном сервере

### Требования к серверу

- Node.js 18.x или выше
- Nginx или Apache для проксирования запросов
- PM2 для управления процессами (опционально)
- Минимум 1 ГБ ОЗУ и 10 ГБ дискового пространства

### Настройка Nginx

Пример конфигурации Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Настройка для загруженных изображений
    location /uploads/ {
        alias /path/to/your/app/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Настройка для статичных файлов
    location /_next/static {
        alias /path/to/your/app/.next/static;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
