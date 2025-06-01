'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJoinCompetition } from '@/hooks/game/useJoinCompetition'
import { useJoinCompetitionAsGuest } from '@/hooks/game/useJoinCompetitionAsGuest'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinCompetitionPage() {
	const router = useRouter()
	const { user } = useAuthStore()
	const [formData, setFormData] = useState({
		code: '',
		displayName: user?.name || ''
	})

	const joinCompetition = useJoinCompetition()
	const joinAsGuest = useJoinCompetitionAsGuest()

	const handleJoin = async (asGuest = false) => {
		try {
			const mutation = asGuest ? joinAsGuest : joinCompetition
			const result = await mutation.mutateAsync(formData)

			// Сохраняем participantId в localStorage для восстановления сессии
			localStorage.setItem('participantId', result.participantId)

			router.push(`/competitions/${result.competition.id}/lobby?participantId=${result.participantId}`)
		} catch (error) {
			console.error('Failed to join competition:', error)
		}
	}

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg border">
			<h1 className="text-2xl font-bold mb-6">Join Competition</h1>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Competition Code</label>
					<Input
						value={formData.code}
						onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
						placeholder="Enter 6-digit code"
						maxLength={6}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Display Name</label>
					<Input
						value={formData.displayName}
						onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
						required
					/>
				</div>

				<div className="space-y-2">
					{user ? (
						<Button
							onClick={() => handleJoin(false)}
							className="w-full"
							disabled={joinCompetition.isPending}
						>
							{joinCompetition.isPending ? 'Joining...' : 'Join as User'}
						</Button>
					) : null}

					<Button
						onClick={() => handleJoin(true)}
						variant="outline"
						className="w-full"
						disabled={joinAsGuest.isPending}
					>
						{joinAsGuest.isPending ? 'Joining...' : 'Join as Guest'}
					</Button>
				</div>
			</div>
		</div>
	)
} 