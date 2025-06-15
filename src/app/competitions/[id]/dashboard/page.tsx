'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CreatorDashboard } from '@/components/game/CreatorDashboard'
import { Button } from '@/components/ui/button'
import { USER_ROLES } from '@/constants/auth'
import { useGetCreatorDashboard } from '@/hooks/game/useGetCreatorDashboard'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { ArrowLeft } from 'lucide-react'

export default function CompetitionDashboardPage() {
	const router = useRouter()
	const params = useParams()
	const {reset } = useCompetitionStore()
	const { user } = useAuthStore()
	const competitionId = params.id as string

	const { data: dashboard, isLoading } = useGetCreatorDashboard(competitionId)

	// Функция для получения пути назад в зависимости от роли пользователя
	const getBackPath = () => {
		// Если пользователь не авторизован (гость) - на главную страницу
		if (!user) return '/'

		switch (user.role) {
			case USER_ROLES.TEACHER:
				return '/teacher/stats'
			case USER_ROLES.STUDENT:
				return '/student/stats'
			default:
				return '/' // Неизвестная роль или гость - на главную
		}
	}

	const handleGoBack = () => {
		router.push(getBackPath())
	}

	useEffect(() => {
		if (!user) {
			router.push('/sign-in')
		}
	}, [user, router])

	useEffect(() => {
		return () => {
			reset()
		}
	}, [reset])

	if (!user || isLoading || !dashboard) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Кнопка назад */}
				<div className="mb-6">
					<Button
						variant="outline"
						onClick={handleGoBack}
						className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Назад
					</Button>
				</div>

				<CreatorDashboard dashboard={dashboard} />
			</div>
		</div>
	)
}