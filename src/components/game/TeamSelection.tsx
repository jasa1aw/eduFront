'use client'

import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { Participant, Team } from '@/types/competition'
import { Crown, Star, UserCheck, Users } from 'lucide-react'

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
			<div className="flex items-center gap-3">
				<Users className="w-6 h-6 text-[#7C3AED]" />
				<h2 className="text-xl font-semibold text-gray-800">Командаңызды таңдаңыз</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{teams.map(team => (
					<div
						key={team.id}
						className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border-2 p-6 transition-all duration-300 hover:shadow-xl ${userParticipant?.teamName === team.name
							? 'border-[#7C3AED] bg-gradient-to-br from-[#7C3AED]/5 to-[#8B5CF6]/5 scale-105'
							: 'border-gray-200 hover:border-[#7C3AED]/30'
							}`}
					>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div
									className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm"
									style={{ backgroundColor: team.color }}
								/>
								<h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
							</div>
							{userParticipant?.teamName === team.name && (
								<UserCheck className="w-5 h-5 text-[#7C3AED]" />
							)}
						</div>

						<div className="space-y-3 mb-4">
							<p className="text-sm text-gray-600 flex items-center gap-2">
								<Users className="w-4 h-4" />
								{team.participantCount} / 4 ойыншы
							</p>
							{team.selectedPlayer && (
								<div className="flex items-center gap-2">
									<Crown className="w-4 h-4 text-[#7C3AED]" />
									<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
										Ойыншы: {team.selectedPlayer.displayName}
									</span>
								</div>
							)}
						</div>

						<div className="space-y-2 mb-4 min-h-[100px]">
							<p className="text-sm font-medium text-gray-700">Команда мүшелері:</p>
							{team.participants.length > 0 ? (
								team.participants.map(participant => (
									<div key={participant.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2">
										<span className="text-gray-800">{participant.displayName}</span>
										{participant.isSelected && (
											<Star className="w-4 h-4 text-yellow-500 fill-current" />
										)}
									</div>
								))
							) : (
								<p className="text-sm text-gray-500 italic">Мүшелер жоқ</p>
							)}
						</div>

						<Button
							onClick={() => handleSelectTeam(team.id)}
							disabled={userParticipant?.teamName === team.name}
							variant={userParticipant?.teamName === team.name ? "default" : "outline"}
							className={`w-full transition-all duration-300 ${userParticipant?.teamName === team.name
								? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
								: 'border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white'
								}`}
						>
							{userParticipant?.teamName === team.name ? 'Таңдалды' : 'Командаға қосылу'}
						</Button>
					</div>
				))}
			</div>
		</div>
	)
}