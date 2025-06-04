export interface Player {
	id: string
	name: string
	email: string
}

export interface GameRoom {
	id: string
	creatorId: string
	isPublic: boolean
	players: Player[]
	creator: Player
}