'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { Team } from '@/types/competition'

interface PlayerSelectionProps {
	team: Team
	competitionId: string
	participantId: string
}

export const PlayerSelection = ({ team, competitionId, participantId }: PlayerSelectionProps) => {
	const { selectPlayer } = useGameSocket()

	const handleSelectPlayer = (selectedPlayerId: string) => {
		selectPlayer(competitionId, team.id, selectedPlayerId)
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Select Team Player</h2>
			<div className="bg-white rounded-lg p-4 border">
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-medium">{team.name}</h3>
					<div
						className="w-4 h-4 rounded-full"
						style={{ backgroundColor: team.color }}
					/>
				</div>

				<div className="space-y-3">
					{team.participants.map(participant => (
						<div
							key={participant.id}
							className={`flex items-center justify-between p-3 rounded-lg border ${team.selectedPlayer?.id === participant.id
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200'
								}`}
						>
							<div className="flex items-center gap-3">
								<span>{participant.displayName}</span>
								{participant.isGuest && (
									<Badge variant="outline">Guest</Badge>
								)}
							</div>

							<Button
								onClick={() => handleSelectPlayer(participant.id)}
								disabled={team.selectedPlayer?.id === participant.id}
								variant={team.selectedPlayer?.id === participant.id ? "default" : "outline"}
								size="sm"
							>
								{team.selectedPlayer?.id === participant.id ? 'Selected' : 'Select'}
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}