import { create } from 'zustand'
import { Player } from '@/types/game'

interface GameState {
	currentGameId: string | null
	players: Player[]
	isConnected: boolean

	setCurrentGameId: (gameId: string | null) => void
	setPlayers: (players: Player[]) => void
	setIsConnected: (connected: boolean) => void
	addPlayer: (player: Player) => void
	removePlayer: (playerId: string) => void
}

export const useGameStore = create<GameState>((set) => ({
	currentGameId: null,
	players: [],
	isConnected: false,

	setCurrentGameId: (gameId) => set({ currentGameId: gameId }),
	setPlayers: (players) => set({ players }),
	setIsConnected: (connected) => set({ isConnected: connected }),
	addPlayer: (player) => set((state) => ({
		players: [...state.players, player]
	})),
	removePlayer: (playerId) => set((state) => ({
		players: state.players.filter(p => p.id !== playerId)
	})),
}))