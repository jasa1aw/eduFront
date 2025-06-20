'use client'

import { JoinGameForm } from '@/components/game/JoinGameForm'

export default function JoinGame() {
	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-2">Ойынға қосылу</h1>
					<p className="text-gray-600">Қатысу үшін жарыс кодын енгізіңіз</p>
				</div>

				<JoinGameForm />
			</div>
		</div>
	)
}
