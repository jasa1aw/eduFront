export interface Competition {
	id: string
	code: string
	title: string
	status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
	maxTeams: number
	testTitle: string
	creatorName: string
	teams: Team[]
	participants: Participant[]
	canStart: boolean
	isCreator: boolean
	userParticipation?: Participant
}

export interface Team {
	id: string
	name: string
	color: string
	participantCount: number
	participants: Participant[]
	selectedPlayer?: Participant
	score: number
	position?: number
}

export interface Participant {
	id: string
	displayName: string
	isGuest: boolean
	isReady: boolean
	teamName?: string
	teamColor?: string
	isSelected: boolean
	joinedAt: string
}

export interface Question {
	id: string
	title: string
	type: 'MULTIPLE_CHOICE' | 'SHORT_ANSWER' | 'TRUE_FALSE'
	options: string[]
	correctAnswers: string[]
	weight: number
}

export interface TeamChatMessage {
	id: string
	participantId: string
	participantName: string
	message: string
	timestamp: string
	isOwn: boolean
}

export interface TeamChatResponse {
	teamId: string
	teamName: string
	teamColor: string
	messages: TeamChatMessage[]
	canSendMessages: boolean
}

export interface LeaderboardTeam {
	position: number
	team: {
		id: string
		name: string
		color: string
	}
	score: number
	participants: Participant[]
	completionTime?: number
	correctAnswers: number
	totalQuestions: number
}

export interface LeaderboardResponse {
	competition: {
		id: string
		title: string
		testTitle: string
		status: string
		startedAt?: string
		endedAt?: string
	}
	teams: LeaderboardTeam[]
	totalParticipants: number
}

export interface CreatorDashboardResponse {
	competition: {
		id: string
		code: string
		title: string
		status: string
		testTitle: string
		maxTeams: number
		canStart: boolean
		totalParticipants: number
		onlineParticipants: number
	}
	teams: CreatorDashboardTeam[]
	unassignedParticipants: CreatorDashboardParticipant[]
	recentActivity: RecentActivity[]
}

export interface CreatorDashboardTeam {
	id: string
	name: string
	color: string
	participantCount: number
	participants: CreatorDashboardParticipant[]
	selectedPlayer?: CreatorDashboardParticipant
	hasSelectedPlayer: boolean
	isReady: boolean
}

export interface CreatorDashboardParticipant {
	id: string
	displayName: string
	isGuest: boolean
	isOnline: boolean
	joinedAt: string
	teamInfo?: {
		id: string
		name: string
		color: string
		isSelected: boolean
	}
	status: 'waiting' | 'in_team' | 'selected_player'
}

export interface RecentActivity {
	type: 'team_selected' | 'participant_joined' | 'participant_left' | 'player_selected'
	participantName: string
	teamName?: string
	timestamp: string
}