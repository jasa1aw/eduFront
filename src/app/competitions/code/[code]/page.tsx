'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJoinCompetition } from '@/hooks/game/useJoinCompetition'
import { useJoinCompetitionAsGuest } from '@/hooks/game/useJoinCompetitionAsGuest'
import { useAuthStore } from '@/store/auth/authStore'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinByCodePage() {
	const router = useRouter()
	const params = useParams()
	const { user } = useAuthStore()
	const [displayName, setDisplayName] = useState(user?.name || '')
	const code = params.code as string

	const joinCompetition = useJoinCompetition()
	const joinAsGuest = useJoinCompetitionAsGuest()

	const handleJoin = async (asGuest = false) => {
		try {
			const mutation = asGuest ? joinAsGuest : joinCompetition
			const result = await mutation.mutateAsync({
				code,
				displayName
			})

			localStorage.setItem('participantId', result.participantId)
			router.push(`/competitions/${result.competition.id}/lobby?participantId=${result.participantId}`)
		} catch (error) {
			console.error('Failed to join competition:', error)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="max-w-md w-full p-6 bg-white rounded-lg border">
				<h1 className="text-2xl font-bold mb-6">Join Competition</h1>
				<p className="text-gray-600 mb-4">Competition Code: <span className="font-mono font-bold">{code}</span></p>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">Display Name</label>
						<Input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="Enter your display name"
							required
						/>
					</div>

					<div className="space-y-2">
						{user ? (
							<Button
								onClick={() => handleJoin(false)}
								className="w-full"
								disabled={joinCompetition.isPending || !displayName.trim()}
							>
								{joinCompetition.isPending ? 'Joining...' : 'Join as User'}
							</Button>
						) : null}

						<Button
							onClick={() => handleJoin(true)}
							variant="outline"
							className="w-full"
							disabled={joinAsGuest.isPending || !displayName.trim()}
						>
							{joinAsGuest.isPending ? 'Joining...' : 'Join as Guest'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
} 