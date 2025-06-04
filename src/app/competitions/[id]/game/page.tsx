'use client'

import { AnswerForm } from '@/components/game/AnswerForm'
import { GameChat } from '@/components/game/GameChat'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { TeamProgress } from '@/components/game/TeamProgress'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useCompetitionStore } from '@/store/competitionStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionGamePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const participantId = searchParams.get('participantId')
	const { competition, currentQuestion, teamChat, leaderboard } = useCompetitionStore()
	const {
		joinCompetition,
		getCurrentQuestion,
		submitAnswer,
		getLeaderboard,
		getTeamChatFull
	} = useGameSocket()

	// Получаем ID соревнования из URL
	const competitionId = window.location.pathname.split('/')[2]

	// Определяем пользователя и его команду
	const userParticipant = competition?.participants.find(p => p.id === participantId)
	const userTeam = userParticipant?.teamName
		? competition?.teams.find(t => t.name === userParticipant.teamName)
		: null

	// Подключение к соревнованию и получение начальных данных
	useEffect(() => {
		if (competitionId && participantId) {
			// Подключаемся к соревнованию
			joinCompetition(competitionId, participantId)

			// Получаем текущий вопрос
			getCurrentQuestion(participantId)

			// Получаем лидерборд
			getLeaderboard(competitionId)
		}
	}, [competitionId, participantId])

	// Получение истории чата команды
	useEffect(() => {
		if (competition && participantId && userTeam) {
			getTeamChatFull(competition.id, userTeam.id, participantId)
		}
	}, [competition, participantId, userTeam?.id])

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
				// Проверяем, завершен ли тест
				if (response.isTestCompleted) {
					// Перенаправляем на страницу результатов
					router.push(`/competitions/${competitionId}/result?participantId=${participantId}`)
				} else {
					// После отправки ответа запрашиваем следующий вопрос
					setTimeout(() => {
						getCurrentQuestion(participantId)
					}, 1000)
				}
			})

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
	if ((competition as any).status === 'COMPLETED') {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-4xl mx-auto px-4 text-center">
					<h1 className="text-3xl font-bold mb-6">Competition Completed!</h1>
					<p className="text-lg mb-8">Final results are being calculated...</p>

					{leaderboard && leaderboard.teams && (
						<div className="bg-white rounded-lg p-6 border">
							<h2 className="text-2xl font-bold mb-4">Final Leaderboard</h2>
							<div className="space-y-3">
								{leaderboard.teams.map((team, index) => (
									<div key={team.team.id} className="flex items-center justify-between p-3 rounded bg-gray-50">
										<div className="flex items-center gap-3">
											<span className="text-2xl font-bold">#{index + 1}</span>
											<div
												className="w-4 h-4 rounded-full"
												style={{ backgroundColor: team.team.color }}
											/>
											<span className="font-semibold">{team.team.name}</span>
										</div>
										<div className="text-right">
											<div className="text-lg font-bold">{team.score} points</div>
											<div className="text-sm text-gray-600">
												{team.correctAnswers}/{team.totalQuestions} correct
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Competition Header */}
				<div className="text-center mb-6">
					<h1 className="text-2xl font-bold">{competition.title}</h1>
					<p className="text-gray-600">{competition.testTitle}</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{currentQuestion ? (
							<>
								<QuestionDisplay question={currentQuestion} />
								<AnswerForm
									question={currentQuestion}
									onSubmit={handleSubmitAnswer}
									isSubmitting={false}
								/>
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
						{userTeam && (
							<TeamProgress
								teamName={userTeam.name}
								totalQuestions={10} // TODO: Get from competition data
								answeredQuestions={5} // TODO: Calculate from answered questions
								correctAnswers={4} // TODO: Get from team stats
								totalScore={userTeam.score}
								isCompleted={competition.status === 'COMPLETED'}
								progress={50} // TODO: Calculate progress percentage
							/>
						)}

						{userTeam && (
							<GameChat
								competitionId={competition.id}
								teamId={userTeam.id}
								participantId={participantId}
								messages={teamChat || []}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}