'use client'

import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useCompetitionStore } from '@/store/competitionStore'
import { Key, Trophy, Users, Wifi, WifiOff } from 'lucide-react'
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
	const { joinCompetition } = useGameSocket()
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
		return (
			<div className="flex items-center justify-center h-64 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mx-4">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent mx-auto mb-4"></div>
					<p className="text-lg font-medium text-gray-700">Жүктелуде...</p>
				</div>
			</div>
		)
	}

	// Получаем всех участников из команд (используем правильную структуру данных)
	const allParticipants = competition.teams?.flatMap(team => team.participants) || []
	const userParticipant = allParticipants.find(p => p.id === participantId)

	// Находим команду пользователя правильно
	const userTeam = userParticipant?.teamName ?
		competition.teams.find(t => t.name === userParticipant.teamName) :
		null

	const getStatusText = (status: string) => {
		switch (status) {
			case 'WAITING': return 'Күту'
			case 'IN_PROGRESS': return 'Орындалуда'
			case 'COMPLETED': return 'Аяқталды'
			default: return status
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'WAITING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
			case 'IN_PROGRESS': return 'bg-green-100 text-green-800 border-green-200'
			case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-200'
			default: return 'bg-gray-100 text-gray-800 border-gray-200'
		}
	}

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="text-center space-y-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] rounded-full mb-4">
					<Trophy className="w-8 h-8 text-white" />
				</div>
				<h1 className="text-3xl font-bold text-gray-800">{competition.title}</h1>
				<p className="text-gray-600">Тест: {competition.testTitle}</p>
				<div className="flex items-center justify-center gap-6 flex-wrap">
					<span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(competition.status)}`}>
						{getStatusText(competition.status)}
					</span>
					<div className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED]/10 rounded-full border border-[#7C3AED]/20">
						<Key className="w-4 h-4 text-[#7C3AED]" />
						<span className="text-sm font-mono font-bold text-[#7C3AED]">{competition.code}</span>
					</div>
					<div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
						{isConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
						<span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
							{isConnected ? 'Қосылған' : 'Ажыратылған'}
						</span>
					</div>
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
					<div className="flex items-center gap-3 mb-4">
						<Users className="w-5 h-5 text-[#7C3AED]" />
						<h3 className="font-semibold text-lg text-gray-800">Қатысушылар ({allParticipants.length})</h3>
					</div>
					<div className="space-y-3">
						{allParticipants.map(participant => (
							<div key={participant.id} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200">
								<span className="font-medium text-gray-800">{participant.displayName}</span>
								<div className="flex items-center gap-2">
									{participant.teamName && (
										<span
											className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white border border-white/20"
											style={{ backgroundColor: competition.teams.find(t => t.name === participant.teamName)?.color }}
										>
											{participant.teamName}
										</span>
									)}
									{participant.isSelected && (
										<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
											Ойыншы
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Teams Status */}
				<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
					<div className="flex items-center gap-3 mb-4">
						<Trophy className="w-5 h-5 text-[#7C3AED]" />
						<h3 className="font-semibold text-lg text-gray-800">Команда статусы</h3>
					</div>
					<div className="space-y-3">
						{competition.teams.map(team => {
							const hasSelectedPlayer = team.selectedPlayer != null
							const participantCount = team.participantCount || team.participants.length
							// Команда готова если у неё есть участники и выбранный игрок
							const isReady = participantCount > 0 && hasSelectedPlayer

							return (
								<div key={team.id} className="p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-3">
											<div
												className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
												style={{ backgroundColor: team.color }}
											/>
											<span className="font-medium text-gray-800">{team.name}</span>
											<span className="text-sm text-gray-500">({participantCount})</span>
										</div>
									</div>
									<div className="flex items-center gap-2 flex-wrap">
										<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${isReady
											? 'bg-green-100 text-green-800 border-green-200'
											: 'bg-orange-100 text-orange-800 border-orange-200'
											}`}>
											{isReady ? "Дайын" : "Дайын емес"}
										</span>
										{hasSelectedPlayer && (
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
												Ойыншы таңдалды
											</span>
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