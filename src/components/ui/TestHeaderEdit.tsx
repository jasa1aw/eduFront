import { usePublishTest } from "@/hooks/usePublishTest"
import { useStartTest } from "@/hooks/useStartTest"
import { useTestExport } from "@/hooks/useTestExport"
import { useUpdateTest } from "@/hooks/useUpdateTest"
import type { Test } from "@/hooks/useUserTests"
import React, { useState } from "react"
import { toast } from "sonner"

interface TestHeaderEditProps {
	test: Test
}

export const TestHeaderEdit: React.FC<TestHeaderEditProps> = ({ test }) => {
	const { exportWithAnswers, exportWithoutAnswers } = useTestExport(test.id)
	const updateTestMutation = useUpdateTest()
	const publishTestMutation = usePublishTest()
	const startTestMutation = useStartTest()

	const [title, setTitle] = useState(test.title)
	const [maxAttempts, setMaxAttempts] = useState(test.maxAttempts ?? 1)
	const [defaultQuestionTime, setDefaultQuestionTime] = useState(60)

	const handleExportWithAnswers = async () => {
		try {
			const blob = await exportWithAnswers.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `test-${test.id}-with-answers.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to export test with answers:', error)
		}
	}

	const handleExportWithoutAnswers = async () => {
		try {
			const blob = await exportWithoutAnswers.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `test-${test.id}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to export test without answers:', error)
		}
	}

	const handleSaveTest = () => {
		updateTestMutation.mutate({
			testId: test.id,
			title,
			maxAttempts
		})
	}

	const handlePublishTest = () => {
		publishTestMutation.mutate(test.id)
	}

	const handleStartTest = () => {
		if (test.isDraft) {
			toast.error('Нельзя начать тест в режиме черновика. Сначала опубликуйте тест.')
			return
		}
		startTestMutation.mutate(test.id)
	}

	const handleTakeTest = () => {
		if (test.isDraft) {
			toast.error('Нельзя пройти тест в режиме черновика. Сначала опубликуйте тест.')
			return
		}
		startTestMutation.mutate(test.id)
	}

	return (
		<div className="bg-white rounded-lg shadow p-5 mb-4 border">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<input
					className="font-bold text-lg border-b-2 focus:outline-none"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<div className="flex flex-wrap gap-2">
					<button
						className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
						onClick={handleSaveTest}
						disabled={updateTestMutation.isPending}
					>
						{updateTestMutation.isPending ? 'Сохранение...' : 'Сохранить'}
					</button>
					<button
						className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
						onClick={handlePublishTest}
						disabled={!test.isDraft || publishTestMutation.isPending}
					>
						{test.isDraft ? 'Опубликовать' : 'Опубликован'}
						{publishTestMutation.isPending && 'Публикация...'}
					</button>
					<button
						className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
						onClick={handleStartTest}
						disabled={test.isDraft || startTestMutation.isPending}
					>
						{startTestMutation.isPending ? 'Запуск...' : 'Начать соревнование'}
					</button>
					<button
						className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
						onClick={handleTakeTest}
						disabled={test.isDraft || startTestMutation.isPending}
					>
						Пройти тест
					</button>
					<button
						className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
						onClick={handleExportWithAnswers}
						disabled={exportWithAnswers.isPending}
					>
						{exportWithAnswers.isPending ? 'Экспорт...' : 'Экспорт с ответами'}
					</button>
					<button
						className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
						onClick={handleExportWithoutAnswers}
						disabled={exportWithoutAnswers.isPending}
					>
						{exportWithoutAnswers.isPending ? 'Экспорт...' : 'Экспорт без ответов'}
					</button>
				</div>
			</div>
			{(updateTestMutation.isError || publishTestMutation.isError ||
				exportWithAnswers.isError || exportWithoutAnswers.isError) && (
					<div className="text-red-500 mt-2">
						Произошла ошибка при выполнении действия
					</div>
				)}
			<div className="flex flex-wrap gap-4 mt-4">
				<div>
					<label className="block text-xs text-gray-500">Попыток</label>
					<input
						className="border rounded p-1 w-16"
						type="number"
						value={maxAttempts}
						onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 1)}
					/>
				</div>
				<div>
					<label className="block text-xs text-gray-500">Время на вопрос (сек)</label>
					<input
						className="border rounded p-1 w-16"
						type="number"
						value={defaultQuestionTime}
						onChange={(e) => setDefaultQuestionTime(parseInt(e.target.value) || 60)}
					/>
				</div>
			</div>
		</div>
	)
}

export default TestHeaderEdit 