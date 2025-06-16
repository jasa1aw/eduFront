'use client'

import { AnswerForm } from '@/components/game/AnswerForm'
import { GameChat } from '@/components/game/GameChat'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { useGetTeamChat } from '@/hooks/game/useGetTeamChat'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useCompetitionStore } from '@/store/competitionStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionGamePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const participantId = searchParams.get('participantId')
	const { competition, currentQuestion, teamChat, setTeamChat } = useCompetitionStore()

	const {
		joinCompetition,
		getCurrentQuestion,
		submitAnswer,
		getTeamChatFull
	} = useGameSocket()

	// Получаем ID соревнования из URL
	const competitionId = window.location.pathname.split('/')[2]

	// Определяем пользователя и его команду
	const userParticipant = competition?.participants.find(p => p.id === participantId)
	const userTeam = userParticipant?.teamName
		? competition?.teams.find(t => t.name === userParticipant.teamName)
		: null

	// Проверяем, является ли текущий пользователь выбранным игроком команды
	const isSelectedPlayer = userTeam?.selectedPlayer?.id === participantId

	// HTTP запрос для получения истории чата с автообновлением каждую секунду
	const { data: teamChatData, refetch: refetchTeamChat } = useGetTeamChat(
		competition?.id || '',
		userTeam?.id || '',
		participantId || ''
	)

	// Обновляем состояние чата из HTTP запроса
	useEffect(() => {
		if (teamChatData?.messages) {
			setTeamChat(teamChatData.messages)
		}
	}, [teamChatData, setTeamChat])

	// Подключение к соревнованию и получение начальных данных
	useEffect(() => {
		if (competitionId && participantId) {
			// Подключаемся к соревнованию
			joinCompetition(competitionId, participantId)

			// Получаем текущий вопрос
			getCurrentQuestion(participantId)

		}
	}, [competitionId, participantId, joinCompetition, getCurrentQuestion])

	// Получение истории чата команды через WebSocket
	useEffect(() => {
		if (competition && participantId && userTeam) {
			getTeamChatFull(competition.id, userTeam.id, participantId)
		}
	}, [competition, participantId, userTeam?.id, getTeamChatFull])

	// Дополнительное обновление чата через HTTP каждую секунду
	useEffect(() => {
		if (!competition || !participantId || !userTeam) return

		const interval = setInterval(() => {
			refetchTeamChat()
		}, 1000)

		return () => clearInterval(interval)
	}, [competition, participantId, userTeam?.id, refetchTeamChat, getTeamChatFull])

	// Перенаправление на результаты если соревнование завершено
	useEffect(() => {
		if (competition?.status === 'COMPLETED') {
			router.push(`/competitions/${competitionId}/result?participantId=${participantId}`)
		}
	}, [competition?.status, competitionId, participantId, router])

	const handleSubmitAnswer = async (answer: { selectedAnswers?: string[], userAnswer?: string }) => {
		if (!currentQuestion || !participantId) return

		try {
			// Используем WebSocket для отправки ответа с callback для обработки ответа
			await submitAnswer(participantId, currentQuestion.id, answer, (response) => {
				if (response.isTestCompleted) {
					// Перенаправляем на страницу результатов
					router.push(`/competitions/${competitionId}/result?participantId=${participantId}`)
				}
				else {
					// После отправки ответа запрашиваем следующий вопрос
					setTimeout(() => {
						getCurrentQuestion(participantId)
					}, 1000)
				}
			})


			setTimeout(() => {
				getCurrentQuestion(participantId)
			}, 1000)

		} catch (error) {
			console.error('Failed to submit answer:', error)
		}
	}

	if (!competition || !participantId) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent mx-auto mb-4"></div>
					<p className="text-lg font-medium text-gray-700">Ойын жүктелуде...</p>
				</div>
			</div>
		)
	}

	// Если соревнование завершено, показываем результаты
	if (competition.status === 'COMPLETED') {
		router.push(`/competitions/${competitionId}/result?participantId=${participantId}`)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Competition Header */}
				<div className="text-center mb-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
					<h1 className="text-2xl font-bold text-gray-800">{competition.title}</h1>
					<p className="text-gray-600 mt-1">{competition.testTitle}</p>
					{userTeam && (
						<div className="mt-4 flex justify-center gap-2">
							<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
								Команда: {userTeam.name}
							</span>
							<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${isSelectedPlayer
								? 'bg-green-100 text-green-800 border-green-200'
								: 'bg-gray-100 text-gray-800 border-gray-200'
								}`}>
								{isSelectedPlayer ? '🎮 Ойыншы' : '👁️ Бақылаушы'}
							</span>
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{currentQuestion ? (
							<>
								<QuestionDisplay question={currentQuestion} />

								{isSelectedPlayer ? (
									<AnswerForm
										question={currentQuestion}
										onSubmit={handleSubmitAnswer}
										isSubmitting={false}
									/>
								) : (
									<div className="text-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
										<div className="mb-4">
											<div className="w-16 h-16 mx-auto mb-4 bg-[#7C3AED]/10 rounded-full flex items-center justify-center">
												<svg className="w-8 h-8 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											</div>
										</div>
										{userTeam?.selectedPlayer ? (
											<>
												<h2 className="text-xl font-bold mb-2 text-gray-800">Сіз бақылаушысыз</h2>
												<p className="text-gray-600 mb-2">
													Тек команданың таңдалған ойыншысы ғана сұрақтарға жауап бере алады
												</p>
												<p className="text-sm text-[#7C3AED] font-medium">
													Команда ойыншысы: <strong>{userTeam.selectedPlayer.displayName}</strong>
												</p>
											</>
										) : (
											<>
												<h2 className="text-xl font-bold mb-2 text-gray-800">Ойыншы таңдауды күту</h2>
												<p className="text-gray-600 mb-2">
													Сіздің командада сұрақтарға жауап беру үшін ойыншы әлі таңдалмаған
												</p>
												<p className="text-sm text-orange-600">
													Команда ойыншысы таңдалғанша күтіңіз
												</p>
											</>
										)}
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
								<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent mx-auto mb-4"></div>
								<h2 className="text-2xl font-bold mb-2 text-gray-800">Келесі сұрақты күту...</h2>
								<p className="text-gray-600">Келесі сұрақты дайындап жатырмыз, күтіңіз</p>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{userTeam && (
							<GameChat
								competitionId={competition.id}
								teamId={userTeam.id}
								participantId={participantId}
								messages={teamChat || []}
								onRefresh={() => {
									refetchTeamChat()
									getTeamChatFull(competition.id, userTeam.id, participantId)
								}}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}