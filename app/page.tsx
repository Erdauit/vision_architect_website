import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-medium mb-6 tracking-wider">
                СОВРЕМЕННЫЕ РЕШЕНИЯ ДЛЯ ВАШЕЙ НЕДВИЖИМОСТИ
              </h1>
              <p className="text-gray-500 mb-8 max-w-md">
                Мы предлагаем эксклюзивные объекты недвижимости с минималистичным дизайном и высоким качеством
                строительства.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-black text-white hover:bg-gray-800">
                  <Link href="/offers">Смотреть предложения</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Связаться с нами</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Современная недвижимость"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-medium mb-12 text-center tracking-wider">ИЗБРАННЫЕ ОБЪЕКТЫ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Link href={`/offers`} key={item} className="property-card block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-64">
                    <Image
                      src={`/placeholder.svg?height=300&width=400`}
                      alt={`Объект недвижимости ${item}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={90}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">Апартаменты {item}</h3>
                    <div className="flex justify-end">
                      <span className="text-sm text-gray-500">120 м²</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/offers">Все предложения</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-medium mb-6 tracking-wider">О КОМПАНИИ VISION ARCHITECTS</h2>
              <p className="text-gray-500 mb-6">
                Мы специализируемся на создании и продаже эксклюзивных объектов недвижимости, которые сочетают в себе
                минималистичный дизайн, функциональность и высокое качество.
              </p>
              <p className="text-gray-500 mb-8">
                Наша команда профессионалов имеет многолетний опыт работы в сфере недвижимости и стремится предоставить
                клиентам лучшие решения для их потребностей.
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Подробнее о нас</Link>
              </Button>
            </div>
            <div className="relative h-[400px] order-1 md:order-2">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="О компании VISION ARCHITECTS"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-medium mb-6 tracking-wider">ГОТОВЫ НАЙТИ ИДЕАЛЬНУЮ НЕДВИЖИМОСТЬ?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Свяжитесь с нами сегодня, и наши эксперты помогут вам найти идеальный объект недвижимости, соответствующий
            вашим требованиям и предпочтениям.
          </p>
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/contact">Связаться с нами</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
