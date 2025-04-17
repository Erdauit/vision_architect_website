import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">VISION ARCHITECTS</h3>
            <p className="text-gray-500 text-sm">
              Профессиональные решения в сфере недвижимости с минималистичным подходом к дизайну и функциональности.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gray-600 transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-600 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-gray-600 transition-colors">
                  Предложения
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-600 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Контакты</h3>
            <address className="not-italic text-sm text-gray-500">
              <p>ул. Назарбаева, 223</p>
              <p>Алматы, Казахстан</p>
              <p className="mt-2">Телефон: +7 (707) 797-3111</p>
              <p>Email: visionarch.kz@gmail.com</p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} VISION ARCHITECTS. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
