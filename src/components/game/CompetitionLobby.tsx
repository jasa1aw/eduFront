'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useAuthStore } from '@/store/auth/authStore'
import { useCompetitionStore } from '@/store/competitionStore'
import { useEffect } from 'react'
import { PlayerSelection } from './PlayerSelection'
import { TeamSelection } from './TeamSelection'

interface CompetitionLobbyProps {
	competitionId: string
	participantId: string
}

export const CompetitionLobby = ({ competitionId, participantId }: CompetitionLobbyProps) => {
	const { competition, isConnected } = useCompetitionStore()
	const { user } = useAuthStore()
	const { joinCompetition, startCompetition } = useGameSocket()

	useEffect(() => {
		if (competitionId && participantId) {
			joinCompetition(competitionId, participantId)
		}
	}, [competitionId, participantId])

	if (!competition) {
		return <div className="flex items-center justify-center h-64">Loading...</div>
	}

	// Получаем всех участников из команд (используем правильную структуру данных)
	const allParticipants = competition.teams?.flatMap(team => team.participants) || []
	const userParticipant = allParticipants.find(p => p.id === participantId)

	// Временная логика определения создателя:
	// 1. Если есть поле isCreator - используем его
	// 2. Если нет участника с данным participantId, но есть доступ к лобби - скорее всего создатель
	// 3. Можно также проверить через localStorage или другие способы
	const isCreator = (competition as any).isCreator ||
		((competition as any).creatorName && user && (competition as any).creatorName === user.name) ||
		(!userParticipant && user) || // Если пользователь не участник, но имеет доступ - вероятно создатель
		// Дополнительная проверка: если в URL есть специальный параметр или роль
		(typeof window !== 'undefined' && window.location.pathname.includes('/dashboard'))

	// Упрощенная логика - если сервер говорит canStart: true и пользователь создатель, то можно запускать
	const canStart = isCreator && competition.canStart


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

			{/* Debug Info - временно для отладки */}
			{isCreator && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<h4 className="font-semibold text-yellow-800 mb-2">Debug Info (Creator Only)</h4>
					<div className="text-sm text-yellow-700 space-y-1">
						<p>• isCreator (calculated): {isCreator ? '✅ true' : '❌ false'}</p>
						<p>• canStart (server): {competition.canStart ? '✅ true' : '❌ false'}</p>
						<p>• status: {competition.status}</p>
						<p>• Final canStart: {canStart ? '✅ true' : '❌ false'}</p>
						<p>• competition.isCreator: {competition.isCreator ? '✅ true' : '❌ false'}</p>
						<p>• creatorName: {competition.creatorName}</p>
						<p>• user.name: {user?.name}</p>
					</div>
				</div>
			)}

			{/* Team Selection */}
			<TeamSelection
				teams={competition.teams}
				userParticipant={userParticipant}
				competitionId={competitionId}
				participantId={participantId}
			/>

			{/* Player Selection */}
			{(userParticipant as any)?.teamInfo && (
				<PlayerSelection
					team={competition.teams.find(t => t.name === (userParticipant as any).teamInfo!.name)!}
					competitionId={competitionId}
					participantId={participantId}
				/>
			)}
			<div className="text-center space-y-4">
				<Button
					onClick={() => startCompetition(competitionId, user?.id || participantId)}
					size="lg"
					className="bg-green-600 hover:bg-green-700"
				>
					Start Competition
				</Button>
			</div>

			{/* Start Button */}
			<div className="text-center space-y-4">
				{/* Временное решение: показываем кнопку всем, если canStart: true */}
				{competition.canStart ? (
					<>
						<Button
							onClick={() => startCompetition(competitionId, user?.id || participantId)}
							size="lg"
							className="bg-green-600 hover:bg-green-700"
						>
							Start Competition
						</Button>

						{!isCreator && (
							<div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
								⚠️ Temporary: Start button shown to all users for debugging
							</div>
						)}
					</>
				) : (
					<>
						<Button
							size="lg"
							className="bg-gray-400 cursor-not-allowed"
							disabled={true}
						>
							Cannot Start Competition
						</Button>

						<div className="text-sm text-gray-600 space-y-1">
							<p>• Server conditions not met (canStart: false)</p>
							<p>• Check if all teams have selected players</p>
						</div>
					</>
				)}

				{/* Показываем статус создателя для отладки */}
				<div className="text-xs text-gray-500">
					Creator status: {isCreator ? '✅ Creator' : '❌ Not Creator'} |
					Can start: {competition.canStart ? '✅ Yes' : '❌ No'}
				</div>
			</div>

			{/* Participants List */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white rounded-lg p-4 border">
					<h3 className="font-semibold mb-3">Participants ({allParticipants.length})</h3>
					<div className="space-y-2">
						{allParticipants.map(participant => (
							<div key={participant.id} className="flex items-center justify-between">
								<span>{participant.displayName}</span>
								<div className="flex items-center gap-2">
									{(participant as any).teamInfo && (
										<Badge style={{ backgroundColor: (participant as any).teamInfo.color }}>
											{(participant as any).teamInfo.name}
										</Badge>
									)}
									{(participant as any).status === 'selected_player' && (
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
							const hasSelectedPlayer = (team as any).hasSelectedPlayer
							const participantCount = (team as any).participantCount
							const isReady = (team as any).isReady

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
											{isReady ? "Ready" : "Empty"}
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