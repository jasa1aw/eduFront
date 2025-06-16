"use client"

import { Button } from "@/components/ui/button"
import { useTestHistoryDetail } from "@/hooks/test/useTestHistoryDetail"
import { useAttepmtExport } from "@/hooks/test/useTestExport"
import { ArrowLeft, Award, Calendar, CheckCircle, Clock, Download, PlayCircle, XCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function TestHistoryDetailPage() {
	const params = useParams()
	const router = useRouter()
	const attemptId = params.attemptId as string

	const { exportAttempt } = useAttepmtExport(attemptId)

	// Получаем детальную информацию о попытке
	const { data: currentAttempt, isPending, isError} = useTestHistoryDetail(attemptId)

	const handleExportPDF = async () => {
		try {
			const blob = await exportAttempt.mutateAsync()
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = `нәтижелер-${currentAttempt?.testTitle || 'тест'}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Failed to export test results:', error)
		}
	}

	const handleBack = () => {
		router.push('/teacher/test-history')
	}

	const getStatusIcon = () => {
		if (!currentAttempt) return null
		switch (currentAttempt.status) {
			case 'COMPLETED':
				return <CheckCircle className="w-6 h-6 text-green-600" />
			case 'FAILED':
				return <XCircle className="w-6 h-6 text-red-600" />
			case 'IN_PROGRESS':
				return <PlayCircle className="w-6 h-6 text-blue-600" />
			default:
				return <Clock className="w-6 h-6 text-gray-600" />
		}
	}

	const getStatusText = () => {
		if (!currentAttempt) return 'Белгісіз'
		switch (currentAttempt.status) {
			case 'COMPLETED':
				return 'Аяқталған'
			case 'FAILED':
				return 'Өтілмеген'
			case 'IN_PROGRESS':
				return 'Жүргізіліп жатыр'
			default:
				return 'Белгісіз'
		}
	}

	const getModeText = () => {
		return currentAttempt?.mode === 'EXAM' ? 'Емтихан' : 'Тәжірибе'
	}

	const getModeColor = () => {
		return currentAttempt?.mode === 'EXAM' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const formatDuration = (durationInSeconds: number) => {
		const minutes = Math.floor(durationInSeconds / 60)
		const seconds = durationInSeconds % 60
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	if (isPending) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg text-gray-600">Деректерді жүктеу...</span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isError || !currentAttempt) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-4xl mx-auto">
					<div className="flex items-center justify-center py-16">
						<div className="text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<XCircle className="w-8 h-8 text-red-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Жүктеуде қателік туындады</h3>
							<p className="text-gray-600 mb-4">Әрекет деректерін жүктеу мүмкін болмады</p>
							<Button onClick={handleBack} variant="outline">
								Тесттер тарихына қайту
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Button
						onClick={handleBack}
						variant="outline"
						className="flex items-center gap-2 mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Артқа
					</Button>

					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
						<div className="flex items-start justify-between mb-6">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">{currentAttempt.testTitle}</h1>
								<div className="flex items-center gap-2">
									{getStatusIcon()}
									<span className="text-lg text-gray-600">{getStatusText()}</span>
								</div>
							</div>

							<div className="flex flex-col items-end gap-3">
								<div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium border ${getModeColor()}`}>
									{getModeText()}
								</div>
								{currentAttempt.status === 'COMPLETED' && (
									<div className="text-4xl font-bold text-blue-600">
										{currentAttempt.score}%
									</div>
								)}
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
										<Calendar className="w-6 h-6 text-blue-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Басталу күні</p>
										<p className="text-lg font-semibold text-gray-900">{formatDate(currentAttempt.startTime)}</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
										<Clock className="w-6 h-6 text-purple-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Уақыт жұмсалды</p>
										<p className="text-lg font-semibold text-gray-900">
											{currentAttempt.status === 'COMPLETED' && currentAttempt.endTime
												? formatDuration(currentAttempt.duration)
												: 'Жүргізіліп жатыр'}
										</p>
									</div>
								</div>
							</div>

							<div className="bg-gray-50 rounded-xl p-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
										<Award className="w-6 h-6 text-green-600" />
									</div>
									<div>
										<p className="text-sm text-gray-500">Уақыт шектеулігі</p>
										<p className="text-lg font-semibold text-gray-900">{currentAttempt.timeLimit} мин</p>
									</div>
								</div>
							</div>

							{currentAttempt.status === 'COMPLETED' && currentAttempt.endTime && (
								<div className="bg-gray-50 rounded-xl p-6">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
											<CheckCircle className="w-6 h-6 text-orange-600" />
										</div>
										<div>
											<p className="text-sm text-gray-500">Аяқталу күні</p>
											<p className="text-lg font-semibold text-gray-900">{formatDate(currentAttempt.endTime)}</p>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Action buttons */}
				{currentAttempt.status === 'COMPLETED' && (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
						<h2 className="text-xl font-bold text-gray-900 mb-4">Әрекеттер</h2>
						<div className="flex gap-4">
							<Button
								onClick={handleExportPDF}
								disabled={exportAttempt.isPending}
								className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
							>
								{exportAttempt.isPending ? (
									<>
										<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
										<span>Экспорт...</span>
									</>
								) : (
									<>
										<Download className="w-4 h-4" />
										<span>PDF нәтижесін жүктеп алу</span>
									</>
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
} 