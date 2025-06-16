'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useJoinCompetition } from '@/hooks/game/useJoinCompetition'
import { useJoinCompetitionAsGuest } from '@/hooks/game/useJoinCompetitionAsGuest'
import { useAuthStore } from '@/store/auth/authStore'
import { Key, Trophy, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinCompetitionPage() {
	const router = useRouter()
	const { user } = useAuthStore()
	const [formData, setFormData] = useState({
		code: '',
		displayName: user?.name || ''
	})

	const joinCompetition = useJoinCompetition()
	const joinAsGuest = useJoinCompetitionAsGuest()

	const handleJoin = async (asGuest = false) => {
		try {
			const mutation = asGuest ? joinAsGuest : joinCompetition
			const result = await mutation.mutateAsync(formData)

			// Сохраняем participantId в localStorage для восстановления сессии
			localStorage.setItem('participantId', result.participantId)

			router.push(`/competitions/${result.competition.id}/lobby?participantId=${result.participantId}`)
		} catch (error) {
			console.error('Failed to join competition:', error)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-[#7C3AED]/10 rounded-full mb-4">
							<Trophy className="w-8 h-8 text-[#7C3AED]" />
						</div>
						<h1 className="text-2xl font-bold text-gray-800 mb-2">Жарысқа қатысу</h1>
						<p className="text-gray-600">Жарыс кодын енгізіп, қатысыңыз</p>
					</div>

					<div className="space-y-6">
						{/* Competition Code Input */}
						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<Key className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Жарыс коды
							</label>
							<Input
								value={formData.code}
								onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
								placeholder="6 таңбалы кодты енгізіңіз"
								maxLength={6}
								required
								className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						{/* Display Name Input */}
						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<Users className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Көрсетілетін ат
							</label>
							<Input
								value={formData.displayName}
								onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
								placeholder="Атыңызды енгізіңіз"
								required
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						{/* Join Buttons */}
						<div className="space-y-3 pt-4">
							{user ? (
								<Button
									onClick={() => handleJoin(false)}
									className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
									disabled={joinCompetition.isPending || !formData.code || !formData.displayName}
								>
									{joinCompetition.isPending ? (
										<div className="flex items-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Қосылуда...
										</div>
									) : (
										'Пайдаланушы ретінде қатысу'
									)}
								</Button>
							) : null}

							<Button
								onClick={() => handleJoin(true)}
								variant="outline"
								className="w-full h-12 border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
								disabled={joinAsGuest.isPending || !formData.code || !formData.displayName}
							>
								{joinAsGuest.isPending ? (
									<div className="flex items-center">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7C3AED] mr-2"></div>
										Қосылуда...
									</div>
								) : (
									'Қонақ ретінде қатысу'
								)}
							</Button>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500">
						Жарыс кодын ұйымдастырушыдан алыңыз
					</p>
				</div>
			</div>
		</div>
	)
} 