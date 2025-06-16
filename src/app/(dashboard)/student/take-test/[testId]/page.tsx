"use client"

import { Button } from "@/components/ui/button"
import { useExamStart } from "@/hooks/test/useExamStart"
import { useStartTest } from "@/hooks/test/useStartTest"
import { useTestInfo } from "@/hooks/test/useTestInfo"
import { useParams, useRouter } from "next/navigation"

export default function TestInfoPage() {
	const params = useParams()
	const router = useRouter()

	const testId = params.testId as string

	const { data: testInfo, isLoading, isError } = useTestInfo(testId)
	const startTestMutation = useStartTest()
	const startExamMutation = useExamStart()

	const handleStartPractice = (testId: string) => {
		// Перенаправляем на прохождение теста в режиме практики
		startTestMutation.mutate(testId)
	}

	const handleStartExam = (testId: string) => {
		// Перенаправляем на прохождение теста в режиме экзамена
		startExamMutation.mutate(testId)
	}

	const handleBack = () => {
		router.push('/student/take-test')
	}

	if (isLoading || !testInfo) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
				<div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
					<div className="flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
						<span className="ml-3 text-lg text-gray-600">Тест ақпаратын жүктеу...</span>
					</div>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
				<div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.732 13.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">Жүктеу қатесі</h2>
					<p className="text-gray-600 mb-6">Тест туралы ақпаратты жүктеу мүмкін болмады</p>
					<Button onClick={handleBack} variant="outline">
						Артқа қайту
					</Button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
			<div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
				{/* Кнопка "Назад" */}
				<div className="mb-6">
					<Button
						onClick={handleBack}
						variant="outline"
						className="flex items-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Артқа
					</Button>
				</div>

				{/* Карточка с информацией о тесте */}
				<div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
					<div className="flex items-start gap-4">
						<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
							{testInfo.questionsCount}
						</div>

						<div className="flex-1">
							<h1 className="text-2xl font-bold text-gray-900 mb-2">{testInfo.title}</h1>
							<p className="text-gray-600 mb-4">Мұғалім: {testInfo.creatorName}</p>

							<div className="grid grid-cols-2 gap-4">
								<div className="bg-white rounded-lg p-3 border border-gray-200">
									<div className="text-sm text-gray-500">Сұрақтар</div>
									<div className="text-lg font-semibold text-gray-900">{testInfo.questionsCount}</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200">
									<div className="text-sm text-gray-500">Уақыт</div>
									<div className="text-lg font-semibold text-gray-900">{testInfo.timeLimit} мин</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200">
									<div className="text-sm text-gray-500">Әрекеттер</div>
									<div className="text-lg font-semibold text-gray-900">{testInfo.maxAttempts}</div>
								</div>

								<div className="bg-white rounded-lg p-3 border border-gray-200">
									<div className="text-sm text-gray-500">Емтихан режимі</div>
									<div className="text-lg font-semibold text-gray-900">
										{testInfo.examMode ? "Бар" : "Жоқ"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Кнопки для прохождения теста */}
				<div className="space-y-4">
					<h2 className="text-xl font-bold text-gray-900 mb-4">Тапсыру режимін таңдаңыз:</h2>

					{/* Кнопка практики */}
					<Button
						onClick={() => handleStartPractice(testId)}
						className="w-full h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
					>
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<div className="text-left">
								<div className="font-bold">Жаттығу режимі</div>
								<div className="text-sm opacity-90">Дұрыс жауаптарды көру мүмкіндігімен жаттығу</div>
							</div>
						</div>
					</Button>

					{/* Кнопка экзамена (только если есть examMode) */}
					{testInfo.examMode && (
						<Button
							onClick={() => handleStartExam(testId)}
							className="w-full h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="text-left">
									<div className="font-bold">Емтихан режимі</div>
									<div className="text-sm opacity-90">Шектеулермен ресми тапсыру</div>
								</div>
							</div>
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}