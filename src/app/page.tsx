'use client'

import { getDefaultRouteForRole, ROUTES, type UserRole } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore()
  const [isClient, setIsClient] = useState(false)

  const redirectUser = useCallback(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.SIGN_IN)
      return
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

    // Если пользователь не аутентифицирован, перенаправляем на страницу входа
    if (!isAuthenticated) {
      redirectUser()
      return
    }

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

  // Показываем загрузку пока определяем куда перенаправить пользователя
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#465FF1]">
      <div className="text-white text-xl">
        {isLoading ? 'Загрузка профиля...' : 'Перенаправление...'}
      </div>
    </div>
  )
}
