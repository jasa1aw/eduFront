'use client'

import { Badge } from '@/components/ui/badge'
import { CreatorDashboardResponse } from '@/types/competition'


interface CreatorDashboardProps {
	dashboard: CreatorDashboardResponse
}

export const CreatorDashboard = ({ dashboard }: CreatorDashboardProps) => {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-lg p-6 border">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-2xl font-bold">{dashboard.competition.title}</h1>
						<p className="text-gray-600">{dashboard.competition.testTitle}</p>
					</div>
					<Badge variant={dashboard.competition.status === 'WAITING' ? 'default' : 'secondary'}>
						{dashboard.competition.status}
					</Badge>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
					<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
						<div className="text-sm text-blue-600 font-medium">Competition Code</div>
						<div className="text-2xl font-bold font-mono text-blue-800">{dashboard.competition.code}</div>
						<div className="text-xs text-blue-500 mt-1">Share with participants</div>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="text-sm text-gray-600">Total Participants</div>
						<div className="text-2xl font-bold">{dashboard.competition.totalParticipants}</div>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="text-sm text-gray-600">Online</div>
						<div className="text-2xl font-bold">{dashboard.competition.onlineParticipants}</div>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="text-sm text-gray-600">Teams</div>
						<div className="text-2xl font-bold">{dashboard.teams.length}</div>
					</div>
					<div className="p-4 bg-gray-50 rounded-lg">
						<div className="text-sm text-gray-600">Ready Teams</div>
						<div className="text-2xl font-bold">
							{dashboard.teams.filter(t => t.isReady).length}
						</div>
					</div>
				</div>
			</div>

			{/* Teams */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{dashboard.teams.map(team => (
					<div key={team.id} className="bg-white rounded-lg p-4 border">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<div
									className="w-4 h-4 rounded-full"
									style={{ backgroundColor: team.color }}
								/>
								<h3 className="font-semibold">{team.name}</h3>
							</div>
							<Badge variant={team.isReady ? "default" : "secondary"}>
								{team.isReady ? 'Ready' : 'Not Ready'}
							</Badge>
						</div>

						<div className="space-y-3">
							{team.participants.map(participant => (
								<div
									key={participant.id}
									className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
								>
									<div className="flex items-center gap-2">
										<span>{participant.displayName}</span>
										{participant.isGuest && (
											<Badge variant="outline">Guest</Badge>
										)}
									</div>
									<Badge
										variant={participant.status === 'selected_player' ? "default" : "secondary"}
									>
										{participant.status === 'selected_player' ? 'Player' : 'Member'}
									</Badge>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Unassigned Participants */}
			{dashboard.unassignedParticipants.length > 0 && (
				<div className="bg-white rounded-lg p-4 border">
					<h3 className="font-semibold mb-4">Waiting to Join Teams</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{dashboard.unassignedParticipants.map(participant => (
							<div
								key={participant.id}
								className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
							>
								<span>{participant.displayName}</span>
								<Badge variant="outline">
									{participant.isGuest ? 'Guest' : 'User'}
								</Badge>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Recent Activity */}
			<div className="bg-white rounded-lg p-4 border">
				<h3 className="font-semibold mb-4">Recent Activity</h3>
				<div className="space-y-2">
					{dashboard.recentActivity.map((activity, index) => (
						<div key={index} className="flex items-center gap-2 text-sm">
							<Badge variant="outline">
								{activity.type.replace('_', ' ')}
							</Badge>
							<span>
								{activity.participantName}
								{activity.teamName && ` joined ${activity.teamName}`}
							</span>
							<span className="text-gray-500">
								{new Date(activity.timestamp).toLocaleTimeString()}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}