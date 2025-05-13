'use client'
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
	const router = useRouter();
	return (
		// <Link href={`/teacher/tests/${id}`} className="block">
			<div className="bg-white rounded-lg shadow p-5 mb-4 border cursor-pointer hover:bg-gray-50 transition"
				onClick={() => router.push(`/teacher/tests/${id}`)}
			>
				<div className="flex items-center justify-between mb-2">
					<span className="font-bold text-lg">{title}</span>
					<span
						className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${isDraft
							? "bg-yellow-100 text-yellow-800"
							: "bg-green-100 text-green-800"
							}`}
					>
						{isDraft ? "Не опубликован" : "Опубликован"}
					</span>
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