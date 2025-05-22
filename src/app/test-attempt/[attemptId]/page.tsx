'use client'

import { Answer, useSaveTestProgress } from '@/hooks/useSaveTestProgress'
import { StartTestResponse } from '@/hooks/useStartTest'
import { useSubmitTest } from '@/hooks/useSubmitTest'
import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface QuestionOption {
	text: string
	isSelected: boolean
}

interface TestQuestion {
	id: string
	title: string
	type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'OPEN_QUESTION'
	options: string[]
	correctAnswers?: string[]
	image?: string
	timeLimit: number
	weight: number
	explanation?: string
	userAnswer?: string
	selectedOptions?: QuestionOption[]
}

interface TestAttempt extends StartTestResponse {
	answers?: Answer[]
}

export default function TestAttemptPage({ params }: { params: { attemptId: string } }) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [answers, setAnswers] = useState<Answer[]>([])
	const [timeLeft, setTimeLeft] = useState<number | null>(null)
	const [isPaused, setIsPaused] = useState(false)

	const saveProgressMutation = useSaveTestProgress()
	const submitTestMutation = useSubmitTest()

	// Fetch test attempt data - using the data stored in cache from useStartTest
	const { data: testAttempt, isLoading, isError } = useQuery<TestAttempt>({
		queryKey: ['test-attempt', params.attemptId],
		queryFn: async () => {
			// Try to get from cache first, if not available, fetch from API
			try {
				const response = await api.get<TestAttempt>(`/tests/attempts/${params.attemptId}`)
				return response.data
			} catch (error) {
				console.error('Error fetching test attempt:', error)
				throw error
			}
		},
		refetchOnWindowFocus: false,
		staleTime: Infinity // Don't refetch this data automatically
	})

	// Initialize questions with user selections
	useEffect(() => {
		if (testAttempt && testAttempt.test) {
			// Initialize timer with a default of 60 minutes if timeLimit is not set
			const testTimeLimit = (testAttempt.test.timeLimit || 60) * 60 // Convert minutes to seconds
			setTimeLeft(testTimeLimit)

			// Initialize answers array
			const initialAnswers = testAttempt.test.questions.map(question => {
				// Find existing answers if any
				const existingAnswer = testAttempt.answers?.find((a: Answer) => a.questionId === question.id)

				return {
					questionId: question.id,
					selectedAnswers: existingAnswer?.selectedAnswers || [],
					userAnswer: existingAnswer?.userAnswer || ''
				}
			})

			setAnswers(initialAnswers)
		}
	}, [testAttempt])

	// Timer countdown
	useEffect(() => {
		if (timeLeft === null || isPaused) return

		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev === null || prev <= 0) {
					clearInterval(timer)
					handleSubmitTest()
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft, isPaused])

	// Auto-save progress every 30 seconds
	useEffect(() => {
		if (!testAttempt) return

		const autoSaveInterval = setInterval(() => {
			handleSaveProgress()
		}, 30000) // 30 seconds

		return () => clearInterval(autoSaveInterval)
	}, [testAttempt, answers])

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	const handleOptionSelect = (optionText: string) => {
		if (!testAttempt || !testAttempt.test) return

		const currentQuestion = testAttempt.test.questions[currentQuestionIndex]

		setAnswers(prev => {
			const updatedAnswers = [...prev]
			const answerIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id)

			if (answerIndex !== -1) {
				const currentAnswer = updatedAnswers[answerIndex]

				if (currentQuestion.type === 'MULTIPLE_CHOICE') {
					// For multiple choice, toggle the selection
					const selectedAnswers = currentAnswer.selectedAnswers || []
					if (selectedAnswers.includes(optionText)) {
						// If already selected, remove it
						updatedAnswers[answerIndex] = {
							...currentAnswer,
							selectedAnswers: selectedAnswers.filter(a => a !== optionText)
						}
					} else {
						// If not selected, add it
						updatedAnswers[answerIndex] = {
							...currentAnswer,
							selectedAnswers: [...selectedAnswers, optionText]
						}
					}
				} else if (currentQuestion.type === 'TRUE_FALSE') {
					// For true/false, select only one option
					updatedAnswers[answerIndex] = {
						...currentAnswer,
						selectedAnswers: [optionText]
					}
				}
			}

			return updatedAnswers
		})
	}

	const handleTextAnswerChange = (text: string) => {
		if (!testAttempt || !testAttempt.test) return

		const currentQuestion = testAttempt.test.questions[currentQuestionIndex]

		setAnswers(prev => {
			const updatedAnswers = [...prev]
			const answerIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id)

			if (answerIndex !== -1) {
				updatedAnswers[answerIndex] = {
					...updatedAnswers[answerIndex],
					userAnswer: text
				}
			}

			return updatedAnswers
		})
	}

	const handleGoToQuestion = (index: number) => {
		if (testAttempt && testAttempt.test && index >= 0 && index < testAttempt.test.questions.length) {
			setCurrentQuestionIndex(index)
		}
	}

	const handleNextQuestion = () => {
		if (!testAttempt || !testAttempt.test) return

		if (currentQuestionIndex < testAttempt.test.questions.length - 1) {
			setCurrentQuestionIndex(prev => prev + 1)
		}
	}

	const handlePrevQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(prev => prev - 1)
		}
	}

	const handleSaveProgress = () => {
		if (!testAttempt) return

		saveProgressMutation.mutate({
			attemptId: params.attemptId,
			answers
		})
	}

	const handleSubmitTest = () => {
		if (!testAttempt) return

		// First save progress
		handleSaveProgress()

		// Then submit the test
		submitTestMutation.mutate({
			attemptId: params.attemptId,
			answers
		})
	}

	// Check if a question has been answered
	const isQuestionAnswered = (questionIndex: number): boolean => {
		if (!testAttempt || !testAttempt.test) return false

		const question = testAttempt.test.questions[questionIndex]
		const answer = answers.find(a => a.questionId === question.id)

		if (!answer) return false

		if (question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') {
			return (answer.selectedAnswers?.length || 0) > 0
		} else {
			return !!answer.userAnswer?.trim()
		}
	}

	const getQuestionProgress = () => {
		if (!testAttempt || !testAttempt.test) return '0/0'
		return `${currentQuestionIndex + 1}/${testAttempt.test.questions.length}`
	}

	const isOptionSelected = (optionText: string): boolean => {
		if (!testAttempt || !testAttempt.test) return false

		const currentQuestion = testAttempt.test.questions[currentQuestionIndex]
		const answer = answers.find(a => a.questionId === currentQuestion.id)

		if (!answer || !answer.selectedAnswers) return false

		return answer.selectedAnswers.includes(optionText)
	}

	const handleFlagQuestion = () => {
		toast.info('Вопрос отмечен для проверки позже')
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
					<h2 className="text-xl font-medium text-gray-700">Загрузка теста...</h2>
				</div>
			</div>
		)
	}

	if (isError || !testAttempt || !testAttempt.test) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-xl font-medium text-gray-700 mb-2">Ошибка загрузки теста</h2>
					<p className="text-gray-500 mb-4">Не удалось загрузить данные теста. Пожалуйста, попробуйте позже.</p>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={() => window.location.reload()}
					>
						Попробовать снова
					</button>
				</div>
			</div>
		)
	}

	// Make sure we have questions and the currentQuestionIndex is valid
	if (!testAttempt.test.questions || testAttempt.test.questions.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
					<div className="text-yellow-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-xl font-medium text-gray-700 mb-2">Тест не содержит вопросов</h2>
					<p className="text-gray-500 mb-4">В данном тесте отсутствуют вопросы.</p>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={() => window.history.back()}
					>
						Вернуться назад
					</button>
				</div>
			</div>
		)
	}

	// Ensure currentQuestionIndex is within bounds
	const safeQuestionIndex = Math.min(
		Math.max(0, currentQuestionIndex),
		testAttempt.test.questions.length - 1
	)

	const currentQuestion = testAttempt.test.questions[safeQuestionIndex]
	const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-5xl mx-auto shadow-md">
				{/* Header */}
				<div className="bg-white px-6 py-4 border-b">
					<h1 className="text-xl font-bold">{testAttempt.test.title}</h1>
				</div>

				{/* Navigation buttons */}
				<div className="p-4 border-b bg-white flex flex-wrap items-center">
					<div className="flex-1 overflow-x-auto py-2 flex space-x-2">
						{testAttempt.test.questions.map((_, index) => (
							<button
								key={index}
								onClick={() => handleGoToQuestion(index)}
								className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${currentQuestionIndex === index
									? 'bg-blue-500 text-white'
									: isQuestionAnswered(index)
										? 'bg-green-100 text-green-800 border border-green-300'
										: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
									}`}
							>
								{index + 1}
							</button>
						))}
					</div>

					<div className="ml-4 flex items-center">
						<div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full flex items-center font-medium">
							{timeLeft !== null ? formatTime(timeLeft) : '00:00'}
						</div>
					</div>
				</div>

				{/* Question Panel */}
				<div className="p-6">
					<div className="mb-6">
						<h2 className="text-lg font-medium mb-3">
							{currentQuestion.title}
						</h2>

						{/* Display image if available */}
						{currentQuestion.image && (
							<div className="mt-4 rounded-lg overflow-hidden">
								<img
									src={`http://localhost:3001/${currentQuestion.image.replace(/\\/g, '/')}`}
									alt="question"
									className="object-cover w-full h-64"
								/>
							</div>
						)}
					</div>

					{/* Answer options - match design from screenshot */}
					<div className="mt-6">
						{currentQuestion.type === 'MULTIPLE_CHOICE' && (
							<div className="space-y-3">
								{currentQuestion.options.map((option, index) => {
									const letter = String.fromCharCode(65 + index) // A, B, C, D
									return (
										<div
											key={index}
											onClick={() => handleOptionSelect(option)}
											className={`p-3 rounded-lg cursor-pointer transition-all border ${isOptionSelected(option)
												? 'border-blue-500 bg-blue-50'
												: 'border-gray-200 hover:bg-gray-50'
												}`}
										>
											<div className="flex items-center">
												<div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${isOptionSelected(option)
													? 'bg-blue-500 text-white'
													: 'bg-gray-100 text-gray-700'
													}`}>
													{letter}
												</div>
												<span>{option}</span>
											</div>
										</div>
									)
								})}
							</div>
						)}

						{currentQuestion.type === 'TRUE_FALSE' && (
							<div className="space-y-3">
								{['true', 'false'].map((option, index) => {
									const letter = index === 0 ? 'A' : 'B'
									return (
										<div
											key={index}
											onClick={() => handleOptionSelect(option)}
											className={`p-3 rounded-lg cursor-pointer transition-all border ${isOptionSelected(option)
												? 'border-blue-500 bg-blue-50'
												: 'border-gray-200 hover:bg-gray-50'
												}`}
										>
											<div className="flex items-center">
												<div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${isOptionSelected(option)
													? 'bg-blue-500 text-white'
													: 'bg-gray-100 text-gray-700'
													}`}>
													{letter}
												</div>
												<span>{option === 'true' ? 'Верно' : 'Неверно'}</span>
											</div>
										</div>
									)
								})}
							</div>
						)}

						{(currentQuestion.type === 'SHORT_ANSWER' || currentQuestion.type === 'OPEN_QUESTION') && (
							<div>
								<textarea
									className="w-full p-3 border rounded-lg min-h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
									placeholder="Введите ваш ответ..."
									value={currentAnswer?.userAnswer || ''}
									onChange={(e) => handleTextAnswerChange(e.target.value)}
								></textarea>
							</div>
						)}
					</div>
				</div>

				{/* Navigation Panel */}
				<div className="px-6 py-4 border-t bg-white flex justify-between">
					<button
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
						onClick={handlePrevQuestion}
						disabled={currentQuestionIndex === 0}
					>
						<svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
						</svg>
						Предыдущий
					</button>

					<div className="flex space-x-3">
						<button
							className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
							onClick={handleSaveProgress}
							disabled={saveProgressMutation.isPending}
						>
							{saveProgressMutation.isPending ? 'Сохранение...' : 'Сохранить'}
						</button>

						<button
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
							onClick={handleSubmitTest}
							disabled={submitTestMutation.isPending}
						>
							{submitTestMutation.isPending ? 'Отправка...' : 'Завершить тест'}
						</button>
					</div>

					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
						onClick={handleNextQuestion}
						disabled={currentQuestionIndex === testAttempt.test.questions.length - 1}
					>
						Следующий
						<svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
} 