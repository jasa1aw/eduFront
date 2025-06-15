import { useCompetitionStore } from '@/store/competitionStore'
import { useGameStore } from '@/store/gameStore'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const useGameSocket = () => {
	const socketRef = useRef<Socket | null>(null)
	const submitAnswerCallbackRef = useRef<((response: any) => void) | null>(null)
	const {
		setCompetition,
		setCurrentQuestion,
		addChatMessage,
		setTeamChat,
		setLeaderboard,
		setIsConnected
	} = useCompetitionStore()
	const { setPlayers, setIsConnected: setGameConnected } = useGameStore()

	useEffect(() => {
		// Создаем подключение
		socketRef.current = io(process.env.NEXT_PUBLIC_END_POINT!, {
			withCredentials: true,
		})

		const socket = socketRef.current

		// Базовые события
		socket.on('connect', () => {
			setIsConnected(true)
			setGameConnected(true)
		})

		socket.on('disconnect', () => {
			setIsConnected(false)
			setGameConnected(false)
		})

		// События соревнований
		socket.on('competitionJoined', ({ competition }) => {
			setCompetition(competition)
		})

		socket.on('competitionUpdated', ({ competition }) => {
			setCompetition(competition)
		})

		socket.on('competitionStarted', ({ competition }) => {
			setCompetition(competition)
		})

		socket.on('currentQuestion', ({ question }) => {
			setCurrentQuestion(question)
		})

		socket.on('teamMessage', (message) => {
			addChatMessage(message)
		})

		socket.on('teamChatFull', ({ messages }) => {
			setTeamChat(messages)
		})

		// Альтернативное событие для истории чата
		socket.on('teamChatHistory', (data) => {
			if (data.messages) {
				setTeamChat(data.messages)
			}
		})

		socket.on('leaderboardUpdated', ({ leaderboard }) => {
			setLeaderboard(leaderboard)
		})

		// Обработка ответа на submitAnswer
		socket.on('answerSubmitted', (response) => {
			if (submitAnswerCallbackRef.current) {
				submitAnswerCallbackRef.current(response)
			}
		})

		// События обычных игр
		socket.on('playersUpdated', (players) => {
			setPlayers(players)
		})

		socket.on('newMessage', (message) => {
			// Обработка сообщений в обычных играх
			console.log('New game message:', message)
		})

		// Универсальный обработчик для отладки всех событий
		socket.onAny((eventName, ...args) => {
			if (eventName.toLowerCase().includes('chat') || eventName.toLowerCase().includes('message')) {
				console.log(`Socket event [${eventName}]:`, args)
			}
		})

		// Обработка ошибок
		socket.on('error', ({ message }) => {
			console.error('Socket error:', message)
		})

		return () => {
			socket.disconnect()
		}
	}, [])

	// Методы для отправки событий
	const joinCompetition = (competitionId: string, participantId: string) => {
		socketRef.current?.emit('joinCompetition', { competitionId, participantId })
	}

	const selectTeam = (competitionId: string, teamId: string, participantId: string) => {
		socketRef.current?.emit('selectTeam', { competitionId, teamId, participantId })
	}

	const selectPlayer = (competitionId: string, teamId: string, selectedPlayerId: string) => {
		socketRef.current?.emit('selectPlayer', { competitionId, teamId, selectedPlayerId })
	}

	const startCompetition = (competitionId: string, userId: string) => {
		socketRef.current?.emit('startCompetition', { competitionId, userId })
	}

	const sendTeamMessage = (competitionId: string, teamId: string, message: string, participantId: string) => {
		socketRef.current?.emit('teamChat', { competitionId, teamId, message, participantId })
	}

	const getCurrentQuestion = (participantId: string) => {
		socketRef.current?.emit('getCurrentQuestion', { participantId })
	}

	const submitAnswer = (participantId: string, questionId: string, answerData: any, callback?: (response: any) => void) => {
		if (callback) {
			submitAnswerCallbackRef.current = callback
		}
		socketRef.current?.emit('submitAnswer', { participantId, questionId, ...answerData })
	}

	const getLeaderboard = (competitionId: string) => {
		socketRef.current?.emit('getLeaderboard', { competitionId })
	}

	const getTeamChatFull = (competitionId: string, teamId: string, participantId: string) => {
		console.log('Requesting teamChatFull:', { competitionId, teamId, participantId })
		socketRef.current?.emit('getTeamChatFull', { competitionId, teamId, participantId })
	}

	const joinGame = (gameId: string) => {
		socketRef.current?.emit('joinGame', gameId)
	}

	const sendGameMessage = (gameId: string, message: string, userId: string) => {
		socketRef.current?.emit('sendMessage', { gameId, message, userId })
	}

	return {
		socket: socketRef.current,
		// Competition methods
		joinCompetition,
		selectTeam,
		selectPlayer,
		startCompetition,
		sendTeamMessage,
		getCurrentQuestion,
		submitAnswer,
		getLeaderboard,
		getTeamChatFull,
		// Game methods
		joinGame,
		sendGameMessage,
	}
}