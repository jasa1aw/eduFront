'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGameSocket } from '@/hooks/socket/useGameSocket'
import { TeamChatMessage } from '@/types/competition'
import { useEffect, useRef, useState } from 'react'

interface GameChatProps {
	competitionId: string
	teamId: string
	participantId: string
	messages: TeamChatMessage[]
	onRefresh?: () => void
}

export const GameChat = ({ competitionId, teamId, participantId, messages, onRefresh }: GameChatProps) => {
	const [message, setMessage] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { sendTeamMessage } = useGameSocket()

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault()
		if (!message.trim()) return
		sendTeamMessage(competitionId, teamId, message, participantId)
		setMessage('')
	}

	return (
		<div className="flex flex-col h-[500px] bg-white rounded-lg border">
			{/* Chat Header */}
			<div className="p-4 border-b flex justify-between items-center">
				<h3 className="font-semibold">Топтың чаты ({messages.length})</h3>
				{onRefresh && (
					<Button variant="outline" size="sm" onClick={onRefresh}>
						🔄 Жаңарту
					</Button>
				)}
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="text-center text-gray-500 py-8">
						<p>Ешқандай хабарлама жоқ</p>
						<p className="text-sm">Топпен сөйлесу үшін хабарлама жіберіңіз!</p>
					</div>
				) : (
					messages.map(msg => (
						<div
							key={msg.id}
							className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${msg.isOwn
									? 'bg-blue-500 text-white'
									: 'bg-gray-100'
									}`}
							>
								<div className="text-xs mb-1">
									{msg.participantName}
								</div>
								<div>{msg.message}</div>
								<div className="text-xs mt-1 opacity-70">
									{new Date(msg.timestamp).toLocaleTimeString()}
								</div>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input */}
			<form onSubmit={handleSendMessage} className="p-4 border-t">
				<div className="flex gap-2">
					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Хабарлама енгізіңіз"
						className="flex-1"
					/>
					<Button type="submit">Жіберу</Button>
				</div>
			</form>
		</div>
	)
}