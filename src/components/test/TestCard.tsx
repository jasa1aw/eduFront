'use client'
import { ROUTES } from '@/constants/auth'
import { useDeleteTest } from "@/hooks/test/useDeleteTest"
import { useRole } from "@/hooks/useRole"
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from "react"
import { ConfirmDeleteModal } from '@/components/modal/ConfirmDeleteModal'

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
	const { isTeacher, isStudent } = useRole()
	const { mutate: deleteTest, isPending } = useDeleteTest()
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const handleDelete = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setShowDeleteModal(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		deleteTest(id)
		setShowDeleteModal(false)
	}, [deleteTest, id])

	const handleCardClick = useCallback(() => {
		// Перенаправление на соответствующую страницу в зависимости от роли
		if (isTeacher) {
			router.push(ROUTES.TEACHER.TEST_DETAIL(id))
		} else if (isStudent) {
			router.push(ROUTES.STUDENT.TEST_DETAIL(id))
		} else {
			// Fallback на страницу входа если роль не определена
			router.push(ROUTES.SIGN_IN)
		}
	}, [isTeacher, isStudent, router, id])

	return (
		<>
			<div
				className="w-[400px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
				onClick={handleCardClick}
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
						className={`w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
						title="Удалить тест"
					>
						<Trash size={15} />
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

			<ConfirmDeleteModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleConfirmDelete}
				title="Удалить тест"
				message={`Вы уверены, что хотите удалить тест "${title}"? Это действие нельзя будет отменить.`}
				isLoading={isPending}
			/>
		</>
	)
}

export default TestCard 