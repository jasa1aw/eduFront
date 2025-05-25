'use client'
import PracticeTestRunner from '@/components/PracticeTestRunner'

export default function Page({ params }: { params: { attemptId: string } }) {
	return <PracticeTestRunner attemptId={params.attemptId} />
} 