'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useJoinCompetition } from '@/hooks/game/useJoinCompetition'
import { useAuthStore } from '@/store/auth/authStore'
import { Gamepad2, Key, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export const JoinGameForm = () => {
	const router = useRouter()
	const { user } = useAuthStore()
	const [formData, setFormData] = useState({
		code: '',
		displayName: user?.name || '',
	})

	const joinCompetition = useJoinCompetition()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!formData.code.trim()) {
			toast.error('Жарыс кодын көрсету қажет')
			return
		}

		if (!formData.displayName.trim()) {
			toast.error('Көрсетілетін атты көрсету қажет')
			return
		}

		try {
			const result = await joinCompetition.mutateAsync({
				code: formData.code.toUpperCase(),
				displayName: formData.displayName,
			})

			toast.success('Жарысқа сәтті қосылдыңыз!')
			router.push(`/competitions/${result.competition.id}/lobby?participantId=${result.participantId}`)
		} catch (error: any) {
			console.error('Failed to join competition:', error)
			toast.error(error?.response?.data?.message || 'Жарысқа қосылу кезінде қате')
		}
	}

	return (
		<div className="max-w-md mx-auto mt-8">
			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
				<div className="p-6 bg-gradient-to-r from-[#7C3AED]/5 to-[#8B5CF6]/5 border-b border-gray-100">
					<div className="flex items-center gap-3 mb-2">
						<Gamepad2 className="w-6 h-6 text-[#7C3AED]" />
						<h3 className="text-2xl font-semibold text-gray-800">
							Ойынға қосылу
						</h3>
					</div>
					<p className="text-gray-600">
						Командалық ойынға қатысу үшін жарыс кодын енгізіңіз
					</p>
				</div>
				<div className="p-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="code" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
								<Key className="w-4 h-4 text-[#7C3AED]" />
								Жарыс коды *
							</Label>
							<Input
								id="code"
								value={formData.code}
								onChange={(e) => setFormData(prev => ({
									...prev,
									code: e.target.value.toUpperCase()
								}))}
								placeholder="6 таңбалы кодты енгізіңіз"
								maxLength={6}
								className="h-12 text-center text-lg font-mono tracking-widest border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg uppercase"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="displayName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
								<User className="w-4 h-4 text-[#7C3AED]" />
								Көрсетілетін ат *
							</Label>
							<Input
								id="displayName"
								value={formData.displayName}
								onChange={(e) => setFormData(prev => ({
									...prev,
									displayName: e.target.value
								}))}
								placeholder="Ойындағы атыңыз"
								required
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						<Button
							type="submit"
							className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
							disabled={joinCompetition.isPending || !formData.code || !formData.displayName}
						>
							{joinCompetition.isPending ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Қосылуда...
								</div>
							) : (
								'Ойынға қосылу'
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
} 