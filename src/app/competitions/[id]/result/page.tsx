'use client'

import { Leaderboard } from '@/components/game/Leaderboard'
import { useGetLeaderboard } from '@/hooks/game/useGetLeaderboard'
import { useCompetitionStore } from '@/store/competitionStore'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionResultsPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()
	const { competition, reset } = useCompetitionStore()
	const competitionId = params.id as string
	const participantId = searchParams.get('participantId')

	const { data: leaderboard, isLoading } = useGetLeaderboard(competitionId)

	useEffect(() => {
		if (!participantId) {
			router.push('/competitions/join')
		}
	}, [participantId, router])

	useEffect(() => {
		return () => {
			reset()
		}
	}, [])

	if (!participantId || isLoading || !leaderboard) {
		return <div>Loading...</div>
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">{competition?.title}</h1>
					<p className="text-gray-600">Competition Results</p>
				</div>

				<Leaderboard leaderboard={leaderboard} />
			</div>
		</div>
	)
}