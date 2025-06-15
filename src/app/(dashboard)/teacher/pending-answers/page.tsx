"use client"

import { PendingAnswerCard } from "@/components/question/PendingAnswerCard"
import { usePendingAnswers } from "@/hooks/test/usePendingAnswers"
import { AlertCircle, BookOpen, ClipboardCheck, Users } from "lucide-react"

export default function PendingAnswersPage() {
	const { data: pendingTests, isPending, isError } = usePendingAnswers()

	if (isPending) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg text-gray-600">Загрузка ответов на проверку...</span>
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
								<AlertCircle className="w-8 h-8 text-red-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
							<p className="text-gray-600">Не удалось загрузить ответы на проверку</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	const totalPendingCount = pendingTests?.reduce((sum, test) => sum + test.pendingCount, 0) || 0
	const totalTests = pendingTests?.length || 0
	const totalAnswers = pendingTests?.reduce((sum, test) => sum + test.answers.length, 0) || 0

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
							<ClipboardCheck className="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Проверка ответов</h1>
							<p className="text-gray-600">Открытые вопросы, ожидающие проверки</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
									<ClipboardCheck className="w-6 h-6 text-orange-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Ответов на проверке</p>
									<p className="text-2xl font-bold text-gray-900">{totalPendingCount}</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
									<BookOpen className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Тестов с ответами</p>
									<p className="text-2xl font-bold text-gray-900">{totalTests}</p>
								</div>
							</div>
						</div>

						<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
									<Users className="w-6 h-6 text-green-600" />
								</div>
								<div>
									<p className="text-sm text-gray-500">Всего ответов</p>
									<p className="text-2xl font-bold text-gray-900">{totalAnswers}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Content */}
				{!pendingTests || pendingTests.length === 0 ? (
					<div className="text-center py-16">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<ClipboardCheck className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Нет ответов на проверке</h3>
						<p className="text-gray-600">Все открытые вопросы проверены</p>
					</div>
				) : (
					<div className="space-y-8">
						{pendingTests.map((test) => (
							<div key={test.testId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
								{/* Test Header */}
								<div className="flex items-center justify-between mb-6">
									<div>
										<h2 className="text-xl font-bold text-gray-900 mb-1">{test.testTitle}</h2>
										<p className="text-gray-600">Ответов на проверке: {test.pendingCount}</p>
									</div>
									<div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-full">
										<ClipboardCheck className="w-4 h-4" />
										{test.pendingCount} ответов
									</div>
								</div>

								{/* Answers Grid */}
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									{test.answers.map((answer) => (
										<PendingAnswerCard
											key={answer.answerId}
											{...answer}
											userRole="teacher"
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}