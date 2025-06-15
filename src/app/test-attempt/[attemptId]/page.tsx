'use client'
import ExamModeTest from '@/components/ExamModeTest'
import PracticeTestRunner from '@/components/PracticeTestRunner'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'


export default function TestAttemptPage({ params }: { params: { attemptId: string } }) {
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
		return (
			<div className="flex items-center justify-center h-full">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		)
	}

	// Render appropriate component based on mode
	if (attemptData.mode === 'EXAM') {
		return <ExamModeTest attemptId={params.attemptId} />
	} else {
		return <PracticeTestRunner attemptId={params.attemptId} />
	}
} 