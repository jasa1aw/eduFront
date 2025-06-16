'use client'

import { Badge } from '@/components/ui/badge'
import { Question } from '@/types/competition'

interface QuestionDisplayProps {
	question: Question
}

export const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
	return (
		<div className="bg-white rounded-lg p-6 border">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">Сұрақ</h2>
				<Badge variant="outline">
					{question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' :
						question.type === 'SHORT_ANSWER' ? 'Short Answer' :
							'True/False'}
				</Badge>
			</div>
			<div className="space-y-4">
				<p className="text-lg">{question.title}</p>
			</div>
		</div>
	)
}