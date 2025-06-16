"use client"

import { TestHistoryCard } from "@/components/test/TestHistoryCard"
import { useTestHistory } from "@/hooks/test/useTestHistory"
import { BookOpen, History, TrendingUp } from "lucide-react"

export default function TestHistoryPage() {
	const { data: testHistory, isPending, isError, isSuccess } = useTestHistory()

	if (isPending) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg text-gray-600">Тесттер тарихын жүктеу...</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<History className="w-8 h-8 text-red-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Жүктеуде қателік туындады</h3>
							<p className="text-gray-600">Тесттер тарихын жүктеу мүмкін болмады</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const completedTests = testHistory?.filter(test => test.status === 'COMPLETED') || []
	const averageScore = completedTests.length > 0
		? Math.round(completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length)
		: 0

	if (isSuccess) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<History className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">Тесттер тарихы</h1>
								<p className="text-gray-600">Сіз өтіп кеткен барлық тесттер</p>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
										<BookOpen className="w-6 h-6 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Барлық тесттер</p>
										<p className="text-2xl font-bold text-gray-900">{testHistory?.length || 0}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-6 h-6 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Аяқталған</p>
										<p className="text-2xl font-bold text-gray-900">{completedTests.length}</p>
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
										<div className="text-lg font-bold text-purple-600">{averageScore}%</div>
									</div>
									<div>
										<p className="text-sm text-gray-500">Орташа балл</p>
										<p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Test History Cards */}
					{!testHistory || testHistory.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<History className="w-8 h-8 text-gray-400" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Тарих таза</h3>
							<p className="text-gray-600">Сіз бірде-бір тест өтпегенсіз</p>
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{testHistory.map((test) => (
								<TestHistoryCard
									key={test.attemptId}
									{...test}
									userRole="teacher"
								/>
							))}
						</div>
					)}
				</div>
			</div>
		)
	} 
}