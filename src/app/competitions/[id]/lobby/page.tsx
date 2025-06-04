'use client'

import { CompetitionLobby } from '@/components/game/CompetitionLobby'
import { useCompetitionStore } from '@/store/competitionStore'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function CompetitionLobbyPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()
	const { reset } = useCompetitionStore()
	const competitionId = params.id as string
	const participantId = searchParams.get('participantId')

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

	if (!participantId) {
		return null
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<CompetitionLobby
				competitionId={competitionId}
				participantId={participantId}
			/>
		</div>
	)
}