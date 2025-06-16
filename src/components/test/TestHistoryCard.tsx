import { TestHistoryItem } from '@/types/test'
import { Award, Calendar, CheckCircle, Clock, PlayCircle, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface TestHistoryCardProps extends TestHistoryItem {
	userRole?: 'teacher' | 'student'
}

export const TestHistoryCard: React.FC<TestHistoryCardProps> = ({
	attemptId,
	// testId,
	testTitle,
	mode,
	status,
	score,
	startTime,
	endTime,
	timeLimit,
	duration,
	userRole = 'student'
}) => {
	const router = useRouter()

	const handleCardClick = () => {
		router.push(`/${userRole}/test-history/${attemptId}`)
	}

	const getStatusIcon = () => {
		switch (status) {
			case 'COMPLETED':
				return <CheckCircle className="w-5 h-5 text-green-600" />
			case 'FAILED':
				return <XCircle className="w-5 h-5 text-red-600" />
			case 'IN_PROGRESS':
				return <PlayCircle className="w-5 h-5 text-blue-600" />
			default:
				return <Clock className="w-5 h-5 text-gray-600" />
		}
	}

	const getStatusText = () => {
		switch (status) {
			case 'COMPLETED':
				return 'Аяқталды'
			case 'FAILED':
				return 'Өтпеді'
			case 'IN_PROGRESS':
				return 'Орындалуда'
			default:
				return 'Белгісіз'
		}
	}

	const getModeText = () => {
		return mode === 'EXAM' ? 'Емтихан' : 'Практика'
	}

	const getModeColor = () => {
		return mode === 'EXAM' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const formatDuration = (durationInSeconds: number) => {
		const minutes = Math.floor(durationInSeconds / 60)
		const seconds = durationInSeconds % 60
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	return (
		<div
			className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
			onClick={handleCardClick}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1 min-w-0">
					<h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
						{testTitle}
					</h3>
					<div className="flex items-center gap-2 mt-2">
						{getStatusIcon()}
						<span className="text-sm text-gray-600">{getStatusText()}</span>
					</div>
				</div>

				<div className="flex flex-col items-end gap-2">
					<div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getModeColor()}`}>
						{getModeText()}
					</div>
					{status === 'COMPLETED' && (
						<div className="text-2xl font-bold text-blue-600">
							{score}%
						</div>
					)}
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-4">
				<div className="flex items-center text-gray-600">
					<div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
						<Calendar className="w-4 h-4 text-blue-600" />
					</div>
					<div>
						<div className="text-sm text-gray-500">Басталу күні</div>
						<div className="font-semibold text-gray-900 text-sm">{formatDate(startTime)}</div>
					</div>
				</div>

				<div className="flex items-center text-gray-600">
					<div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
						<Clock className="w-4 h-4 text-purple-600" />
					</div>
					<div>
						<div className="text-sm text-gray-500">Жұмсалған уақыт</div>
						<div className="font-semibold text-gray-900 text-sm">
							{status === 'COMPLETED' && endTime ? formatDuration(duration) : 'Орындалуда'}
						</div>
					</div>
				</div>

				<div className="flex items-center text-gray-600">
					<div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
						<Award className="w-4 h-4 text-green-600" />
					</div>
					<div>
						<div className="text-sm text-gray-500">Уақыт шегі</div>
						<div className="font-semibold text-gray-900 text-sm">{timeLimit} мин</div>
					</div>
				</div>

				{status === 'COMPLETED' && endTime && (
					<div className="flex items-center text-gray-600">
						<div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
							<CheckCircle className="w-4 h-4 text-orange-600" />
						</div>
						<div>
							<div className="text-sm text-gray-500">Аяқталу күні</div>
							<div className="font-semibold text-gray-900 text-sm">{formatDate(endTime)}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
} 