import { Competition, LeaderboardResponse, Question, TeamChatMessage } from '@/types/competition'
import { create } from 'zustand'

interface CompetitionState {
	// Current competition data
	competition: Competition | null
	participantId: string | null
	currentQuestion: Question | null
	teamChat: TeamChatMessage[]
	leaderboard: LeaderboardResponse | null

	// UI states
	isConnected: boolean
	isLoading: boolean
	error: string | null

	// Actions
	setCompetition: (competition: Competition | null) => void
	setParticipantId: (id: string | null) => void
	setCurrentQuestion: (question: Question | null) => void
	setTeamChat: (messages: TeamChatMessage[]) => void
	addChatMessage: (message: TeamChatMessage) => void
	setLeaderboard: (leaderboard: LeaderboardResponse | null) => void
	setIsConnected: (connected: boolean) => void
	setIsLoading: (loading: boolean) => void
	setError: (error: string | null) => void

	// Reset
	reset: () => void
}

export const useCompetitionStore = create<CompetitionState>((set) => ({
	competition: null,
	participantId: null,
	currentQuestion: null,
	teamChat: [],
	leaderboard: null,
	isConnected: false,
	isLoading: false,
	error: null,

	setCompetition: (competition) => set({ competition }),
	setParticipantId: (id) => set({ participantId: id }),
	setCurrentQuestion: (question) => set({ currentQuestion: question }),
	setTeamChat: (messages) => {
		console.log('Setting team chat:', messages)
		set({ teamChat: messages })
	},
	addChatMessage: (message) => {
		console.log('Adding chat message:', message)
		set((state) => ({
			teamChat: [...state.teamChat, message]
		}))
	},
	setLeaderboard: (leaderboard) => set({ leaderboard }),
	setIsConnected: (connected) => set({ isConnected: connected }),
	setIsLoading: (loading) => set({ isLoading: loading }),
	setError: (error) => set({ error }),

	reset: () => set({
		competition: null,
		participantId: null,
		currentQuestion: null,
		teamChat: [],
		leaderboard: null,
		isConnected: false,
		isLoading: false,
		error: null,
	}),
}))