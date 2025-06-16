'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCompetition } from '@/hooks/game/useCreateCompetition'
import { FileText, Hash, Trophy, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateCompetitionPage() {
	const router = useRouter()
	const [formData, setFormData] = useState({
		testId: '',
		title: '',
		maxTeams: 2,
		description: ''
	})

	const createCompetition = useCreateCompetition()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (formData.maxTeams < 2) {
			alert('Командалардың минималды саны 2 болуы керек')
			return
		}

		try {
			const competition = await createCompetition.mutateAsync(formData)
			router.push(`/competitions/${competition.id}/lobby`)
		} catch (error) {
			console.error('Failed to create competition:', error)
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
						<h1 className="text-2xl font-bold text-gray-800 mb-2">Жарыс құру</h1>
						<p className="text-gray-600">Жаңа жарыс ойынын ұйымдастырыңыз</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<Hash className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Тест ID
							</label>
							<Input
								value={formData.testId}
								onChange={(e) => setFormData(prev => ({ ...prev, testId: e.target.value }))}
								placeholder="Тест идентификаторын енгізіңіз"
								required
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<FileText className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Атауы (міндетті емес)
							</label>
							<Input
								value={formData.title}
								onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
								placeholder="Жарыс атауын енгізіңіз"
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<FileText className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Сипаттама (міндетті емес)
							</label>
							<Input
								value={formData.description}
								onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Жарыс сипаттамасын енгізіңіз"
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
						</div>

						<div className="space-y-2">
							<label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
								<Users className="w-4 h-4 mr-2 text-[#7C3AED]" />
								Максималды команда саны (минимум 2)
							</label>
							<Input
								type="number"
								min="2"
								max="10"
								value={formData.maxTeams}
								onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) || 2 }))}
								className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
							/>
							<p className="text-xs text-gray-500 mt-1">Командалардың минималды саны: 2</p>
						</div>

						<Button
							type="submit"
							className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
							disabled={createCompetition.isPending || !formData.testId}
						>
							{createCompetition.isPending ? (
								<div className="flex items-center">
									<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
									Құрылуда...
								</div>
							) : (
								'Жарыс құру'
							)}
						</Button>
					</form>
				</div>

				{/* Additional Info */}
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500">
						Жарыс құрылғаннан кейін қатысушылар кодпен қосыла алады
					</p>
				</div>
			</div>
		</div>
	)
} 