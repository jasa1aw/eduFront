'use client'

import { Button } from '@/components/ui/button'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { useAuthStore } from '@/store/auth/authStore'
import { CreatorDashboardResponse } from '@/types/competition'
import { Clock, Key, Play, Trophy, Users } from 'lucide-react'

interface CreatorDashboardProps {
	dashboard: CreatorDashboardResponse
}

export const CreatorDashboard = ({ dashboard }: CreatorDashboardProps) => {
	const { startCompetition } = useGameSocket()
	const { user } = useAuthStore()

	const handleStartCompetition = () => {
		if (user && dashboard.competition.canStart) {
			startCompetition(dashboard.competition.id, user.id)
		}
	}

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
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">{dashboard.competition.title}</h1>
						<p className="text-gray-600 mt-1">{dashboard.competition.testTitle}</p>
					</div>
					<div className="flex items-center gap-4">
						<span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(dashboard.competition.status)}`}>
							{getStatusText(dashboard.competition.status)}
						</span>
						{dashboard.competition.status === 'WAITING' && (
							<Button
								onClick={handleStartCompetition}
								disabled={!dashboard.competition.canStart}
								size="lg"
								className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
							>
								<Play className="w-4 h-4 mr-2" />
								{dashboard.competition.canStart ? 'Жарысты бастау' : 'Командалар дайын емес'}
							</Button>
						)}
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<div className="p-4 bg-gradient-to-br from-[#7C3AED]/10 to-[#8B5CF6]/10 rounded-xl border border-[#7C3AED]/20">
						<div className="flex items-center justify-between mb-2">
							<div className="text-sm text-[#7C3AED] font-medium">Жарыс коды</div>
							<Key className="w-4 h-4 text-[#7C3AED]" />
						</div>
						<div className="text-2xl font-bold font-mono text-[#7C3AED]">{dashboard.competition.code}</div>
						<div className="text-xs text-[#7C3AED]/70 mt-1">Қатысушылармен бөлісіңіз</div>
					</div>
					<div className="p-4 bg-gradient-to-br from-[#465FF1]/10 to-[#7C3AED]/10 rounded-xl border border-[#465FF1]/20">
						<div className="flex items-center justify-between mb-2">
							<div className="text-sm text-[#465FF1] font-medium">Барлық қатысушылар</div>
							<Users className="w-4 h-4 text-[#465FF1]" />
						</div>
						<div className="text-2xl font-bold text-[#465FF1]">{dashboard.competition.totalParticipants}</div>
					</div>
					<div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl border border-green-200">
						<div className="flex items-center justify-between mb-2">
							<div className="text-sm text-green-700 font-medium">Онлайн</div>
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						</div>
						<div className="text-2xl font-bold text-green-700">{dashboard.competition.onlineParticipants}</div>
					</div>
					<div className="p-4 bg-gradient-to-br from-[#8B5CF6]/10 to-[#A78BFA]/10 rounded-xl border border-[#8B5CF6]/20">
						<div className="flex items-center justify-between mb-2">
							<div className="text-sm text-[#8B5CF6] font-medium">Командалар</div>
							<Trophy className="w-4 h-4 text-[#8B5CF6]" />
						</div>
						<div className="text-2xl font-bold text-[#8B5CF6]">{dashboard.teams.length}</div>
					</div>
					<div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl border border-emerald-200">
						<div className="flex items-center justify-between mb-2">
							<div className="text-sm text-emerald-700 font-medium">Дайын командалар</div>
							<Clock className="w-4 h-4 text-emerald-700" />
						</div>
						<div className="text-2xl font-bold text-emerald-700">
							{dashboard.teams.filter(t => t.isReady).length}
						</div>
					</div>
				</div>
			</div>

			{/* Teams */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold text-gray-800">Командалар</h2>
				{dashboard.teams.map(team => (
					<div key={team.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<div
									className="w-5 h-5 rounded-full ring-2 ring-white shadow-md"
									style={{ backgroundColor: team.color }}
								/>
								<h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
							</div>
							<span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${team.isReady ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
								{team.isReady ? 'Дайын' : 'Дайын емес'}
							</span>
						</div>

						<div className="space-y-3">
							{team.participants.map(participant => (
								<div
									key={participant.id}
									className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200"
								>
									<div className="flex items-center gap-3">
										<span className="font-medium text-gray-800">{participant.displayName}</span>
										{participant.isGuest && (
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
												Қонақ
											</span>
										)}
									</div>
									<span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${participant.status === 'selected_player'
										? 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20'
										: 'bg-gray-100 text-gray-600 border-gray-200'
										}`}>
										{participant.status === 'selected_player' ? 'Ойыншы' : 'Мүше'}
									</span>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Unassigned Participants */}
			{dashboard.unassignedParticipants.length > 0 && (
				<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
					<h3 className="font-semibold text-lg text-gray-800 mb-4">Командаға қосылуды күтуде</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{dashboard.unassignedParticipants.map(participant => (
							<div
								key={participant.id}
								className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
							>
								<span className="font-medium text-gray-800">{participant.displayName}</span>
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
									{participant.isGuest ? 'Қонақ' : 'Пайдаланушы'}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Recent Activity */}
			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
				<h3 className="font-semibold text-lg text-gray-800 mb-4">Соңғы әрекеттер</h3>
				<div className="space-y-3">
					{dashboard.recentActivity.map((activity, index) => (
						<div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200">
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20">
								{activity.type.replace('_', ' ')}
							</span>
							<span className="font-medium text-gray-800">
								{activity.participantName}
								{activity.teamName && ` ${activity.teamName} командасына қосылды`}
							</span>
							<span className="text-sm text-gray-500 ml-auto">
								{new Date(activity.timestamp).toLocaleTimeString()}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}