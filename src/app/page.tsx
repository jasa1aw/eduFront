'use client'

import { Button } from '@/components/ui/button'
import { getDefaultRouteForRole, ROUTES, type UserRole } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore()
  const [isClient, setIsClient] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(false)

  const redirectUser = useCallback(() => {
    if (!isAuthenticated) {
      return // Остаемся на главной странице для гостей
    }

    if (user?.role) {
      router.push(getDefaultRouteForRole(user.role as UserRole))
    } else {
      router.push(ROUTES.SIGN_IN)
    }
  }, [isAuthenticated, user?.role, router])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    // Если пользователь аутентифицирован, но данные пользователя не загружены, загружаем их
    if (isAuthenticated && !user && !isLoading) {
      fetchUser()
      return
    }

    // Если данные пользователя загружены, перенаправляем на соответствующую страницу
    if (user) {
      redirectUser()
    }
  }, [isClient, isAuthenticated, user, isLoading, fetchUser, redirectUser])

  // Если компонент еще не смонтирован на клиенте, показываем главную страницу
  // Это предотвращает ошибку гидратации
  if (isClient) {
    return (
      <div className="min-h-screen bg-[#465FF1] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="text-center space-y-6">
            <div className="text-white space-y-4">
              <h1 className="text-4xl font-bold">Добро пожаловать!</h1>
              <p className="text-lg opacity-90">
                Присоединяйтесь к соревнованию или войдите в систему
              </p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-white text-[#465FF1] hover:bg-gray-100"
                size="lg"
                onClick={() => router.push('/competitions/join')}
              >
                Присоединиться как гость
              </Button>

              <Button
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-[#465FF1]"
                size="lg"
                disabled
              >
                Войти в систему
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Если пользователь авторизован, показываем загрузку пока определяем куда перенаправить
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#465FF1]">
        <div className="text-white text-xl">
          {isLoading ? 'Загрузка профиля...' : 'Перенаправление...'}
        </div>
      </div>
    )
  }

  // Для неавторизованных пользователей показываем возможность подключения как гость
  
}