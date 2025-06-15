"use client"

import { Button } from "@/components/ui/button"
import { useGradeAnswer, usePendingAnswerDetail, useRecalculateScore } from "@/hooks/test/usePendingAnswerDetail"
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, Clock, Mail, RotateCcw, Target, Trophy, User, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
interface Props {
	params: {
		answerId: string
	}
}

export default function PendingAnswerDetailPage({ params }: Props) {
	const router = useRouter()


	const { data: answerDetail, isPending, isError } = usePendingAnswerDetail(params.answerId)
	const gradeAnswerMutation = useGradeAnswer()
	const recalculateScoreMutation = useRecalculateScore()

	const handleGradeAnswer = async (isCorrect: boolean) => {
		if (!params.answerId || params.answerId === 'undefined') {
			console.error('Некорректный answerId:', params.answerId)
			return
		}

		try {
			await gradeAnswerMutation.mutateAsync({
				answerId: params.answerId,
				isCorrect
			})
		} catch (error) {
			console.error('Ошибка при оценке ответа:', error)
		}
	}

	const handleRecalculateScore = async () => {
		if (answerDetail) {
			try {
				await recalculateScoreMutation.mutateAsync(answerDetail.attemptId)
			} catch (error) {
				console.error('Ошибка при пересчете баллов:', error)
			}
		}
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

	const calculateDuration = () => {
		if (!answerDetail) return '0 мин'
		const start = new Date(answerDetail.attemptInfo.startTime)
		const end = new Date(answerDetail.attemptInfo.endTime)
		const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
		return `${diffInMinutes} мин`
	}

	if (isPending) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg text-gray-600">Загрузка детальной информации...</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isError || !answerDetail) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-5xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<AlertCircle className="w-8 h-8 text-red-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
							<p className="text-gray-600">Не удалось загрузить информацию об ответе</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.back()}
						className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
					>
						<ArrowLeft className="w-4 h-4" />
						Назад к списку
					</Button>

					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-start justify-between mb-4">
							<div>
								<h1 className="text-2xl font-bold text-gray-900 mb-2">{answerDetail.testTitle}</h1>
								<h2 className="text-lg text-gray-700 mb-4">{answerDetail.questionTitle}</h2>
								<div className="flex items-center gap-4 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<Target className="w-4 h-4" />
										<span>Вес вопроса: {answerDetail.questionWeight} баллов</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4" />
										<span>Статус: {answerDetail.status === 'PENDING' ? 'На проверке' : answerDetail.status}</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
								<BookOpen className="w-4 h-4" />
								На проверке
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Student Answer */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Ответ студента</h3>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
								<p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
									{answerDetail.userAnswer}
								</p>
							</div>
						</div>

						{/* Grading Actions */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Оценка ответа</h3>

							{answerDetail.status === 'PENDING' ? (
								<div className="space-y-4">
									<p className="text-gray-600 mb-4">
										Оцените правильность ответа студента на данный вопрос:
									</p>

									<div className="flex gap-4">
										<Button
											onClick={() => handleGradeAnswer(true)}
											disabled={gradeAnswerMutation.isPending}
											className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
										>
											<CheckCircle className="w-5 h-5" />
											{gradeAnswerMutation.isPending ? 'Сохранение...' : 'Правильный ответ'}
										</Button>

										<Button
											onClick={() => handleGradeAnswer(false)}
											disabled={gradeAnswerMutation.isPending}
											className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
										>
											<XCircle className="w-5 h-5" />
											{gradeAnswerMutation.isPending ? 'Сохранение...' : 'Неправильный ответ'}
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center py-4">
									<div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
										<CheckCircle className="w-5 h-5" />
										Ответ уже оценен
									</div>
								</div>
							)}

							<div className="mt-6 pt-6 border-t border-gray-200">
								<Button
									onClick={handleRecalculateScore}
									disabled={recalculateScoreMutation.isPending}
									className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
								>
									<RotateCcw className={`w-5 h-5 ${recalculateScoreMutation.isPending ? 'animate-spin' : ''}`} />
									{recalculateScoreMutation.isPending ? 'Пересчитываем...' : 'Пересчитать баллы'}
								</Button>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Student Info */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о студенте</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<User className="w-5 h-5 text-gray-400" />
									<span className="text-gray-900">{answerDetail.student.name}</span>
								</div>
								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-gray-400" />
									<span className="text-gray-600">{answerDetail.student.email}</span>
								</div>
							</div>
						</div>

						{/* Attempt Info */}
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о попытке</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-600">Текущий балл:</span>
									<div className="flex items-center gap-2">
										<Trophy className="w-4 h-4 text-yellow-500" />
										<span className="font-semibold text-gray-900">{answerDetail.attemptInfo.currentScore}</span>
									</div>
								</div>

								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Всего вопросов:</span>
										<span className="text-gray-900">{answerDetail.attemptInfo.statistics.totalQuestions}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Правильных:</span>
										<span className="text-green-600">{answerDetail.attemptInfo.statistics.correctAnswers}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Неправильных:</span>
										<span className="text-red-600">{answerDetail.attemptInfo.statistics.incorrectAnswers}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">На проверке:</span>
										<span className="text-orange-600">{answerDetail.attemptInfo.statistics.pendingAnswers}</span>
									</div>
								</div>

								<div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-gray-600">Начато:</span>
										<span className="text-gray-900">{formatDate(answerDetail.attemptInfo.startTime)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Завершено:</span>
										<span className="text-gray-900">{formatDate(answerDetail.attemptInfo.endTime)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-600">Продолжительность:</span>
										<span className="text-gray-900">{calculateDuration()}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 