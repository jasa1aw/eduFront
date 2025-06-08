import { useExamStart } from "@/hooks/useExamStart"
import { usePublishTest } from "@/hooks/usePublishTest"
import { useStartTest } from "@/hooks/useStartTest"
import { useTestExport } from "@/hooks/useTestExport"
import { useUpdateTest } from "@/hooks/useUpdateTest"
import type { Test } from "@/hooks/useUserTests"
import React, { useState } from "react"
import { toast } from "sonner"

interface TestActionButtonsProps {
	test: Test
}

export const TestActionButtons: React.FC<TestActionButtonsProps> = ({ test }) => {
	const { exportWithAnswers, exportWithoutAnswers } = useTestExport(test.id)
	const updateTestMutation = useUpdateTest()
	const publishTestMutation = usePublishTest()
	const startTestMutation = useStartTest()
	const startExamMutation = useExamStart()

	const [showAnswers, setShowAnswers] = useState(test.showAnswers ?? true)

	const handleExportWithAnswers = async () => {
		try {
			const blob = await exportWithAnswers.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `test-${test.title}-with-answers.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to export test with answers:', error)
		}
	}
	const handleExport = async () => {
		try {
			const blob = await exportWithoutAnswers.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `test-${test.title}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to export test with answers:', error)
		}
	}


	const handlePublishTest = () => {
		publishTestMutation.mutate(test.id)
	}

	const handleStartTest = () => {
		if (test.isDraft) {
			toast.error('Жоба режимінде тестті бастау мүмкін емес. Алдымен тестті жариялаңыз.')
			return
		}
		startExamMutation.mutate(test.id)
	}

	const handleTakeTest = () => {
		if (test.isDraft) {
			toast.error('Жоба режимінде тестті өту мүмкін емес. Алдымен тестті жариялаңыз.')
			return
		}
		startTestMutation.mutate(test.id)
	}

	const handleToggleShowAnswers = () => {
		const newShowAnswers = !showAnswers
		setShowAnswers(newShowAnswers)
		updateTestMutation.mutate({
			testId: test.id,
			showAnswers: newShowAnswers
		})
	}

	return (
		<div className="flex justify-end gap-3 mb-6">
			<button
				className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
				onClick={handleExport}
				disabled={exportWithoutAnswers.isPending}
			>
				📄 {exportWithoutAnswers.isPending ? 'Экспорт...' : 'PDF экспорт'}
			</button>
			<button
				className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
				onClick={handleExportWithAnswers}
				disabled={exportWithAnswers.isPending}
			>
				📄 {exportWithAnswers.isPending ? 'Экспорт...' : 'PDF экспорт(жауаптарымен)'}
			</button>

			<button
				className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
				onClick={handleTakeTest}
				disabled={startTestMutation.isPending}
			>
				Тестті өту
			</button>

			<button
				className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
				onClick={handlePublishTest}
				disabled={!test.isDraft || publishTestMutation.isPending}
			>
				{test.isDraft ? '🚀 Жариялау' : '✅ Жарияланған'}
			</button>

			<div className="flex items-center gap-2">
				<span className="text-sm text-gray-600">Жауаптарды көрсету</span>
				<button
					className={`w-12 h-6 rounded-full transition-colors ${showAnswers ? 'bg-green-500' : 'bg-gray-300'}`}
					onClick={handleToggleShowAnswers}
				>
					<div className={`w-5 h-5 bg-white rounded-full transition-transform ${showAnswers ? 'translate-x-6' : 'translate-x-0.5'}`} />
				</button>
			</div>
		
		{test.examMode && (
			<button
				className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
				onClick={handleStartTest}
				disabled={startTestMutation.isPending}
			>
				⚡ Емтиханды бастау
			</button>
		)}
			{(updateTestMutation.isError || publishTestMutation.isError ||
				exportWithAnswers.isError || exportWithoutAnswers.isError) && (
					<div className="text-red-500 ml-4">
						Әрекетті орындау кезінде қате орын алды
					</div>
				)}
		</div>
	)
}

export default TestActionButtons 