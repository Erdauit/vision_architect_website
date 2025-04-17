"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Проверяем только на клиенте
    if (typeof window === "undefined") return

    // Функция для проверки размера экрана
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Проверяем при монтировании
    checkMobile()

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", checkMobile)

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener("resize", checkMobile)
  }, [breakpoint])

  return isMobile
}
