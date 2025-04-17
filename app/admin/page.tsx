"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { addProperty, getProperties, deleteProperty, updatePropertyPreview } from "../actions/property-actions"
import { logout } from "../actions/auth-actions"
import Image from "next/image"
import { Trash2, Upload, Star, StarOff } from "lucide-react"

interface Property {
  id: number
  title: string
  area: number
  type: "apartments" | "commercial"
  image: string
  images: string[]
}

export default function AdminPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: "",
    area: "",
    type: "apartments" as "apartments" | "commercial",
  })

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties()
        setProperties(data)
      } catch (error) {
        console.error("Error loading properties:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as "apartments" | "commercial",
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(filesArray)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Создаем FormData из формы
      const formDataToSend = new FormData(e.currentTarget)

      // Добавляем каждый файл отдельно, чтобы избежать большой нагрузки
      formDataToSend.delete("images") // Удаляем существующие файлы
      selectedFiles.forEach((file, index) => {
        // Добавляем префикс с временной меткой и индексом для уникальности
        const timestamp = new Date().getTime()
        const uniqueFileName = `${timestamp}_${index}_${file.name}`
        const uniqueFile = new File([file], uniqueFileName, { type: file.type })
        formDataToSend.append("images", uniqueFile)
      })

      // Отправляем данные через серверное действие
      const result = await addProperty(formDataToSend)

      if (result.success) {
        toast({
          title: "Успех!",
          description: result.message,
        })

        // Обновляем список объектов
        const updatedProperties = await getProperties()
        setProperties(updatedProperties)

        // Сбрасываем форму
        setFormData({
          title: "",
          area: "",
          type: "apartments",
        })
        setSelectedFiles([])

        // Сбрасываем файловый input через ссылку на форму
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        toast({
          title: "Ошибка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Ошибка",
        description: "An unexpected error occurred while adding the property",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот объект?")) {
      try {
        const result = await deleteProperty(id)

        if (result.success) {
          toast({
            title: "Успех!",
            description: result.message,
          })

          // Обновляем список объектов
          const updatedProperties = await getProperties()
          setProperties(updatedProperties)
        } else {
          toast({
            title: "Ошибка",
            description: result.message,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting property:", error)
        toast({
          title: "Ошибка",
          description: "An unexpected error occurred while deleting the property",
          variant: "destructive",
        })
      }
    }
  }

  const handleSetPreview = async (propertyId: number, imageUrl: string) => {
    try {
      const result = await updatePropertyPreview(propertyId, imageUrl)

      if (result.success) {
        toast({
          title: "Успех!",
          description: "Превью-изображение успешно обновлено",
        })

        // Обновляем список объектов
        const updatedProperties = await getProperties()
        setProperties(updatedProperties)
      } else {
        toast({
          title: "Ошибка",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating preview image:", error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении превью-изображения",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-medium tracking-wider">АДМИН-ПАНЕЛЬ</h1>
        <Button variant="outline" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider">ДОБАВИТЬ НОВЫЙ ОБЪЕКТ</h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div>
              <label htmlFor="title" className="block mb-2 text-sm">
                Название
              </label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="area" className="block mb-2 text-sm">
                Площадь (м²)
              </label>
              <Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} required />
            </div>

            <div>
              <label htmlFor="type" className="block mb-2 text-sm">
                Тип
              </label>
              <Select value={formData.type} onValueChange={handleSelectChange} name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartments">Апартаменты</SelectItem>
                  <SelectItem value="commercial">Коммерческая недвижимость</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="images" className="block mb-2 text-sm">
                Изображения
              </label>
              <Input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                className="cursor-pointer"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedFiles.length > 0
                  ? `Выбрано ${selectedFiles.length} файлов`
                  : "Вы можете загрузить несколько изображений. Первое изображение будет использоваться как главное."}
              </p>
            </div>

            <Button type="submit" className="bg-black text-white hover:bg-gray-800 w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Добавление...
                </span>
              ) : (
                "Добавить объект"
              )}
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider">СУЩЕСТВУЮЩИЕ ОБЪЕКТЫ</h2>

          {loading ? (
            <div className="text-center py-12">Загрузка объектов...</div>
          ) : properties.length > 0 ? (
            <div className="space-y-6">
              {properties.map((property) => (
                <div key={property.id} className="border border-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-16 w-16">
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-gray-500">
                          {property.area} м² •{" "}
                          {property.type === "apartments" ? "Апартаменты" : "Коммерческая недвижимость"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(property.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>

                  {/* Галерея изображений с возможностью выбора превью */}
                  {property.images && property.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Изображения объекта:</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {property.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="relative h-20 w-full">
                              <Image
                                src={imageUrl || "/placeholder.svg"}
                                alt={`${property.title} - изображение ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <button
                              onClick={() => handleSetPreview(property.id, imageUrl)}
                              className={`absolute top-1 right-1 p-1 rounded-full ${
                                property.image === imageUrl
                                  ? "bg-yellow-400 text-black"
                                  : "bg-black/50 text-white opacity-0 group-hover:opacity-100"
                              } transition-opacity`}
                              title={
                                property.image === imageUrl
                                  ? "Текущее превью-изображение"
                                  : "Установить как превью-изображение"
                              }
                            >
                              {property.image === imageUrl ? (
                                <Star className="h-4 w-4" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Объекты недвижимости не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
