'use client'
import { useGetQsAttempt } from '@/hooks/test/useGetQsAttempt'
import { useSaveProgress } from '@/hooks/test/useSaveProgress'
import { useSubmitPracticeTest } from '@/hooks/test/useSubmitPracticeTest'
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

export default function ExamModeTest({ attemptId }: { attemptId: string }) {
	const queryClient = useQueryClient()
	const saveProgress = useSaveProgress()
	const submitPracticeTest = useSubmitPracticeTest()
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [textAnswer, setTextAnswer] = useState('')
	const [currentQuestionId, setCurrentQuestionId] = useState<string>('')
	const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
	const [timeLeft, setTimeLeft] = useState<number>(0)
	const [startTime, setStartTime] = useState<number | null>(null)
	const [imageModalOpen, setImageModalOpen] = useState(false)

	// Get attempt data from cache (set by useExamStart)
	const attemptData = queryClient.getQueryData(['test-attempt', attemptId]) as { attemptId: string; mode: string; firstQuestionId: string } | undefined

	// Get timeLimit from cache where it's guaranteed to exist
	const examData = queryClient.getQueryData(['test-attempt', attemptId]) as { timeLimit?: number } | undefined
	const timeLimit = examData?.timeLimit

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

	// Initialize timer when attempt data is available
	useEffect(() => {
		if (timeLimit) {
			const timeLimitInSeconds = timeLimit * 60 // Convert minutes to seconds
			const storageKey = `exam-start-time-${attemptId}`
			const savedStartTime = localStorage.getItem(storageKey)

			if (savedStartTime) {
				// Resume from saved time
				const parsedStartTime = parseInt(savedStartTime)
				setStartTime(parsedStartTime)

				const elapsed = Math.floor((Date.now() - parsedStartTime) / 1000)
				const remaining = Math.max(0, timeLimitInSeconds - elapsed)
				setTimeLeft(remaining)
			} else {
				// Start new timer
				const now = Date.now()
				setStartTime(now)
				setTimeLeft(timeLimitInSeconds)
				localStorage.setItem(storageKey, now.toString())
			}
		}
	}, [timeLimit, attemptId])

	// Timer countdown effect
	useEffect(() => {
		if (timeLeft <= 0 || !startTime) return

		const timer = setInterval(() => {
			if (timeLimit && startTime) {
				const timeLimitInSeconds = timeLimit * 60 // Convert minutes to seconds
				const elapsed = Math.floor((Date.now() - startTime) / 1000)
				const remaining = Math.max(0, timeLimitInSeconds - elapsed)
				setTimeLeft(remaining)

				// Auto-submit when time runs out
				if (remaining <= 0) {
					handleTimeUp()
				}
			}
		}, 1000)

		return () => clearInterval(timer)
	}, [timeLeft, startTime, timeLimit])

	useEffect(() => {
		setTextAnswer('')
		setSelectedAnswers([])
	}, [questionData?.id])

	// Handle time up
	const handleTimeUp = async () => {
		try {
			await submitPracticeTest.mutateAsync({ attemptId })
			// Clear the stored start time
			localStorage.removeItem(`exam-start-time-${attemptId}`)
		} catch (error) {
			console.error('Failed to submit test on time up:', error)
		}
	}

	// Format time for display
	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`
	}

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
				// Clear the stored start time
				localStorage.removeItem(`exam-start-time-${attemptId}`)
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
				// Clear the stored start time
				localStorage.removeItem(`exam-start-time-${attemptId}`)
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
				// Clear the stored start time
				localStorage.removeItem(`exam-start-time-${attemptId}`)
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
		<div className="min-h-screen bg-gradient-to-br from-purple-900 to-fuchsia-900 relative overflow-hidden flex flex-col">
			{/* Timer */}
			{timeLimit && (
				<div className="fixed top-4 right-4 z-50">
					<div className={`px-6 py-3 rounded-xl font-mono text-xl font-bold shadow-lg ${timeLeft <= 300 ? 'bg-red-600 text-white animate-pulse' :
						timeLeft <= 600 ? 'bg-yellow-500 text-black' :
							'bg-green-600 text-white'
						}`}>
						⏰ {formatTime(timeLeft)}
					</div>
				</div>
			)}

			{/* Question Section - Always centered */}
			<div className="flex-1 flex flex-col items-center justify-center px-4">
				{/* Image if exists */}
				{questionData.image && (
					<div className="mb-8 relative group">
						<img
							src={`http://localhost:3001/${questionData.image.replace(/\\/g, '/')}`}
							alt="Question image"
							className="max-w-md max-h-64 object-contain rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105"
							onClick={() => setImageModalOpen(true)}
						/>
						<div className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
							🔍
						</div>
					</div>
				)}

				{/* Question Text */}
				<div className="bg-black/60 text-white text-2xl px-12 py-6 rounded-xl shadow-lg max-w-4xl text-center">
					{questionData.title}
				</div>
			</div>

			{/* Answers Section - Always at bottom */}
			<div className="pb-8 px-4">
				{/* Варианты ответа или поле для ввода */}
				{questionData.type === 'MULTIPLE_CHOICE' && questionData.options && questionData.options.length > 0 ? (
					<div className="w-full max-w-6xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							{questionData.options.map((option: string, idx: number) => (
								<button
									key={option}
									className={`transition-all duration-200 text-white text-xl font-semibold rounded-2xl shadow-lg h-32 flex flex-col justify-between p-4 hover:scale-105 focus:outline-none ${selectedAnswers.includes(option)
										? 'bg-green-600 ring-4 ring-green-300'
										: CARD_COLORS[idx % CARD_COLORS.length]
										}`}
									onClick={() => handleMultipleChoice(option)}
									disabled={isTransitioning}
								>
									<div className="flex justify-between items-start w-full">
										{selectedAnswers.includes(option) && (
											<span className="text-2xl">✓</span>
										)}
										<span className="text-lg bg-white/20 rounded-full w-8 h-8 flex items-center justify-center ml-auto">{idx + 1}</span>
									</div>
									<div className="flex-1 flex items-center justify-center">
										<span className="text-center">{option}</span>
									</div>
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
						{questionData.options.map((option: string, idx: number) => (
							<button
								key={option}
								className={`transition-all duration-200 text-white text-xl font-semibold rounded-2xl shadow-lg h-32 flex flex-col justify-between p-4 hover:scale-105 focus:outline-none ${CARD_COLORS[idx % CARD_COLORS.length]}`}
								onClick={() => handleTrueFalseAnswer(option)}
								disabled={isTransitioning}
							>
								<div className="flex justify-end items-start w-full">
									<span className="text-lg bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">{idx + 1}</span>
								</div>
								<div className="flex-1 flex items-center justify-center">
									<span className="text-center">{option}</span>
								</div>
							</button>
						))}
					</div>
				) : (questionData.type === 'OPEN_QUESTION' || questionData.type === 'SHORT_ANSWER') ? (
					<div className="w-full max-w-2xl mx-auto">
						<div className="flex gap-3 items-end">
							<textarea
								className="flex-1 p-4 rounded-xl border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 text-lg resize-none"
								rows={4}
								placeholder="Введите ваш ответ..."
								value={textAnswer}
								onChange={e => setTextAnswer(e.target.value)}
								disabled={isTransitioning}
							/>
							<button
								className="px-4 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold shadow hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center"
								onClick={handleTextAnswer}
								disabled={isTransitioning || !textAnswer.trim()}
							>
								{isTransitioning ? '⏳' : '➤'}
							</button>
						</div>
					</div>
				) : (
					<div className="text-white text-center">Нет вариантов ответа или неизвестный тип вопроса</div>
				)}
			</div>

			{/* Image Modal */}
			{imageModalOpen && questionData.image && (
				<div
					className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
					onClick={() => setImageModalOpen(false)}
				>
					<div className="relative max-w-4xl max-h-full">
						<img
							src={`http://localhost:3001/${questionData.image.replace(/\\/g, '/')}`}
							alt="Question image enlarged"
							className="max-w-full max-h-full object-contain rounded-xl"
							onClick={e => e.stopPropagation()}
						/>
						<button
							className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
							onClick={() => setImageModalOpen(false)}
						>
							✕
						</button>
					</div>
				</div>
			)}
		</div>
	)
} 