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
	}, [reset])

	if (!participantId) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent"></div>
					<p className="text-lg font-medium text-gray-700">Қатысушы жүктелуде...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] py-8">
			<CompetitionLobby
				competitionId={competitionId}
				participantId={participantId}
			/>
		</div>
	)
}