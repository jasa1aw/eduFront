'use client'

import { AnswerForm } from '@/components/game/AnswerForm'
import { GameChat } from '@/components/game/GameChat'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
// import { TeamProgress } from '@/components/game/TeamProgress'
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

	// Отладочная информация для teamChat
	console.log('Current teamChat state:', teamChat.length, 'messages')
	console.log('TeamChat messages:', teamChat)
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

	console.log('User participant:', userParticipant)
	console.log('User team:', userTeam)
	console.log('Selected player:', userTeam?.selectedPlayer)
	console.log('Is selected player:', isSelectedPlayer)

	// HTTP запрос для получения истории чата с автообновлением каждую секунду
	const { data: teamChatData, refetch: refetchTeamChat } = useGetTeamChat(
		competition?.id || '',
		userTeam?.id || '',
		participantId || ''
	)

	// Обновляем состояние чата из HTTP запроса
	useEffect(() => {
		if (teamChatData?.messages) {
			console.log('Setting team chat from HTTP request:', teamChatData.messages.length, 'messages')
			console.log('TeamChatData:', teamChatData.messages)
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
	}, [competitionId, participantId])

	// Получение истории чата команды через WebSocket
	useEffect(() => {
		if (competition && participantId && userTeam) {
			console.log('Fetching team chat for:', { competitionId: competition.id, teamId: userTeam.id, participantId })
			getTeamChatFull(competition.id, userTeam.id, participantId)
		}
	}, [competition, participantId, userTeam?.id])

	// Дополнительное обновление чата через HTTP каждую секунду
	useEffect(() => {
		if (!competition || !participantId || !userTeam) return

		const interval = setInterval(() => {
			console.log('Manual refetch team chat')
			refetchTeamChat()
		}, 1000)

		return () => clearInterval(interval)
	}, [competition, participantId, userTeam?.id, refetchTeamChat])

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
				// console.log(response)
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


			// setTimeout(() => {
			// 	getCurrentQuestion(participantId)
			// }, 1000)

		} catch (error) {
			console.error('Failed to submit answer:', error)
		}
	}

	if (!competition || !participantId) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p>Loading game...</p>
				</div>
			</div>
		)
	}

	// Если соревнование завершено, показываем результаты
	if (competition.status === 'COMPLETED') {
		console.log('competition.status', competition.status)
		router.push(`/competitions/${competitionId}/result?participantId=${participantId}`)

	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Competition Header */}
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold">{competition.title}</h1>
					<p className="text-gray-600">{competition.testTitle}</p>
					{userTeam && (
						<div className="mt-2 flex justify-center gap-2">
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								Команда: {userTeam.name}
							</span>
							<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isSelectedPlayer
								? 'bg-green-100 text-green-800'
								: 'bg-gray-100 text-gray-800'
								}`}>
								{isSelectedPlayer ? '🎮 Игрок' : '👁️ Наблюдатель'}
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
									<div className="text-center py-8 bg-white rounded-lg border">
										<div className="mb-4">
											<div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
												<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
											</div>
										</div>
										{userTeam?.selectedPlayer ? (
											<>
												<h2 className="text-xl font-bold mb-2">Вы наблюдатель</h2>
												<p className="text-gray-600 mb-2">
													Только выбранный игрок команды может отвечать на вопросы
												</p>
												<p className="text-sm text-blue-600">
													Игрок команды: <strong>{userTeam.selectedPlayer.displayName}</strong>
												</p>
											</>
										) : (
											<>
												<h2 className="text-xl font-bold mb-2">Ожидание выбора игрока</h2>
												<p className="text-gray-600 mb-2">
													В вашей команде еще не выбран игрок для ответов на вопросы
												</p>
												<p className="text-sm text-orange-600">
													Дождитесь, пока будет выбран игрок команды
												</p>
											</>
										)}
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12 bg-white rounded-lg border">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
								<h2 className="text-2xl font-bold mb-2">Waiting for next question...</h2>
								<p className="text-gray-600">Please wait while we prepare the next question</p>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* {userTeam && (
							<TeamProgress
								teamName={userTeam.name}
								totalQuestions={10} // TODO: Get from competition data
								answeredQuestions={5} // TODO: Calculate from answered questions
								correctAnswers={4} // TODO: Get from team stats
								totalScore={userTeam.score}
								progress={50} // TODO: Calculate progress percentage
							/>
						)} */}

						{userTeam && (
							<GameChat
								competitionId={competition.id}
								teamId={userTeam.id}
								participantId={participantId}
								messages={teamChat || []}
								onRefresh={() => {
									console.log('Manual refresh triggered')
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