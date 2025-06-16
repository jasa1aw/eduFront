'use client'

import { CreatorDashboard } from '@/components/game/CreatorDashboard'
import { Button } from '@/components/ui/button'
import { USER_ROLES } from '@/constants/auth'
import { useGetCreatorDashboard } from '@/hooks/game/useGetCreatorDashboard'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionDashboardPage() {
	const router = useRouter()
	const params = useParams()
	const { reset } = useCompetitionStore()
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
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent"></div>
					<p className="text-lg font-medium text-gray-700">Жүктелуде...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Кнопка назад */}
				<div className="mb-6">
					<Button
						variant="outline"
						onClick={handleGoBack}
						className="flex items-center gap-2 border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white transition-all duration-300"
					>
						<ArrowLeft className="w-4 h-4" />
						Артқа
					</Button>
				</div>

				<CreatorDashboard dashboard={dashboard} />
			</div>
		</div>
	)
}