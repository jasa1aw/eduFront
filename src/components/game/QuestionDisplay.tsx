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
				<h2 className="text-xl font-semibold">Question</h2>
				<Badge variant="outline">
					{question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' :
						question.type === 'SHORT_ANSWER' ? 'Short Answer' :
							'True/False'}
				</Badge>
			</div>

			<div className="space-y-4">
				<p className="text-lg">{question.title}</p>

				{/* {question.type === 'MULTIPLE_CHOICE' && (
					<div className="space-y-2">
						{question.options.map((option, index) => (
							<div
								key={index}
								className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
							>
								{option}
							</div>
						))}
					</div>
				)}

				{question.type === 'TRUE_FALSE' && (
					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
							True
						</div>
						<div className="p-4 border rounded-lg text-center hover:bg-gray-50 cursor-pointer">
							False
						</div>
					</div>
				)}

				{question.type === 'SHORT_ANSWER' && (
					<div className="mt-4">
						<input
							type="text"
							className="w-full p-3 border rounded-lg"
							placeholder="Type your answer..."
						/>
					</div>
				)} */}
			</div>
		</div>
	)
}