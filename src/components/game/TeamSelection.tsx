'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { Participant, Team } from '@/types/competition'

interface TeamSelectionProps {
	teams: Team[]
	userParticipant?: Participant
	competitionId: string
	participantId: string
}

export const TeamSelection = ({
	teams,
	userParticipant,
	competitionId,
	participantId
}: TeamSelectionProps) => {
	const { selectTeam } = useGameSocket()

	const handleSelectTeam = (teamId: string) => {
		selectTeam(competitionId, teamId, participantId)
	}

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Select Your Team</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{teams.map(team => (
					<div
						key={team.id}
						className={`border rounded-lg p-4 transition-all ${userParticipant?.teamName === team.name
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300'
							}`}
					>
						<div className="flex items-center justify-between mb-3">
							<h3 className="font-medium">{team.name}</h3>
							<div
								className="w-4 h-4 rounded-full"
								style={{ backgroundColor: team.color }}
							/>
						</div>

						<div className="space-y-2 mb-4">
							<p className="text-sm text-gray-600">
								{team.participantCount} / 4 players
							</p>
							{team.selectedPlayer && (
								<Badge variant="secondary">
									Player: {team.selectedPlayer.displayName}
								</Badge>
							)}
						</div>

						<div className="space-y-2 mb-4">
							{team.participants.map(participant => (
								<div key={participant.id} className="text-sm">
									{participant.displayName}
									{participant.isSelected && (
										<Badge variant="outline" className="ml-2">★</Badge>
									)}
								</div>
							))}
						</div>

						<Button
							onClick={() => handleSelectTeam(team.id)}
							disabled={userParticipant?.teamName === team.name}
							variant={userParticipant?.teamName === team.name ? "default" : "outline"}
							className="w-full"
						>
							{userParticipant?.teamName === team.name ? 'Selected' : 'Join Team'}
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}