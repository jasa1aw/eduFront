'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useCompetitionStore } from '@/store/competitionStore'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { AnswerForm } from '@/components/game/AnswerForm'
import { GameChat } from '@/components/game/GameChat'
import { TeamProgress } from '@/components/game/TeamProgress'
import { useSubmitAnswer } from '@/hooks/game/useSubmitAnswer'
import { useGameSocket } from '@/hooks/socket/useGameSocket'

export default function CompetitionGamePage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { competition, currentQuestion, participantId, teamChat } = useCompetitionStore()
	const { submitAnswer } = useGameSocket()
	const submitAnswerMutation = useSubmitAnswer()

	const handleSubmitAnswer = async (answer: { selectedAnswers?: string[], userAnswer?: string }) => {
		if (!currentQuestion || !participantId) return

		try {
			await submitAnswerMutation.mutateAsync({
				competitionId: competition!.id,
				participantId,
				questionId: currentQuestion.id,
				...answer
			})
		} catch (error) {
			console.error('Failed to submit answer:', error)
		}
	}

	if (!competition || !participantId) {
		return <div>Loading...</div>
	}

	const userParticipant = competition.participants.find(p => p.id === participantId)
	const userTeam = userParticipant?.teamName
		? competition.teams.find(t => t.name === userParticipant.teamName)
		: null

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{currentQuestion ? (
							<>
								<QuestionDisplay question={currentQuestion} />
								<AnswerForm
									question={currentQuestion}
									onSubmit={handleSubmitAnswer}
									isSubmitting={submitAnswerMutation.isPending}
								/>
							</>
						) : (
							<div className="text-center py-12">
								<h2 className="text-2xl font-bold">Waiting for next question...</h2>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{userTeam && (
							<TeamProgress
								teamName={userTeam.name}
								totalQuestions={10} // TODO: Get from API
								answeredQuestions={5} // TODO: Get from API
								correctAnswers={4} // TODO: Get from API
								totalScore={userTeam.score}
								isCompleted={false} // TODO: Get from API
								progress={50} // TODO: Get from API
							/>
						)}

						{userTeam && (
							<GameChat
								competitionId={competition.id}
								teamId={userTeam.id}
								participantId={participantId}
								messages={teamChat}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}