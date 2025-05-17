'use client'
import { useDeleteTest } from "@/hooks/useDeleteTest"
import { useRouter } from 'next/navigation'
import React from "react"

interface TestCardProps {
	id: string
	title: string
	isDraft: boolean
	maxAttempts: number
	questionsCount: number
}

export const TestCard: React.FC<TestCardProps> = ({
	id,
	title,
	isDraft,
	maxAttempts,
	questionsCount,
}) => {
	const router = useRouter()
	const { mutate: deleteTest, isPending } = useDeleteTest()

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
			deleteTest(id)
		}
	}

	return (
		// <Link href={`/teacher/tests/${id}`} className="block">
		<div className="bg-white rounded-lg shadow p-5 mb-4 border cursor-pointer hover:bg-gray-50 transition"
			onClick={() => router.push(`/teacher/tests/${id}`)}
		>
			<div className="flex items-center justify-between mb-2">
				<span className="font-bold text-lg">{title}</span>
				<div className="flex items-center gap-2">
					<span
						className={`px-2 py-1 rounded text-xs font-semibold ${isDraft
							? "bg-yellow-100 text-yellow-800"
							: "bg-green-100 text-green-800"
							}`}
					>
						{isDraft ? "Не опубликован" : "Опубликован"}
					</span>
					<button
						onClick={handleDelete}
						disabled={isPending}
						className={`px-2 py-1 bg-red-500 text-white rounded text-xs ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{isPending ? 'Удаление...' : 'Удалить'}
					</button>
				</div>
			</div>
			<div className="flex justify-between text-sm text-gray-600 mt-2">
				<div>
					<span className="font-medium">Попыток: </span>
					{maxAttempts}
				</div>
				<div>
					<span className="font-medium">Вопросов: </span>
					{questionsCount}
				</div>
			</div>
		</div>
		// </Link>
	)
}

export default TestCard 