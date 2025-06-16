'use client'

import { Leaderboard } from '@/components/game/Leaderboard'
import { Button } from '@/components/ui/button'
import { USER_ROLES } from '@/constants/auth'
import { useGetLeaderboard } from '@/hooks/game/useGetLeaderboard'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { ArrowLeft, Trophy } from 'lucide-react'
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
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent"></div>
					<p className="text-lg font-medium text-gray-700">Нәтижелер жүктелуде...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] py-8">
			<div className="max-w-4xl mx-auto px-4">
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

				{/* Header */}
				<div className="text-center mb-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] rounded-full mb-6">
						<Trophy className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-3xl font-bold mb-2 text-gray-800">{competition?.title || 'Жарыс'}</h1>
					<p className="text-gray-600 text-lg">Жарыс нәтижелері</p>
					<div className="mt-4 w-24 h-1 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] mx-auto rounded-full"></div>
				</div>

				<Leaderboard leaderboard={leaderboard} />
			</div>
		</div>
	)
}