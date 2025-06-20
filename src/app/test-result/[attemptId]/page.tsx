'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import { ROUTES, USER_ROLES } from '@/constants/auth'
import { useAttepmtExport } from '@/hooks/test/useTestExport'
import { useRole } from '@/hooks/useRole'
import api from '@/lib/axios'
import { TestResultResponse } from '@/types/test'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

function TestResultContent({ params }: { params: { attemptId: string } }) {
	const router = useRouter()
	const { isTeacher, isStudent } = useRole()
	const { exportAttempt } = useAttepmtExport(params.attemptId)

	const { data: testResult, isLoading, isError } = useQuery<TestResultResponse>({
		queryKey: ['test-result', params.attemptId],
		queryFn: async () => {
			const response = await api.get<TestResultResponse>(`/tests/${params.attemptId}/results`)
			return response.data
		}
	})

	// Get scores from API response
	const getScores = useCallback(() => {
		if (!testResult) return { score: 0, maxScore: 0, percentage: 0 }

		return {
			score: testResult.correctAnswers,
			maxScore: testResult.totalQuestions,
			percentage: testResult.score
		}
	}, [testResult])

	const { score, maxScore, percentage } = getScores()
	const results = testResult?.results || []

	const handleBackToTests = useCallback(() => {
		// Перенаправление на соответствующую страницу в зависимости от роли
		if (isTeacher) {
			router.push(ROUTES.TEACHER.TESTS)
		} else if (isStudent) {
			router.push(ROUTES.STUDENT.TESTS)
		} else {
			// Fallback на страницу входа если роль не определена
			router.push(ROUTES.SIGN_IN)
		}
	}, [isTeacher, isStudent, router])

	const handleExportPDF = useCallback(async () => {
		try {
			const blob = await exportAttempt.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `нәтижелер-${testResult?.testTitle || 'тест'}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Тест нәтижелерін экспорттау сәтсіз аяқталды:', error)
		}
	}, [exportAttempt, testResult?.testTitle])

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
					<h2 className="text-xl font-medium text-gray-700">Нәтижелерді жүктеу...</h2>
				</div>
			</div>
		)
	}

	if (isError || !testResult) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50">
				<div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
					<div className="text-red-500 text-5xl mb-4">⚠️</div>
					<h2 className="text-xl font-medium text-gray-700 mb-2">Нәтижелерді жүктеу қатесі</h2>
					<p className="text-gray-500 mb-4">Тест нәтижелерін жүктеу мүмкін болмады. Кейінірек қайталап көріңіз.</p>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						onClick={handleBackToTests}
					>
						Тесттерге қайту
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
							<h1 className="text-2xl font-bold mb-2">{testResult?.testTitle || 'Тест нәтижелері'}</h1>
							<p className="text-gray-600">Режим: {testResult?.mode || 'Белгісіз'}</p>
						</div>
						<div className="mt-4 md:mt-0 text-center">
							<div className={`text-4xl font-bold ${scoreColor}`}>
								{percentage}%
							</div>
							<div className="text-gray-600 mt-1">
								{score} / {maxScore} дұрыс жауап
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
								<h3 className="text-lg font-medium">Сұрақ {index + 1}</h3>
								<div className={`px-3 py-1 rounded-full text-sm ${result.isCorrect === true
									? 'bg-green-100 text-green-800'
									: result.isCorrect === false
										? 'bg-red-100 text-red-800'
										: 'bg-yellow-100 text-yellow-800'
									}`}>
									{result.isCorrect === true
										? 'Дұрыс'
										: result.isCorrect === false
											? 'Қате'
											: 'Тексеруді қажет етеді'}
								</div>
							</div>

							<p className="text-gray-700 mb-4">{result.questionTitle || 'Тақырып жоқ'}</p>

							{/* User's answer */}
							<div className="mb-4">
								<h4 className="text-sm font-medium text-gray-500 mb-2">Сіздің жауабыңыз:</h4>
								{(result.questionType === 'MULTIPLE_CHOICE' || result.questionType === 'TRUE_FALSE') ? (
									<div className="space-y-2">
										{result.userSelectedAnswers && result.userSelectedAnswers.length > 0 ? (
											result.userSelectedAnswers.map((answer: string, i: number) => (
												<div
													key={i}
													className={`p-2 rounded-lg ${result.correctAnswers.includes(answer)
														? 'bg-green-50 border border-green-300'
														: 'bg-red-50 border border-red-300'
														}`}
												>
													{answer}
												</div>
											))
										) : (
											<div className="p-2 rounded-lg bg-gray-50 border border-gray-300">
												Жауап жоқ
											</div>
										)}
									</div>
								) : (
									<div className="p-3 border rounded-lg">
										{result.userAnswer || <span className="text-gray-400">Жауап жоқ</span>}
									</div>
								)}
							</div>

							{/* Correct answer */}
							{testResult?.showAnswers && (
								<div className="mb-4">
									<h4 className="text-sm font-medium text-gray-500 mb-2">Дұрыс жауап:</h4>
									<div className="p-3 bg-green-50 border border-green-300 rounded-lg">
										{result.correctAnswers && result.correctAnswers.length > 0
											? result.correctAnswers.join(', ')
											: <span className="text-gray-400">Мәліметтер жоқ</span>}
									</div>
								</div>
							)}

							{/* Explanation if available */}
							{result.explanation && testResult?.showAnswers && (
								<div>
									<h4 className="text-sm font-medium text-gray-500 mb-2">Түсініктеме:</h4>
									<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
										{result.explanation}
									</div>
								</div>
							)}
						</div>
					))}
				</div>

				{/* Action buttons */}
				<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
					<button
						className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
						onClick={handleBackToTests}
					>
						Тесттерге қайту
					</button>
					<button
						onClick={handleExportPDF}
						disabled={exportAttempt.isPending}
						className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
					>
						{exportAttempt.isPending ? (
							<>
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
								<span>Экспорт...</span>
							</>
						) : (
							<>
								<Download size={16} />
								<span>PDF жүктеп алу</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default function TestResultPage({ params }: { params: { attemptId: string } }) {
	return (
		<RoleGuard allowedRoles={[USER_ROLES.TEACHER, USER_ROLES.STUDENT]}>
			<TestResultContent params={params} />
		</RoleGuard>
	)
} 