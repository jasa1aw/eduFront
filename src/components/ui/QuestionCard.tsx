import React from "react"
import { useDeleteQuestion } from "../../hooks/useDeleteQuestion"

interface QuestionCardProps {
	id: string
	number: number
	type: string
	title: string
	image: string | null | undefined
	onEdit: () => void
}

const typeLabels: Record<string, string> = {
	MULTIPLE_CHOICE: "Quiz",
	TRUE_FALSE: "True/False",
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
}) => {
	const { mutate: deleteQuestion, isPending } = useDeleteQuestion()

	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this question?')) {
			deleteQuestion(id)
		}
	}

	return (
		<div className="flex bg-white rounded-lg shadow p-2 mb-3 items-center">
			<div className="w-28 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
				{image ? (
					<img
						src={`http://localhost:3001/${image.replace(/\\/g, '/')}`}
						alt="question"
						className="object-cover w-full h-full"
					/>
				) : (
					<span className="text-4xl">📝</span>
				)}
			</div>
			<div className="flex-1 px-4">
				<div className="font-bold mb-1">{number} - {typeLabels[type] || type}</div>
				<div className="text-gray-700">{title}</div>
			</div>
			<div className="flex flex-col gap-2 ml-2">
				<button
					onClick={onEdit}
					className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
				>
					Редактировать
				</button>
				<button
					onClick={handleDelete}
					disabled={isPending}
					className={`px-2 py-1 bg-red-500 text-white rounded text-xs ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
				>
					{isPending ? 'Удаление...' : 'Удалить'}
				</button>
			</div>
		</div>
	)
}

export default QuestionCard 