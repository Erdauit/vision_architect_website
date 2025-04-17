"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProperties } from "../actions/property-actions"
import { PropertyDetailDialog } from "@/components/property-detail-dialog"

type PropertyType = "all" | "apartments" | "commercial"

interface Property {
  id: number
  title: string
  area: number
  type: "apartments" | "commercial"
  image: string
  images: string[]
}

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<PropertyType>("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties()
        setProperties(data)
      } catch (error) {
        console.error("Ошибка при загрузке объектов недвижимости:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  const filteredProperties =
    activeTab === "all" ? properties : properties.filter((property) => property.type === activeTab)

  const openPropertyDetails = (property: Property) => {
    setSelectedProperty(property)
    setDialogOpen(true)
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-medium mb-8 tracking-wider">ПРЕДЛОЖЕНИЯ</h1>

        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveTab(value as PropertyType)}>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="apartments">Апартаменты</TabsTrigger>
            <TabsTrigger value="commercial">Коммерческие</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {loading ? (
              <div className="text-center py-12">Загрузка предложений...</div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} onClick={() => openPropertyDetails(property)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">Объекты недвижимости не найдены</p>
                <Button asChild variant="outline">
                  <Link href="/admin">Добавить объект</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="apartments" className="mt-8">
            {loading ? (
              <div className="text-center py-12">Загрузка предложений...</div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} onClick={() => openPropertyDetails(property)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">Апартаменты не найдены</p>
                <Button asChild variant="outline">
                  <Link href="/admin">Добавить объект</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="commercial" className="mt-8">
            {loading ? (
              <div className="text-center py-12">Загрузка предложений...</div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} onClick={() => openPropertyDetails(property)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">Коммерческие объекты не найдены</p>
                <Button asChild variant="outline">
                  <Link href="/admin">Добавить объект</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedProperty && (
          <PropertyDetailDialog open={dialogOpen} onOpenChange={setDialogOpen} property={selectedProperty} />
        )}
      </div>
    </div>
  )
}

function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  return (
    <div className="property-card block cursor-pointer bg-white rounded-lg shadow-md overflow-hidden" onClick={onClick}>
      <div className="relative h-72">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium mb-2">{property.title}</h3>
        <div className="flex justify-end">
          <span className="text-sm text-gray-500">{property.area} м²</span>
        </div>
      </div>
    </div>
  )
}
