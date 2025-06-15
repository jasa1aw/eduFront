'use client'

import { TestGame } from '@/types/test'

interface TestSelectionCardProps {
	test: TestGame
	isSelected: boolean
	onSelect: (testId: string) => void
}

export const TestSelectionCard = ({ test, isSelected, onSelect }: TestSelectionCardProps) => {
	return (
		<div
			onClick={() => onSelect(test.id)}
			className={`
				p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
				${isSelected
					? 'border-blue-500 bg-blue-50 shadow-md'
					: 'border-gray-200 bg-white hover:border-gray-300'
				}
			`}
		>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-lg truncate">{test.title}</h3>
					{isSelected && (
						<div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
							<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
							</svg>
						</div>
					)}
				</div>

				<div className="flex items-center gap-4 text-sm text-gray-600">
					<span>Вопросов: {test.questions?.length || 0}</span>
					{test.timeLimit && (
						<span>Время: {test.timeLimit} мин</span>
					)}
					{test.maxAttempts && (
						<span>Попыток: {test.maxAttempts}</span>
					)}
				</div>

				<div className="text-xs text-gray-500">
					Создан: {new Date(test.createdAt).toLocaleDateString()}
				</div>
			</div>
		</div>
	)
} 