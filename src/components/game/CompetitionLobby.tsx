'use client'

import { Badge } from '@/components/ui/badge'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useCompetitionStore } from '@/store/competitionStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { PlayerSelection } from './PlayerSelection'
import { TeamSelection } from './TeamSelection'

interface CompetitionLobbyProps {
	competitionId: string
	participantId: string
}

export const CompetitionLobby = ({ competitionId, participantId }: CompetitionLobbyProps) => {
	const { competition, isConnected } = useCompetitionStore()
	const { joinCompetition} = useGameSocket()
	const router = useRouter()

	useEffect(() => {
		if (competitionId && participantId) {
			joinCompetition(competitionId, participantId)
		}
	}, [competitionId, participantId])

	// Автоматическое перенаправление на страницу игры когда соревнование начинается
	useEffect(() => {
		if (competition?.status === 'IN_PROGRESS') {
			router.push(`/competitions/${competitionId}/game?participantId=${participantId}`)
		}
	}, [competition?.status, competitionId, participantId, router])

	if (!competition) {
		return <div className="flex items-center justify-center h-64">Loading...</div>
	}

	// Получаем всех участников из команд (используем правильную структуру данных)
	const allParticipants = competition.teams?.flatMap(team => team.participants) || []
	const userParticipant = allParticipants.find(p => p.id === participantId)

		// Находим команду пользователя правильно
	const userTeam = userParticipant?.teamName ?
		competition.teams.find(t => t.name === userParticipant.teamName) :
		null

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold">{competition.title}</h1>
				<p className="text-gray-600">Test: {competition.testTitle}</p>
				<div className="flex items-center justify-center gap-4">
					<Badge variant={competition.status === 'WAITING' ? 'default' : 'secondary'}>
						{competition.status}
					</Badge>
					<span className="text-sm text-gray-500">Code: {competition.code}</span>
					<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
				</div>
			</div>

			{/* Team Selection */}
			<TeamSelection
				teams={competition.teams}
				userParticipant={userParticipant}
				competitionId={competitionId}
				participantId={participantId}
			/>

			{/* Player Selection - показываем если пользователь в команде */}
			{userTeam && (
				<PlayerSelection
					team={userTeam}
					competitionId={competitionId}
					// participantId={participantId}
				/>
			)}

			{/* Participants List */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white rounded-lg p-4 border">
					<h3 className="font-semibold mb-3">Participants ({allParticipants.length})</h3>
					<div className="space-y-2">
						{allParticipants.map(participant => (
							<div key={participant.id} className="flex items-center justify-between">
								<span>{participant.displayName}</span>
								<div className="flex items-center gap-2">
									{participant.teamName && (
										<Badge style={{
											backgroundColor: competition.teams.find(t => t.name === participant.teamName)?.color
										}}>
											{participant.teamName}
										</Badge>
									)}
									{participant.isSelected && (
										<Badge variant="secondary">Player</Badge>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Teams Status */}
				<div className="bg-white rounded-lg p-4 border">
					<h3 className="font-semibold mb-3">Teams Status</h3>
					<div className="space-y-2">
						{competition.teams.map(team => {
							const hasSelectedPlayer = team.selectedPlayer != null
							const participantCount = team.participantCount || team.participants.length
							// Команда готова если у неё есть участники и выбранный игрок
							const isReady = participantCount > 0 && hasSelectedPlayer

							return (
								<div key={team.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: team.color }}
										/>
										<span>{team.name}</span>
										<span className="text-sm text-gray-500">({participantCount})</span>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={isReady ? "default" : "secondary"}>
											{isReady ? "Ready" : "Not Ready"}
										</Badge>
										{hasSelectedPlayer && (
											<Badge variant="outline" className="text-xs">
												Player Selected
											</Badge>
										)}
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}