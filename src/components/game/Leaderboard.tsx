'use client'

import { LeaderboardResponse } from '@/types/competition'
import { Award, Medal, Target, Trophy, Users } from 'lucide-react'

interface LeaderboardProps {
	leaderboard: LeaderboardResponse
}

export const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
	const getPositionIcon = (position: number) => {
		switch (position) {
			case 1:
				return <Trophy className="w-6 h-6 text-yellow-500" />
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />
			case 3:
				return <Award className="w-6 h-6 text-amber-600" />
			default:
				return <div className="w-6 h-6 flex items-center justify-center bg-[#7C3AED]/10 rounded-full text-[#7C3AED] font-bold text-sm">#{position}</div>
		}
	}

	const getPositionBg = (position: number) => {
		switch (position) {
			case 1:
				return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
			case 2:
				return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
			case 3:
				return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
			default:
				return 'bg-white/80 backdrop-blur-md border-white/20'
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

	return (
		<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
			{/* Header */}
			<div className="p-6 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white">
				<div className="flex items-center gap-3 mb-2">
					<Trophy className="w-6 h-6" />
					<h2 className="text-xl font-semibold">Көшбасшылар тақтасы</h2>
				</div>
				<p className="text-white/80">
					{leaderboard.competition.testTitle}
				</p>
			</div>

			{/* Teams */}
			<div className="divide-y divide-gray-100">
				{leaderboard.teams.map(team => (
					<div key={team.team.id} className={`p-6 ${getPositionBg(team.position)}`}>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-4">
								{getPositionIcon(team.position)}
								<div className="flex items-center gap-3">
									<div
										className="w-4 h-4 rounded-full ring-2 ring-white shadow-md"
										style={{ backgroundColor: team.team.color }}
									/>
									<span className="font-semibold text-lg text-gray-800">{team.team.name}</span>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="text-right">
									<div className="text-2xl font-bold text-[#7C3AED]">{team.score}</div>
									<div className="text-sm text-gray-600">ұпай</div>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Users className="w-4 h-4 text-[#7C3AED]" />
								<span className="font-medium">Ойыншылар:</span>
								<span>{team.participants.map(p => p.displayName).join(', ')}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<Target className="w-4 h-4 text-green-600" />
								<span className="font-medium">Дұрыс жауаптар:</span>
								<span className="font-semibold text-green-600">
									{team.correctAnswers}/{team.totalQuestions}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
				<div className="flex justify-between items-center text-sm">
					<div className="flex items-center gap-2">
						<Users className="w-4 h-4 text-[#7C3AED]" />
						<span className="text-gray-600">Барлық қатысушылар: <span className="font-semibold">{leaderboard.totalParticipants}</span></span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span className="text-gray-600">Статус: <span className="font-semibold text-[#7C3AED]">{getStatusText(leaderboard.competition.status)}</span></span>
					</div>
				</div>
			</div>
		</div>
	)
}