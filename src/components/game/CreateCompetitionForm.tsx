'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCompetition } from '@/hooks/game/useCreateCompetition'
import { useGameTests } from '@/hooks/game/useGameTests'
import { useAuthStore } from '@/store/auth/authStore'
import { FileText, Settings, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { TestSelectionCard } from './TestSelectionCard'

export const CreateCompetitionForm = () => {
	const router = useRouter()
	const { user } = useAuthStore()
	const { data: tests, isLoading: testsLoading, isError: testsError } = useGameTests()
	const [formData, setFormData] = useState({
		selectedTestId: '',
		title: '',
		maxTeams: 2,
	})

	const createCompetition = useCreateCompetition()

	const handleTestSelect = (testId: string) => {
		setFormData(prev => ({ ...prev, selectedTestId: testId }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (formData.maxTeams < 2) {
			toast.error('Командалардың минималды саны 2 болуы керек')
			return
		}

		if (!formData.selectedTestId) {
			toast.error('Тест таңдау қажет')
			return
		}

		if (!formData.title.trim()) {
			toast.error('Жарыс атауын көрсету қажет')
			return
		}

		try {
			const competition = await createCompetition.mutateAsync({
				testId: formData.selectedTestId,
				title: formData.title,
				maxTeams: formData.maxTeams,
				userId: user?.id,
			})

			toast.success('Жарыс сәтті құрылды!')
			router.push(`/competitions/${competition.id}/dashboard`)
		} catch (error: any) {
			console.error('Failed to create competition:', error)
			toast.error(error?.response?.data?.message || 'Жарыс құру кезінде қате')
		}
	}

	if (testsLoading) {
		return (
			<div className="flex items-center justify-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mx-4">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C3AED] border-t-transparent mx-auto mb-4"></div>
					<p className="text-lg font-medium text-gray-700">Тесттер жүктелуде...</p>
				</div>
			</div>
		)
	}

	if (testsError) {
		return (
			<div className="flex items-center justify-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mx-4">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FileText className="w-8 h-8 text-red-600" />
					</div>
					<p className="text-lg font-medium text-red-600">Тесттерді жүктеу кезінде қате</p>
				</div>
			</div>
		)
	}

	if (!tests || tests.length === 0) {
		return (
			<div className="flex items-center justify-center py-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mx-4">
				<div className="text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FileText className="w-8 h-8 text-gray-600" />
					</div>
					<p className="text-lg font-medium text-gray-600">Жарыс құру үшін қолжетімді тесттер жоқ</p>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto mt-8 space-y-8">
			{/* Выбор теста */}
			<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
				<div className="p-6 bg-gradient-to-r from-[#7C3AED]/5 to-[#8B5CF6]/5 border-b border-gray-100">
					<div className="flex items-center gap-3 mb-2">
						<FileText className="w-6 h-6 text-[#7C3AED]" />
						<h3 className="text-2xl font-semibold text-gray-800">
							Тест таңдаңыз
						</h3>
					</div>
					<p className="text-gray-600">
						Жарыс құру үшін жарияланған тестті таңдаңыз
					</p>
				</div>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{tests.map((test) => (
							<TestSelectionCard
								key={test.id}
								test={test}
								isSelected={formData.selectedTestId === test.id}
								onSelect={handleTestSelect}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Форма настроек соревнования */}
			{formData.selectedTestId && (
				<div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
					<div className="p-6 bg-gradient-to-r from-[#7C3AED]/5 to-[#8B5CF6]/5 border-b border-gray-100">
						<div className="flex items-center gap-3 mb-2">
							<Settings className="w-6 h-6 text-[#7C3AED]" />
							<h3 className="text-2xl font-semibold text-gray-800">
								Жарыс параметрлері
							</h3>
						</div>
						<p className="text-gray-600">
							Жарыс атауы мен параметрлерін көрсетіңіз
						</p>
					</div>
					<div className="p-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="title" className="text-sm font-semibold text-gray-700">
									Жарыс атауы *
								</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
									placeholder="Жарыс атауын енгізіңіз"
									required
									className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="maxTeams" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
									<Users className="w-4 h-4 text-[#7C3AED]" />
									Максималды команда саны
								</Label>
								<Input
									id="maxTeams"
									type="number"
									min="2"
									max="10"
									value={formData.maxTeams}
									onChange={(e) => setFormData(prev => ({
										...prev,
										maxTeams: parseInt(e.target.value) || 2
									}))}
									className="h-12 border-2 border-gray-200 focus:border-[#7C3AED] rounded-lg"
								/>
								<p className="text-xs text-gray-500">Минимум: 2, Максимум: 10</p>
							</div>

							<Button
								type="submit"
								className="w-full h-12 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
								disabled={createCompetition.isPending}
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
				</div>
			)}
		</div>
	)
} 