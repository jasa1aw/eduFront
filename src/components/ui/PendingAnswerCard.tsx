import { Button } from '@/components/ui/button'
import { PendingAnswer } from '@/hooks/usePendingAnswers'
import { Calendar, Clock, FileText, Mail, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface PendingAnswerCardProps extends PendingAnswer {
	onReview: (answerId: string) => void
	userRole?: 'teacher' | 'student'
}

export const PendingAnswerCard: React.FC<PendingAnswerCardProps> = ({
	answerId,
	questionTitle,
	userAnswer,
	studentName,
	studentEmail,
	submittedAt,
	startedAt,
	onReview,
	userRole = 'teacher'
}) => {
	const router = useRouter()
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const calculateDuration = () => {
		const start = new Date(startedAt)
		const submit = new Date(submittedAt)
		const diffInMinutes = Math.floor((submit.getTime() - start.getTime()) / (1000 * 60))
		return `${diffInMinutes} мин`
	}

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
						{questionTitle}
					</h3>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<User className="w-4 h-4" />
						<span>{studentName}</span>
					</div>
				</div>

				<div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
					<Clock className="w-4 h-4" />
					На проверке
				</div>
			</div>

			{/* Student Info */}
			<div className="bg-gray-50 rounded-lg p-4 mb-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Mail className="w-4 h-4" />
						<span>{studentEmail}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Calendar className="w-4 h-4" />
						<span>Отправлено: {formatDate(submittedAt)}</span>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-600">
						<Clock className="w-4 h-4" />
						<span>Время выполнения: {calculateDuration()}</span>
					</div>
				</div>
			</div>

			{/* Answer */}
			<div className="mb-4">
				<div className="flex items-center gap-2 mb-2">
					<FileText className="w-4 h-4 text-blue-600" />
					<span className="text-sm font-medium text-gray-700">Ответ студента:</span>
				</div>
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<p className="text-gray-800 whitespace-pre-wrap">{userAnswer}</p>
				</div>
			</div>

			{/* Action Button */}
			<div className="flex justify-end">
				<Button
					onClick={() => router.push(`/${userRole}/pending-answers/${answerId}`)}
					className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
				>
					Проверить ответ
				</Button>
			</div>
		</div>
	)
}