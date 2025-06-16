'use client'

import { TestGame } from '@/types/test'
import { Calendar, CheckCircle, Clock, FileText, Hash } from 'lucide-react'

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
				relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg
				${isSelected
					? 'border-[#7C3AED] bg-gradient-to-br from-[#7C3AED]/5 to-[#8B5CF6]/5 shadow-xl scale-105'
					: 'border-gray-200 bg-white/80 backdrop-blur-md hover:border-[#7C3AED]/30 hover:scale-102'
				}
			`}
		>
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-lg ${isSelected ? 'bg-[#7C3AED]/10' : 'bg-gray-100'}`}>
							<FileText className={`w-5 h-5 ${isSelected ? 'text-[#7C3AED]' : 'text-gray-600'}`} />
						</div>
						<h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{test.title}</h3>
					</div>
					{isSelected && (
						<div className="flex-shrink-0 w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-lg">
							<CheckCircle className="w-4 h-4 text-white fill-current" />
						</div>
					)}
				</div>

				<div className="grid grid-cols-1 gap-3">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Hash className="w-4 h-4 text-[#7C3AED]" />
						<span>Сұрақтар: {test.questions?.length || 0}</span>
					</div>

					{test.timeLimit && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Clock className="w-4 h-4 text-[#7C3AED]" />
							<span>Уақыт: {test.timeLimit} мин</span>
						</div>
					)}

					{test.maxAttempts && (
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<Hash className="w-4 h-4 text-[#7C3AED]" />
							<span>Әрекеттер: {test.maxAttempts}</span>
						</div>
					)}
				</div>

				<div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
					<Calendar className="w-3 h-3" />
					<span>Құрылған: {new Date(test.createdAt).toLocaleDateString('kk-KZ', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}</span>
				</div>
			</div>

			{/* Gradient overlay for selected state */}
			{isSelected && (
				<div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 to-[#8B5CF6]/5 rounded-2xl pointer-events-none" />
			)}
		</div>
	)
} 