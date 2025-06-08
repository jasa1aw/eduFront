import { useExamStart } from "@/hooks/useExamStart"
import { useGenerateTestLink } from "@/hooks/useGenerateTestLink"
import { usePublishTest } from "@/hooks/usePublishTest"
import { useStartTest } from "@/hooks/useStartTest"
import { useTestExport } from "@/hooks/useTestExport"
import { useUpdateTest } from "@/hooks/useUpdateTest"
import type { Test } from "@/hooks/useUserTests"
import { ArrowLeft, Copy, Link } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { toast } from "sonner"

interface TestActionButtonsProps {
	test: Test
}

export const TestActionButtons: React.FC<TestActionButtonsProps> = ({ test }) => {
	const router = useRouter()
	const { exportWithAnswers, exportWithoutAnswers } = useTestExport(test.id)
	const updateTestMutation = useUpdateTest()
	const publishTestMutation = usePublishTest()
	const startTestMutation = useStartTest()
	const startExamMutation = useExamStart()
	const generateTestLink = useGenerateTestLink()

	const [showAnswers, setShowAnswers] = useState(test.showAnswers ?? true)
	const [generatedLink, setGeneratedLink] = useState<string>('')

	const handleBack = () => {
		router.back()
	}

	const handleGenerateLink = () => {
		if (test.isDraft) {
			toast.error('Жоба режимінде тестке сілтеме жасау мүмкін емес. Алдымен тестті жариялаңыз.')
			return
		}

		generateTestLink.mutate(
			{ testId: test.id },
			{
				onSuccess: (data) => {
					setGeneratedLink(data.link)
				}
			}
		)
	}

	const handleCopyLink = async () => {
		if (!generatedLink) return

		try {
			await navigator.clipboard.writeText(generatedLink)
			toast.success('Сілтеме буферге көшірілді')
		} catch (error) {
			toast.error('Сілтемені көшіру кезінде қате орын алды')
		}
	}

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
		<div className="space-y-4 mb-6">
			{/* Верхний ряд с кнопкой "Назад" */}
			<div className="flex justify-start">
				<button
					className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
					onClick={handleBack}
				>
					<ArrowLeft size={16} />
					Назад
				</button>
			</div>

			{/* Основные кнопки действий */}
			<div className="flex justify-end gap-3 flex-wrap">
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

				{!test.isDraft && (
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
						onClick={handleGenerateLink}
						disabled={generateTestLink.isPending}
					>
						<Link size={16} />
						{generateTestLink.isPending ? 'Жасалуда...' : 'Сілтеме жасау'}
					</button>
				)}

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
			</div>

			{/* Поле с сгенерированной ссылкой */}
			{generatedLink && (
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<div className="flex items-center justify-between gap-4">
						<div className="flex-1">
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Сілтеме тестке:
							</label>
							<div className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 break-all">
								{generatedLink}
							</div>
						</div>
						<button
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 flex-shrink-0"
							onClick={handleCopyLink}
						>
							<Copy size={16} />
							Көшіру
						</button>
					</div>
				</div>
			)}

			{/* Сообщения об ошибках */}
			{(updateTestMutation.isError || publishTestMutation.isError ||
				exportWithAnswers.isError || exportWithoutAnswers.isError || generateTestLink.isError) && (
					<div className="text-red-500">
						Әрекетті орындау кезінде қате орын алды
					</div>
				)}
		</div>
	)
}

export default TestActionButtons 