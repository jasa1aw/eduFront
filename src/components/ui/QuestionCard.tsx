import { useUpdateQuestionWeight } from "@/hooks/useUpdateQuestionWeight"
import React from "react"
import { useDeleteQuestion } from "../../hooks/useDeleteQuestion"

interface QuestionCardProps {
	id: string
	number: number
	type: string
	title: string
	image: string | null | undefined
	onEdit: () => void
	points?: number
	options?: string[]
	correctAnswers?: string[]
	showAnswers?: boolean
}

const typeLabels: Record<string, string> = {
	MULTIPLE_CHOICE: "Multiple choice",
	TRUE_FALSE: "True / False",
	SHORT_ANSWER: "Short Answer",
	OPEN_QUESTION: "Open Question",
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
	id,
	number,
	type,
	title,
	image,
	onEdit,
	points = 2,
	options = [],
	correctAnswers = [],
	showAnswers = false,
}) => {
	const { mutate: deleteQuestion, isPending } = useDeleteQuestion()
	const { increaseWeight, decreaseWeight, isUpdating } = useUpdateQuestionWeight()

	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this question?')) {
			deleteQuestion(id)
		}
	}

	const handleIncreaseWeight = () => {
		increaseWeight(id)
	}

	const handleDecreaseWeight = () => {
		decreaseWeight(id)
	}

	return (
		<div className="bg-gray-50 rounded-lg p-6 mb-4 border border-gray-200">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold text-gray-800">{number}</span>
						<span className="text-gray-600">{typeLabels[type] || type}</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							className={`w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							onClick={handleDecreaseWeight}
							disabled={isUpdating || points <= 50}
							title="Уменьшить вес (-50)"
						>
							−
						</button>
						<span className="text-green-600 font-semibold min-w-[60px] text-center">
							{points} PT
						</span>
						<button
							className={`w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''
								}`}
							onClick={handleIncreaseWeight}
							disabled={isUpdating || points >= 500}
							title="Увеличить вес (+50)"
						>
							+
						</button>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={onEdit}
						className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
						title="Редактировать"
					>
						✏️
					</button>
					<button
						onClick={handleDelete}
						disabled={isPending}
						className={`w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
						title="Удалить"
					>
						🗑️
					</button>
				</div>
			</div>

			<div className="text-lg font-medium text-gray-800 mb-4">
				{title}
			</div>

			{image && (
				<div className="mb-4">
					<img
						src={`http://localhost:3001/${image.replace(/\\/g, '/')}`}
						alt="Question image"
						className="max-w-xs h-32 object-cover rounded-lg border"
					/>
				</div>
			)}

			{/* Show options for MULTIPLE_CHOICE and TRUE_FALSE */}
			{(type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') && options.length > 0 && (
				<div className="mb-4">
					<div className="grid grid-cols-1 gap-2">
						{options.map((option, idx) => (
							<div
								key={idx}
								className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg"
							>
								<div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
									⋮⋮
								</div>
								<div className="text-sm text-gray-700">
									{option}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Show correct answers when showAnswers is true */}
			{showAnswers && (
				<>
					{/* For MULTIPLE_CHOICE and TRUE_FALSE - show correct answers with green background */}
					{(type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') && correctAnswers.length > 0 && (
						<div className="mb-4">
							<div className="text-sm font-medium text-gray-600 mb-2">Правильные ответы:</div>
							<div className="grid grid-cols-1 gap-2">
								{correctAnswers.map((answer, idx) => (
									<div
										key={idx}
										className="flex items-center gap-2 p-3 bg-green-100 rounded-lg border border-green-200"
									>
										<div className="w-6 h-6 bg-green-200 rounded flex items-center justify-center">
											✓
										</div>
										<div className="text-sm text-green-800 font-medium">
											{answer}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* For SHORT_ANSWER - show correct answer in options style */}
					{type === 'SHORT_ANSWER' && correctAnswers.length > 0 && (
						<div className="mb-4">
							<div className="text-sm font-medium text-gray-600 mb-2">Правильный ответ:</div>
							<div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg border border-green-200">
								<div className="w-6 h-6 bg-green-200 rounded flex items-center justify-center">
									✓
								</div>
								<div className="text-sm text-green-800 font-medium">
									{correctAnswers[0]}
								</div>
							</div>
						</div>
					)}

					{/* For OPEN_QUESTION - don't show anything */}
				</>
			)}
		</div>
	)
}

export default QuestionCard 