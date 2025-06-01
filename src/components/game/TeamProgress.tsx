'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface TeamProgressProps {
	teamName: string
	totalQuestions: number
	answeredQuestions: number
	correctAnswers: number
	totalScore: number
	isCompleted: boolean
	progress: number
}

export const TeamProgress = ({
	teamName,
	totalQuestions,
	answeredQuestions,
	correctAnswers,
	totalScore,
	isCompleted,
	progress
}: TeamProgressProps) => {
	return (
		<div className="bg-white rounded-lg p-4 border">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-semibold">{teamName}</h3>
				<Badge variant={isCompleted ? "default" : "secondary"}>
					{isCompleted ? 'Completed' : 'In Progress'}
				</Badge>
			</div>

			<div className="space-y-4">
				<div>
					<div className="flex justify-between text-sm mb-1">
						<span>Progress</span>
						<span>{progress}%</span>
					</div>
					<Progress value={progress} />
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="font-medium">Questions:</span>{' '}
						{answeredQuestions}/{totalQuestions}
					</div>
					<div>
						<span className="font-medium">Correct:</span>{' '}
						{correctAnswers}/{answeredQuestions}
					</div>
					<div>
						<span className="font-medium">Score:</span>{' '}
						{totalScore} points
					</div>
					<div>
						<span className="font-medium">Accuracy:</span>{' '}
						{answeredQuestions > 0
							? Math.round((correctAnswers / answeredQuestions) * 100)
							: 0}%
					</div>
				</div>
			</div>
		</div>
	)
}