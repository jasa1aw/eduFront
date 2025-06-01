'use client'

import { GameChat } from '@/components/game/GameChat'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useAuthStore } from '@/store/auth/authStore'
import { useGameStore } from '@/store/gameStore'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function GamePage() {
	const router = useRouter()
	const params = useParams()
	const { user } = useAuthStore()
	const { currentGameId, players, setCurrentGameId } = useGameStore()
	const { joinGame, sendGameMessage } = useGameSocket()
	const gameId = params.game as string

	useEffect(() => {
		if (gameId && user) {
			setCurrentGameId(gameId)
			joinGame(gameId)
		}
	}, [gameId, user])

	const handleSendMessage = (message: string) => {
		if (!user || !currentGameId) return
		sendGameMessage(currentGameId, message, user.id)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Players List */}
					<div className="bg-white rounded-lg p-4 border">
						<h2 className="font-semibold mb-4">Players</h2>
						<div className="space-y-2">
							{players.map(player => (
								<div key={player.id} className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-green-500" />
									<span>{player.name}</span>
								</div>
							))}
						</div>
					</div>

					{/* Game Chat */}
					<div className="md:col-span-2">
						<GameChat
							competitionId=""
							teamId=""
							participantId={user?.id || ''}
							messages={[]} // TODO: Implement game chat messages
						/>
					</div>
				</div>
			</div>
		</div>
	)
} 