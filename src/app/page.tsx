'use client'

import { Button } from '@/components/ui/button'
import { Award, Brain, ChartBar, ChevronRight, FileCheck, Shield, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from "next/image"

export default function Home() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {isScrolled ?
                <h1 className="text-2xl font-bold text-[#7C3AED]">
                  TestiQ
                </h1>
                :
                <Image
                  src="/assets/icons/logo.svg"
                  alt="Auth illustration"
                  width={150}
                  height={150}
                  className="transition-all hover:scale-105"
                />
              }
              
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => scrollToSection('about')}
                  className={`text-gray-600 ${isScrolled ? 'hover:text-[#465FF1]' : 'hover:text-white'} transition-colors`}
                >
                  О проекте
                </button>
                <button
                  onClick={() => scrollToSection('advantages')}
                  className={`text-gray-600 ${isScrolled ? 'hover:text-[#465FF1]' : 'hover:text-white'} transition-colors`}
                >
                  Преимущества
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.replace('/sign-in')}
                className="hover:text-[#7C3AED]"
              >
                Войти
              </Button>
              <Button
                className="bg-[#7C3AED] hover:bg-[#6D28D9]"
                onClick={() => router.replace('/sign-up')}
              >
                Регистрация
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              ПРИСОЕДИНЯЙТЕСЬ К СОРЕВНОВАНИЮ КАК ГОСТЬ
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Протестируйте свои знания в режиме реального времени
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex bg-white rounded-lg p-2">
                <Button
                  onClick={() => router.push('/competitions/join')}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                >
                  Присоединиться
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <ChevronRight className="w-8 h-8 text-white animate-bounce rotate-90" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">TestiQ - Платформа нового поколения</h2>
            <p className="text-xl text-gray-600">
              TestiQ - это передовая платформа для революционизации онлайн-тестирования и соревнований.
              С фокусом на пользовательский опыт и расширенные функции, TestiQ предлагает безупречную
              и увлекательную среду как для создателей тестов, так и для участников.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] rounded-xl flex items-center justify-center mb-6">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Создавайте тесты</h3>
              <p className="text-gray-600">
                Легко разрабатывайте и настраивайте тесты с различными типами вопросов и настройками.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Проводите соревнования</h3>
              <p className="text-gray-600">
                Организуйте и управляйте онлайн-соревнованиями с отслеживанием в реальном времени и лидербордами.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD] rounded-xl flex items-center justify-center mb-6">
                <ChartBar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Анализируйте результаты</h3>
              <p className="text-gray-600">
                Получайте ценные аналитические данные с детальной аналитикой и отчетами о производительности.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Преимущества перед конкурентами</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-[#7C3AED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Режим экзамена</h3>
              <p className="text-gray-600">
                Симулируйте реальные экзаменационные условия со строгими временными лимитами и порядком вопросов.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChartBar className="w-10 h-10 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Умная аналитика</h3>
              <p className="text-gray-600">
                Получайте глубокие инсайты о производительности участников с расширенной аналитикой.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#A78BFA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Командные турниры</h3>
              <p className="text-gray-600">
                Организуйте командные соревнования для совместного обучения и вовлечения.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#7C3AED]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-10 h-10 text-[#7C3AED]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Экспорт в PDF</h3>
              <p className="text-gray-600">
                Экспортируйте результаты тестов и отчеты в PDF для легкого обмена и архивирования.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Адаптивный дизайн</h3>
              <p className="text-gray-600">
                Доступ и участие в тестах беспрепятственно на любом устройстве, от ПК до смартфонов.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#A78BFA]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-[#A78BFA]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Бесплатный доступ</h3>
              <p className="text-gray-600">
                Наслаждайтесь полным доступом ко всем функциям без подписки или скрытых платежей.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center items-center">
            <Image
              src="/assets/icons/logo.svg"
              alt="Auth illustration"
              width={150}
              height={150}
              className="transition-all hover:scale-105"
            />
            <p className="text-white/80 mb-4">
              Революционная платформа для онлайн-тестирования и соревнований
            </p>
            <p className="text-white/60">
              &copy; 2024 TestiQ. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}