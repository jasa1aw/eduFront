'use client'

import { Leaderboard } from '@/components/game/Leaderboard'
import { Button } from '@/components/ui/button'
import { USER_ROLES } from '@/constants/auth'
import { useGetLeaderboard } from '@/hooks/game/useGetLeaderboard'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionResultsPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()
	const { competition, reset } = useCompetitionStore()
	const { user } = useAuthStore()
	const competitionId = params.id as string
	const participantId = searchParams.get('participantId')

	const { data: leaderboard, isLoading } = useGetLeaderboard(competitionId)

	// Функция для получения пути назад в зависимости от роли пользователя
	const getBackPath = () => {
		// Если пользователь не авторизован (гость) - на главную страницу
		if (!user) return '/'

		switch (user.role) {
			case USER_ROLES.TEACHER:
				return '/teacher/stats'
			case USER_ROLES.STUDENT:
				return '/student/stats'
			case USER_ROLES.ADMIN:
				return '/admin/dashboard'
			default:
				return '/' // Неизвестная роль или гость - на главную
		}
	}

	const handleGoBack = () => {
		router.push(getBackPath())
	}

	useEffect(() => {
		if (!participantId) {
			router.push('/competitions/join')
		}
	}, [participantId, router])

	useEffect(() => {
		return () => {
			reset()
		}
	}, [reset])

	if (!participantId || isLoading || !leaderboard) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
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

				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">{competition?.title}</h1>
					<p className="text-gray-600">Competition Results</p>
				</div>

				<Leaderboard leaderboard={leaderboard} />
			</div>
		</div>
	)
}