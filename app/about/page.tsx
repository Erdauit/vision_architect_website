import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-medium mb-8 tracking-wider">О НАС</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-xl md:text-2xl font-medium mb-4 tracking-wider">НАША МИССИЯ</h2>
          <p className="text-gray-500 mb-4">
            VISION ARCHITECTS — это компания, специализирующаяся на создании и продаже эксклюзивных объектов
            недвижимости, которые сочетают в себе минималистичный дизайн, функциональность и высокое качество.
          </p>
          <p className="text-gray-500">
            Наша миссия — предоставлять клиентам уникальные пространства, которые отражают их индивидуальность и
            соответствуют современным стандартам комфорта и эстетики.
          </p>
        </div>
        <div className="relative h-[400px]">
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="Миссия VISION ARCHITECTS"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1 relative h-[400px]">
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="История VISION ARCHITECTS"
            fill
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-xl md:text-2xl font-medium mb-4 tracking-wider">НАША ИСТОРИЯ</h2>
          <p className="text-gray-500 mb-4">
            Компания VISION ARCHITECTS была основана в 2010 году группой архитекторов и дизайнеров, объединенных общей
            идеей создания минималистичных и функциональных пространств.
          </p>
          <p className="text-gray-500">
            За годы работы мы реализовали множество успешных проектов, от жилых комплексов до коммерческих помещений, и
            заслужили репутацию надежного партнера в сфере недвижимости.
          </p>
        </div>
      </div>

      {/* <div className="mb-16">
        <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider text-center">НАША КОМАНДА</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[
            { name: "Паленше Паленшеев", position: "Генеральный директор" },
            { name: "Альтаир Еримбетов", position: "Главный архитектор" },
            { name: "Аружан Аружан", position: "Руководитель отдела продаж" },
            { name: "John Doe", position: "Дизайнер интерьеров" },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative h-64 w-full mb-4">
                <Image src={`/placeholder.svg?height=300&width=300`} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-medium">{member.name}</h3>
              <p className="text-gray-500">{member.position}</p>
            </div>
          ))}
        </div>
      </div> */}

      <div>
        <h2 className="text-xl md:text-2xl font-medium mb-6 tracking-wider text-center">НАШИ ЦЕННОСТИ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "КАЧЕСТВО",
              description: "Мы используем только высококачественные материалы и современные технологии строительства.",
            },
            {
              title: "ИННОВАЦИИ",
              description: "Мы постоянно ищем новые решения и подходы к проектированию и строительству.",
            },
            {
              title: "КЛИЕНТООРИЕНТИРОВАННОСТЬ",
              description: "Мы внимательно слушаем наших клиентов и учитываем их пожелания и потребности.",
            },
          ].map((value, index) => (
            <div key={index} className="bg-gray-50 p-6">
              <h3 className="text-lg font-medium mb-3">{value.title}</h3>
              <p className="text-gray-500">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
