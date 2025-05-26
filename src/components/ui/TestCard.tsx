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
		<div
			className="w-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
			onClick={() => router.push(`/teacher/tests/${id}`)}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
						{title}
					</h3>
				</div>
				<button
					onClick={handleDelete}
					disabled={isPending}
					className={`ml-3 p-2 rounded-full transition-all duration-200 ${isPending
						? 'bg-gray-100 text-gray-400 cursor-not-allowed'
						: 'text-gray-400 hover:text-red-500 hover:bg-red-50'
						}`}
					title={isPending ? 'Удаление...' : 'Удалить тест'}
				>
					{isPending ? (
						<div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
					) : (
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					)}
				</button>
			</div>

			{/* Status Indicator */}
			<div className="mb-6">
				<div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isDraft
					? 'bg-amber-50 text-amber-700 border border-amber-200'
					: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
					}`}>
					<div className={`w-2 h-2 rounded-full mr-2 ${isDraft ? 'bg-amber-400' : 'bg-emerald-400'
						}`} />
					{isDraft ? 'Черновик' : 'Опубликован'}
				</div>
			</div>

			{/* Footer Stats */}
			<div className="flex items-center justify-between pt-4 border-t border-gray-100">
				<div className="flex items-center text-gray-600">
					<div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
						<svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<div className="text-sm text-gray-500">Вопросов</div>
						<div className="font-semibold text-gray-900">{questionsCount}</div>
					</div>
				</div>

				<div className="flex items-center text-gray-600">
					<div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
						<svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					</div>
					<div>
						<div className="text-sm text-gray-500">Попыток</div>
						<div className="font-semibold text-gray-900">{maxAttempts}</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TestCard 