'use client'

import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

// Updated to match the actual API response format
interface QuestionResult {
	questionId: string
	selectedAnswers: string[]
	userAnswer: string | null
	isCorrect: boolean | null
	question: {
		correctAnswers: string[]
		type: string
		title?: string
		explanation?: string
		image?: string
	}
}

export default function TestResultPage({ params }: { params: { attemptId: string } }) {
	const router = useRouter()

	const { data: results, isLoading, isError } = useQuery<QuestionResult[]>({
		queryKey: ['test-result', params.attemptId],
		queryFn: async () => {
			const response = await api.get<QuestionResult[]>(`/tests/${params.attemptId}/results`)
			return response.data
		}
	})

	// Calculate total score and max score
	const calculateScores = () => {
		if (!results) return { score: 0, maxScore: 0, percentage: 0 }

		const correctCount = results.filter(r => r.isCorrect === true).length
		const totalQuestions = results.length

		return {
			score: correctCount,
			maxScore: totalQuestions,
			percentage: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
		}
	}

	const { score, maxScore, percentage } = calculateScores()

	const formatDate = (dateString: string): string => {
		if (!dateString) return 'Н/Д'

		try {
			const date = new Date(dateString)

			if (isNaN(date.getTime())) {
				return 'Недействительная дата'
			}

			return new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}).format(date)
		} catch (error) {
			console.error('Error formatting date:', error)
			return 'Ошибка форматирования даты'
		}
	}

	const handleBackToTests = () => {
		router.push('/teacher/tests')
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
					<h2 className="text-xl font-medium text-gray-700">Загрузка результатов...</h2>
				</div>
			</div>
		)
	}

	if (isError || !results) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-xl font-medium text-gray-700 mb-2">Ошибка загрузки результатов</h2>
					<p className="text-gray-500 mb-4">Не удалось загрузить результаты теста. Пожалуйста, попробуйте позже.</p>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={handleBackToTests}
					>
						Вернуться к тестам
					</button>
				</div>
			</div>
		)
	}

	const scoreColor =
		percentage >= 80 ? 'text-green-600' :
			percentage >= 60 ? 'text-blue-600' :
				percentage >= 40 ? 'text-yellow-600' : 'text-red-600'

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div>
							<h1 className="text-2xl font-bold mb-2">Результаты теста</h1>
							<p className="text-gray-600">Тест завершен</p>
						</div>
						<div className="mt-4 md:mt-0 text-center">
							<div className={`text-4xl font-bold ${scoreColor}`}>
								{percentage}%
							</div>
							<div className="text-gray-600 mt-1">
								{score} / {maxScore} правильных ответов
							</div>
						</div>
					</div>
				</div>

				{/* Questions and Answers */}
				<div className="space-y-6">
					{results.map((result, index) => (
						<div
							key={result.questionId}
							className={`bg-white rounded-lg shadow-md p-6 ${result.isCorrect === true
								? 'border-l-4 border-green-500'
								: result.isCorrect === false
									? 'border-l-4 border-red-500'
									: 'border-l-4 border-yellow-500'
								}`}
						>
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-lg font-medium">Вопрос {index + 1}</h3>
								<div className={`px-3 py-1 rounded-full text-sm ${result.isCorrect === true
									? 'bg-green-100 text-green-800'
									: result.isCorrect === false
										? 'bg-red-100 text-red-800'
										: 'bg-yellow-100 text-yellow-800'
									}`}>
									{result.isCorrect === true
										? 'Верно'
										: result.isCorrect === false
											? 'Неверно'
											: 'Требует проверки'}
								</div>
							</div>

							<p className="text-gray-700 mb-4">{result.question.title || 'Нет заголовка'}</p>

							{result.question.image && (
								<div className="mb-4 rounded-lg overflow-hidden">
									<img
										src={`http://localhost:3001/${result.question.image.replace(/\\/g, '/')}`}
										alt="question"
										className="object-cover w-full h-64"
									/>
								</div>
							)}

							{/* User's answer */}
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-500 mb-2">Ваш ответ:</h4>
								{(result.question.type === 'MULTIPLE_CHOICE' || result.question.type === 'TRUE_FALSE') ? (
									<div className="space-y-2">
										{result.selectedAnswers && result.selectedAnswers.length > 0 ? (
											result.selectedAnswers.map((answer, i) => (
												<div
													key={i}
													className={`p-2 rounded-lg ${result.question.correctAnswers.includes(answer)
														? 'bg-green-50 border border-green-300'
														: 'bg-red-50 border border-red-300'
														}`}
												>
													{answer}
												</div>
											))
										) : (
											<div className="p-2 rounded-lg bg-gray-50 border border-gray-300">
												Нет ответа
											</div>
										)}
									</div>
								) : (
									<div className="p-3 border rounded-lg">
										{result.userAnswer || <span className="text-gray-400">Нет ответа</span>}
									</div>
								)}
							</div>

							{/* Correct answer */}
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-500 mb-2">Правильный ответ:</h4>
								<div className="p-3 bg-green-50 border border-green-300 rounded-lg">
									{result.question.correctAnswers && result.question.correctAnswers.length > 0
										? result.question.correctAnswers.join(', ')
										: <span className="text-gray-400">Нет данных</span>}
								</div>
							</div>

							{/* Explanation if available */}
							{result.question.explanation && (
								<div>
									<h4 className="text-sm font-medium text-gray-500 mb-2">Объяснение:</h4>
									<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
										{result.question.explanation}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Back button */}
				<div className="mt-8 text-center">
					<button
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={handleBackToTests}
					>
						Вернуться к тестам
					</button>
				</div>
			</div>
		</div>
	)
} 