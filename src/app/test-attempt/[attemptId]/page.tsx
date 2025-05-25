'use client'
import ExamModeTest from '@/components/ExamModeTest'
import PracticeTestRunner from '@/components/PracticeTestRunner'
import { useQueryClient } from '@tanstack/react-query'

function Loader() {
	return <div className="min-h-screen flex items-center justify-center text-2xl">Загрузка...</div>
}

export default function Page({ params }: { params: { attemptId: string } }) {
	const queryClient = useQueryClient()

	// Get attempt data from cache to determine mode
	const attemptData = queryClient.getQueryData(['test-attempt', params.attemptId]) as {
		attemptId: string
		mode: "PRACTICE" | "EXAM"
		firstQuestionId: string
		timeLimit?: number
	} | undefined

	// Show loader if no attempt data is available yet
	if (!attemptData) {
		return <Loader />
	}

	// Render appropriate component based on mode
	if (attemptData.mode === 'EXAM') {
		return <ExamModeTest attemptId={params.attemptId} />
	} else {
		return <PracticeTestRunner attemptId={params.attemptId} />
	}
} 