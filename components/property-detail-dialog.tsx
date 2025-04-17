"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMobile } from "@/hooks/use-mobile"

interface PropertyDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: {
    id: number
    title: string
    area: number
    type: "apartments" | "commercial"
    images: string[]
  }
}

export function PropertyDetailDialog({ open, onOpenChange, property }: PropertyDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [thumbnailPage, setThumbnailPage] = useState(0)
  const isMobile = useMobile()

  // Количество миниатюр на странице в зависимости от размера экрана
  const THUMBNAILS_PER_PAGE = isMobile ? 3 : 5

  const totalThumbnails = property.images.length
  const totalPages = Math.ceil(totalThumbnails / THUMBNAILS_PER_PAGE)

  // Сбрасываем индекс при открытии нового объекта
  useEffect(() => {
    if (open) {
      setCurrentImageIndex(0)
      setThumbnailPage(0)
    }
  }, [open, property.id])

  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % totalThumbnails
    setCurrentImageIndex(newIndex)
    setThumbnailPage(Math.floor(newIndex / THUMBNAILS_PER_PAGE))
  }

  const prevImage = () => {
    const newIndex = (currentImageIndex - 1 + totalThumbnails) % totalThumbnails
    setCurrentImageIndex(newIndex)
    setThumbnailPage(Math.floor(newIndex / THUMBNAILS_PER_PAGE))
  }

  const visibleThumbnails = property.images.slice(
    thumbnailPage * THUMBNAILS_PER_PAGE,
    (thumbnailPage + 1) * THUMBNAILS_PER_PAGE,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 bg-white text-black w-[95vw] mx-auto"
        style={{ overflowX: "hidden" }} // Предотвращаем горизонтальную прокрутку
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="p-4 md:p-6">
          {/* Main Image */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[500px] mb-4">
            {property.images.length > 0 ? (
              <>
                <div className="relative h-full w-full bg-gray-100">
                  <Image
                    src={property.images[currentImageIndex] || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-contain"
                    quality={90}
                    priority
                  />
                </div>

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/10 backdrop-blur-sm p-2 rounded-full shadow-md z-10 hover:bg-black/20 transition-colors"
                      aria-label="Предыдущее изображение"
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-black" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/10 backdrop-blur-sm p-2 rounded-full shadow-md z-10 hover:bg-black/20 transition-colors"
                      aria-label="Следующее изображение"
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-black" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">Изображения отсутствуют</p>
              </div>
            )}
          </div>

          {/* Thumbnail Carousel with Pagination - адаптивная версия */}
          {property.images.length > 1 && (
            <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-4 md:mb-6">
              <button
                disabled={thumbnailPage === 0}
                onClick={() => setThumbnailPage((prev) => Math.max(0, prev - 1))}
                className="p-1 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              <div className="flex space-x-1 md:space-x-2 overflow-hidden">
                {visibleThumbnails.map((image, index) => {
                  const realIndex = thumbnailPage * THUMBNAILS_PER_PAGE + index
                  return (
                    <button
                      key={realIndex}
                      onClick={() => setCurrentImageIndex(realIndex)}
                      className={`relative h-14 w-14 sm:h-16 sm:w-20 md:h-20 md:w-28 flex-shrink-0 border-2 transition-all ${
                        currentImageIndex === realIndex
                          ? "border-black"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="relative h-full w-full bg-gray-200">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Миниатюра ${realIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 56px, (max-width: 768px) 80px, 112px"
                        />
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                disabled={thumbnailPage === totalPages - 1}
                onClick={() => setThumbnailPage((prev) => Math.min(totalPages - 1, prev + 1))}
                className="p-1 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4">
            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
              <h3 className="text-xs md:text-sm text-gray-500 mb-1">Площадь</h3>
              <p className="text-lg md:text-xl">{property.area} м²</p>
            </div>
            <div className="bg-gray-100 p-3 md:p-4 rounded-lg">
              <h3 className="text-xs md:text-sm text-gray-500 mb-1">Тип</h3>
              <p className="text-lg md:text-xl">
                {property.type === "apartments" ? "Апартаменты" : "Коммерческая недвижимость"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
