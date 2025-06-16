'use client'

import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { Team } from '@/types/competition'
import { Crown, User, UserCheck } from 'lucide-react'

interface PlayerSelectionProps {
	team: Team
	competitionId: string
	// participantId: string
}

export const PlayerSelection = ({ team, competitionId }: PlayerSelectionProps) => {
	const { selectPlayer } = useGameSocket()

	const handleSelectPlayer = (selectedPlayerId: string) => {
		selectPlayer(competitionId, team.id, selectedPlayerId)
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<Crown className="w-6 h-6 text-[#7C3AED]" />
				<h2 className="text-xl font-semibold text-gray-800">Команда ойыншысын таңдаңыз</h2>
			</div>

			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div
							className="w-5 h-5 rounded-full ring-2 ring-white shadow-sm"
							style={{ backgroundColor: team.color }}
						/>
						<h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
					</div>
				</div>

				<div className="space-y-3">
					{team.participants.map(participant => (
						<div
							key={participant.id}
							className={`p-4 rounded-xl border-2 transition-all duration-300 ${team.selectedPlayer?.id === participant.id
								? 'border-[#7C3AED] bg-gradient-to-r from-[#7C3AED]/5 to-[#8B5CF6]/5 shadow-md'
								: 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
								}`}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<User className="w-5 h-5 text-gray-600" />
									<span className="font-medium text-gray-800">{participant.displayName}</span>
									{participant.isGuest && (
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
											Қонақ
										</span>
									)}
								</div>

								<Button
									onClick={() => handleSelectPlayer(participant.id)}
									disabled={team.selectedPlayer?.id === participant.id}
									variant={team.selectedPlayer?.id === participant.id ? "default" : "outline"}
									size="sm"
									className={`${team.selectedPlayer?.id === participant.id
										? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
										: 'border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white'
										} transition-all duration-300`}
								>
									{team.selectedPlayer?.id === participant.id ? (
										<div className="flex items-center gap-2">
											<UserCheck className="w-4 h-4" />
											Таңдалды
										</div>
									) : (
										'Таңдау'
									)}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}