'use client'

import { useState } from 'react'
import { Question } from '@/types/competition'
import { Button } from '@/components/ui/button'

interface AnswerFormProps {
	question: Question
	onSubmit: (answer: { selectedAnswers?: string[], userAnswer?: string }) => void
	isSubmitting: boolean
}

export const AnswerForm = ({ question, onSubmit, isSubmitting }: AnswerFormProps) => {
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
	const [userAnswer, setUserAnswer] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (question.type === 'SHORT_ANSWER') {
			onSubmit({ userAnswer })
		} else {
			onSubmit({ selectedAnswers })
		}
	}

	const handleOptionSelect = (option: string) => {
		if (question.type === 'MULTIPLE_CHOICE') {
			setSelectedAnswers(prev =>
				prev.includes(option)
					? prev.filter(a => a !== option)
					: [...prev, option]
			)
		} else if (question.type === 'TRUE_FALSE') {
			setSelectedAnswers([option])
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{question.type === 'MULTIPLE_CHOICE' && (
				<div className="space-y-2">
					{question.options.map((option, index) => (
						<div
							key={index}
							onClick={() => handleOptionSelect(option)}
							className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedAnswers.includes(option)
								? 'bg-blue-50 border-blue-500'
								: 'hover:bg-gray-50'
								}`}
						>
							{option}
						</div>
					))}
				</div>
			)}

			{question.type === 'TRUE_FALSE' && (
				<div className="grid grid-cols-2 gap-4">
					{['True', 'False'].map(option => (
						<div
							key={option}
							onClick={() => handleOptionSelect(option)}
							className={`p-4 border rounded-lg text-center cursor-pointer transition-colors ${selectedAnswers.includes(option)
								? 'bg-blue-50 border-blue-500'
								: 'hover:bg-gray-50'
								}`}
						>
							{option}
						</div>
					))}
				</div>
			)}

			{question.type === 'SHORT_ANSWER' && (
				<input
					type="text"
					value={userAnswer}
					onChange={(e) => setUserAnswer(e.target.value)}
					className="w-full p-3 border rounded-lg"
					placeholder="Жауапты енгізіңіз"
				/>
			)}

			<Button
				type="submit"
				className="w-full"
				disabled={isSubmitting || (
					question.type === 'SHORT_ANSWER'
						? !userAnswer.trim()
						: selectedAnswers.length === 0
				)}
			>
				{isSubmitting ? 'Жіберу...' : 'Жіберу'}
			</Button>
		</form>
	)
} 