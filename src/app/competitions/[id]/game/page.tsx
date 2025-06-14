'use client'

import { AnswerForm } from '@/components/game/AnswerForm'
import { GameChat } from '@/components/game/GameChat'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
// import { TeamProgress } from '@/components/game/TeamProgress'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useCompetitionStore } from '@/store/competitionStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionGamePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const participantId = searchParams.get('participantId')
	const { competition, currentQuestion, teamChat } = useCompetitionStore()
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

	// Подключение к соревнованию и получение начальных данных
	useEffect(() => {
		if (competitionId && participantId) {
			// Подключаемся к соревнованию
			joinCompetition(competitionId, participantId)

			// Получаем текущий вопрос
			getCurrentQuestion(participantId)

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
			

			setTimeout(() => {
				getCurrentQuestion(participantId)
			}, 1000)

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
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}