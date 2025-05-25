'use client'
import { useGetQsAttempt } from '@/hooks/useGetQsAttempt'
import { useSaveProgress } from '@/hooks/useSaveProgress'
import { useSubmitPracticeTest } from '@/hooks/useSubmitPracticeTest'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const CARD_COLORS = [
	'bg-blue-500',
	'bg-cyan-500',
	'bg-yellow-400',
	'bg-pink-400',
	'bg-purple-500'
]

function Loader() {
	return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>
}

function ErrorBlock() {
	return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Произошла ошибка</div>
}

export default function TestRunner({ attemptId }: { attemptId: string }) {
	const queryClient = useQueryClient()
	const saveProgress = useSaveProgress()
	const submitPracticeTest = useSubmitPracticeTest()
	// const router = useRouter()
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [textAnswer, setTextAnswer] = useState('')
	const [currentQuestionId, setCurrentQuestionId] = useState<string>('')
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])

	// Get attempt data from cache (set by useStartTest)
	const attemptData = queryClient.getQueryData(['test-attempt', attemptId]) as { attemptId: string; mode: string; firstQuestionId: string } | undefined

	// Get current question data
	const { data: questionData, isLoading, isError } = useGetQsAttempt(
		attemptId,
		currentQuestionId || attemptData?.firstQuestionId || ''
	)

	// Set initial question ID when attempt data is available
	useEffect(() => {
		if (attemptData?.firstQuestionId && !currentQuestionId) {
			setCurrentQuestionId(attemptData.firstQuestionId)
		}
	}, [attemptData?.firstQuestionId, currentQuestionId])

	useEffect(() => {
		setTextAnswer('')
		setSelectedAnswers([])
	}, [questionData?.id])

	if (isLoading) return <Loader />
	if (isError || !questionData) return <ErrorBlock />



	// Handle TRUE_FALSE (single answer)
	const handleTrueFalseAnswer = async (option: string) => {
		if (isTransitioning) return
		setIsTransitioning(true)
		try {
			const response = await saveProgress.mutateAsync({
				attemptId,
				answer: {
					questionId: questionData.id,
					selectedAnswers: [option]
				}
			})

			if (response.isCompleted) {
				// Test is completed, submit it
				await submitPracticeTest.mutateAsync({ attemptId })
			} else if (response.nextQuestionId) {
				// Move to next question
				setCurrentQuestionId(response.nextQuestionId)
				setTextAnswer('') // Clear text answer for next question
			}
		} catch (error) {
			console.error('Failed to save answer:', error)
		}
		setIsTransitioning(false)
	}

	// Handle MULTIPLE_CHOICE selection
	const handleMultipleChoice = (option: string) => {
		if (isTransitioning) return

		setSelectedAnswers(prev => {
			if (prev.includes(option)) {
				// Remove if already selected
				return prev.filter(answer => answer !== option)
			} else {
				// Add if not selected
				return [...prev, option]
			}
		})
	}

	// Submit MULTIPLE_CHOICE answers
	const handleSubmitMultipleChoice = async () => {
		if (isTransitioning || selectedAnswers.length === 0) return
		setIsTransitioning(true)
		try {
			const response = await saveProgress.mutateAsync({
				attemptId,
				answer: {
					questionId: questionData.id,
					selectedAnswers: selectedAnswers
				}
			})

			if (response.isCompleted) {
				// Test is completed, submit it
				await submitPracticeTest.mutateAsync({ attemptId })
			} else if (response.nextQuestionId) {
				// Move to next question
				setCurrentQuestionId(response.nextQuestionId)
				setTextAnswer('') // Clear text answer for next question
			}
		} catch (error) {
			console.error('Failed to save answer:', error)
		}
		setIsTransitioning(false)
	}

	const handleTextAnswer = async () => {
		if (isTransitioning || !textAnswer.trim()) return
		setIsTransitioning(true)
		try {
			const response = await saveProgress.mutateAsync({
				attemptId,
				answer: {
					questionId: questionData.id,
					userAnswer: textAnswer.trim()
				}
			})

			if (response.isCompleted) {
				// Test is completed, submit it
				await submitPracticeTest.mutateAsync({ attemptId })
			} else if (response.nextQuestionId) {
				// Move to next question
				setCurrentQuestionId(response.nextQuestionId)
				setTextAnswer('') // Clear text answer for next question
			}
		} catch (error) {
			console.error('Failed to save answer:', error)
		}
		setIsTransitioning(false)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 to-fuchsia-900 relative overflow-hidden">
			{/* Вопрос */}
			<div className="flex flex-col items-center mt-16">
				<div className="mb-2 text-white/80 text-lg font-mono">
					Вопрос: {questionData.id}
				</div>
				<div className="bg-black/60 text-white text-2xl px-12 py-6 rounded-xl mb-10 shadow-lg max-w-3xl text-center">
					{questionData.title}
				</div>
				{/* Варианты ответа или поле для ввода */}
				{questionData.type === 'MULTIPLE_CHOICE' && questionData.options && questionData.options.length > 0 ? (
					<div className="w-full max-w-5xl px-8">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
							{questionData.options.map((option: string, idx: number) => (
								<button
									key={option}
									className={`transition-all duration-200 text-white text-xl font-semibold rounded-2xl shadow-lg h-40 flex items-center justify-center relative hover:scale-105 focus:outline-none ${selectedAnswers.includes(option)
										? 'bg-green-600 ring-4 ring-green-300'
										: CARD_COLORS[idx % CARD_COLORS.length]
										}`}
									onClick={() => handleMultipleChoice(option)}
									disabled={isTransitioning}
								>
									<span className="absolute top-2 right-3 text-lg bg-white/20 rounded-full px-2">{idx + 1}</span>
									{selectedAnswers.includes(option) && (
										<span className="absolute top-2 left-3 text-2xl">✓</span>
									)}
									{option}
								</button>
							))}
						</div>
						<div className="text-center">
							<button
								className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
								onClick={handleSubmitMultipleChoice}
								disabled={isTransitioning || selectedAnswers.length === 0}
							>
								{isTransitioning ? 'Отправка...' : `Ответить (${selectedAnswers.length} выбрано)`}
							</button>
						</div>
					</div>
				) : questionData.type === 'TRUE_FALSE' && questionData.options && questionData.options.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-8">
						{questionData.options.map((option: string, idx: number) => (
							<button
								key={option}
								className={`transition-all duration-200 text-white text-xl font-semibold rounded-2xl shadow-lg h-40 flex items-center justify-center relative hover:scale-105 focus:outline-none ${CARD_COLORS[idx % CARD_COLORS.length]}`}
								onClick={() => handleTrueFalseAnswer(option)}
								disabled={isTransitioning}
							>
								<span className="absolute top-2 right-3 text-lg bg-white/20 rounded-full px-2">{idx + 1}</span>
								{option}
							</button>
						))}
					</div>
				) : (questionData.type === 'OPEN_QUESTION' || questionData.type === 'SHORT_ANSWER') ? (
					<div className="w-full max-w-2xl flex flex-col items-center">
						<textarea
							className="w-full p-4 rounded-xl border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 text-lg"
							rows={4}
							placeholder="Введите ваш ответ..."
							value={textAnswer}
							onChange={e => setTextAnswer(e.target.value)}
							disabled={isTransitioning}
						/>
						<button
							className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
							onClick={handleTextAnswer}
							disabled={isTransitioning || !textAnswer.trim()}
						>
							{isTransitioning ? 'Отправка...' : 'Ответить'}
						</button>
					</div>
				) : (
					<div className="text-white">Нет вариантов ответа или неизвестный тип вопроса</div>
				)}
			</div>
		</div>
	)
} 