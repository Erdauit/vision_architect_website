"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // В реальном проекте здесь был бы код для отправки данных на сервер
    console.log("Form submitted:", formData)

    toast({
      title: "Сообщение отправлено",
      description: "Мы свяжемся с вами в ближайшее время.",
    })

    // Сброс формы
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-medium mb-8 tracking-wider">КОНТАКТЫ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider">СВЯЗАТЬСЯ С НАМИ</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm">
                Имя
              </label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm">
                Телефон
              </label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm">
                Сообщение
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800 w-full">
              Отправить
            </Button>
          </form>
        </div>

        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider">НАШИ КОНТАКТЫ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Адрес</h3>
              <address className="not-italic text-gray-500">
                <p>ул. Назарбаева, 223</p>
                <p>Алматы, Казахстан</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Телефон</h3>
              <p className="text-gray-500">+7 (707) 797-3111</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <p className="text-gray-500">visionarch.kz@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Часы работы</h3>
              <p className="text-gray-500">Понедельник - Пятница: 10:00 - 19:00</p>
              <p className="text-gray-500">Суббота - Воскресенье: 12:00 - 17:00</p>

            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-12">
        <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider">КАРТА</h2>
        <div className="h-[400px] bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Здесь будет карта с расположением офиса</p>
        </div>
      </div> */}
    </div>
  )
}
