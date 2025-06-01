'use client'

import { CreatorDashboard } from '@/components/game/CreatorDashboard'
import { useGetCreatorDashboard } from '@/hooks/game/useGetCreatorDashboard'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionDashboardPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()
	const { competition, reset } = useCompetitionStore()
	const { user } = useAuthStore()
	const competitionId = params.id as string

	const { data: dashboard, isLoading } = useGetCreatorDashboard(competitionId)

	useEffect(() => {
		if (!user) {
			router.push('/sign-in')
		}
	}, [user])

	useEffect(() => {
		return () => {
			reset()
		}
	}, [])

	if (!user || isLoading || !dashboard) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4">
				<CreatorDashboard dashboard={dashboard} />
			</div>
		</div>
	)
}