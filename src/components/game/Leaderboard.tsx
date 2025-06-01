'use client'

import { Badge } from '@/components/ui/badge'
import { LeaderboardResponse } from '@/types/competition'

interface LeaderboardProps {
	leaderboard: LeaderboardResponse
}

export const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
	return (
		<div className="bg-white rounded-lg border">
			{/* Header */}
			<div className="p-4 border-b">
				<h2 className="text-xl font-semibold">Leaderboard</h2>
				<p className="text-sm text-gray-600">
					{leaderboard.competition.testTitle}
				</p>
			</div>

			{/* Teams */}
			<div className="divide-y">
				{leaderboard.teams.map(team => (
					<div key={team.team.id} className="p-4">
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-3">
								<span className="text-lg font-medium">
									#{team.position}
								</span>
								<div
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: team.team.color }}
								/>
								<span className="font-medium">{team.team.name}</span>
							</div>
							<Badge variant="secondary">
								{team.score} points
							</Badge>
						</div>

						<div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
							<div>
								<span className="font-medium">Players:</span>{' '}
								{team.participants.map(p => p.displayName).join(', ')}
							</div>
							<div>
								<span className="font-medium">Correct:</span>{' '}
								{team.correctAnswers}/{team.totalQuestions}
							</div>
							{team.completionTime && (
								<div>
									<span className="font-medium">Time:</span>{' '}
									{team.completionTime} minutes
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Footer */}
			<div className="p-4 border-t bg-gray-50">
				<div className="flex justify-between text-sm">
					<span>Total Participants: {leaderboard.totalParticipants}</span>
					<span>Status: {leaderboard.competition.status}</span>
				</div>
			</div>
		</div>
	)
}