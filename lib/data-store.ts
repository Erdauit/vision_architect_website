import { v4 as uuidv4 } from "uuid"

// Типы данных
export interface Property {
  id: number
  title: string
  location: string // Больше не используется, но оставляем для совместимости
  price: number // Больше не используется, но оставляем для совместимости
  area: number
  type: "apartments" | "commercial"
  description: string
  createdAt: string
  updatedAt: string
}

export interface Image {
  id: string
  url: string
  alt?: string
  propertyId: number
}

interface DataStore {
  properties: Property[]
  images: Image[]
  lastPropertyId: number
}

// Начальные данные
const initialData: DataStore = {
  properties: [
    {
      id: 1,
      title: "Современные апартаменты",
      location: "",
      price: 0,
      area: 120,
      type: "apartments",
      description:
        "Просторные современные апартаменты в престижном районе. Панорамные окна, высокие потолки, качественная отделка.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Пентхаус с террасой",
      location: "",
      price: 0,
      area: 180,
      type: "apartments",
      description:
        "Роскошный пентхаус с просторной террасой и панорамным видом. Эксклюзивная отделка, умный дом, приватный лифт.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Студия в центре",
      location: "",
      price: 0,
      area: 45,
      type: "apartments",
      description:
        "Компактная студия в самом центре города. Функциональная планировка, современный ремонт, вся инфраструктура в шаговой доступности.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Офисное помещение",
      location: "",
      price: 0,
      area: 200,
      type: "commercial",
      description:
        "Современное офисное помещение в бизнес-центре класса А. Открытая планировка, качественная отделка, панорамные окна.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Торговое помещение",
      location: "",
      price: 0,
      area: 150,
      type: "commercial",
      description:
        "Торговое помещение на первой линии с отдельным входом и большими витринами. Высокий пешеходный трафик.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      title: "Двухуровневые апартаменты",
      location: "",
      price: 0,
      area: 160,
      type: "apartments",
      description:
        "Стильные двухуровневые апартаменты с дизайнерским ремонтом. Второй свет в гостиной, панорамные окна, терраса.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  images: [
    {
      id: "1",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Современные апартаменты - изображение 1",
      propertyId: 1,
    },
    {
      id: "2",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Современные апартаменты - изображение 2",
      propertyId: 1,
    },
    {
      id: "3",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Пентхаус с террасой - изображение 1",
      propertyId: 2,
    },
    {
      id: "4",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Пентхаус с террасой - изображение 2",
      propertyId: 2,
    },
    {
      id: "5",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Студия в центре - изображение 1",
      propertyId: 3,
    },
    {
      id: "6",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Офисное помещение - изображение 1",
      propertyId: 4,
    },
    {
      id: "7",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Торговое помещение - изображение 1",
      propertyId: 5,
    },
    {
      id: "8",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Двухуровневые апартаменты - изображение 1",
      propertyId: 6,
    },
    {
      id: "9",
      url: "/placeholder.svg?height=400&width=600",
      alt: "Двухуровневые апартаменты - изображение 2",
      propertyId: 6,
    },
  ],
  lastPropertyId: 6,
}

// Глобальное хранилище данных в памяти
let dataStore: DataStore = { ...initialData }

// Функция для получения данных из хранилища
export function getDataStore(): DataStore {
  return dataStore
}

// Функция для сохранения данных в хранилище
export function saveDataStore(data: DataStore) {
  dataStore = { ...data }
}

// Функция для добавления нового объекта недвижимости
export function addPropertyToStore(property: Omit<Property, "id" | "createdAt" | "updatedAt">) {
  const store = getDataStore()
  const newId = store.lastPropertyId + 1

  const newProperty: Property = {
    ...property,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  store.properties.push(newProperty)
  store.lastPropertyId = newId

  saveDataStore(store)
  return newProperty
}

// Функция для добавления изображения
export function addImageToStore(image: Omit<Image, "id">) {
  const store = getDataStore()

  const newImage: Image = {
    ...image,
    id: uuidv4(),
  }

  store.images.push(newImage)
  saveDataStore(store)

  return newImage
}

// Функция для получения всех объектов недвижимости
export function getAllProperties() {
  const store = getDataStore()
  return store.properties
}

// Функция для получения объекта недвижимости по ID
export function getPropertyById(id: number) {
  const store = getDataStore()
  return store.properties.find((p) => p.id === id) || null
}

// Функция для получения изображений объекта недвижимости
export function getPropertyImages(propertyId: number) {
  const store = getDataStore()
  return store.images.filter((img) => img.propertyId === propertyId)
}
