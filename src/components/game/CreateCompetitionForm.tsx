'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateCompetition } from '@/hooks/game/useCreateCompetition'
import { useGameTests } from '@/hooks/game/useGameTests'
import { useAuthStore } from '@/store/auth/authStore'
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
			toast.error('Минимальное количество команд должно быть 2')
			return
		}

		if (!formData.selectedTestId) {
			toast.error('Необходимо выбрать тест')
			return
		}

		if (!formData.title.trim()) {
			toast.error('Необходимо указать название соревнования')
			return
		}

		try {
			const competition = await createCompetition.mutateAsync({
				testId: formData.selectedTestId,
				title: formData.title,
				maxTeams: formData.maxTeams,
				userId: user?.id,
			})

			toast.success('Соревнование создано успешно!')
			router.push(`/competitions/${competition.id}/dashboard`)
		} catch (error: any) {
			console.error('Failed to create competition:', error)
			toast.error(error?.response?.data?.message || 'Ошибка при создании соревнования')
		}
	}

	if (testsLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-lg">Загрузка тестов...</div>
			</div>
		)
	}

	if (testsError) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-lg text-red-600">Ошибка при загрузке тестов</div>
			</div>
		)
	}

	if (!tests || tests.length === 0) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-lg text-gray-600">Нет доступных тестов для создания соревнования</div>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto mt-8 space-y-8">
			{/* Выбор теста */}
			<div className="bg-white rounded-lg border shadow-sm">
				<div className="p-6 border-b">
					<h3 className="text-2xl font-semibold leading-none tracking-tight">
						Выберите тест
					</h3>
					<p className="text-sm text-gray-600 mt-2">
						Выберите опубликованный тест для создания соревнования
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
				<div className="bg-white rounded-lg border shadow-sm">
					<div className="p-6 border-b">
						<h3 className="text-2xl font-semibold leading-none tracking-tight">
							Настройки соревнования
						</h3>
						<p className="text-sm text-gray-600 mt-2">
							Укажите название и параметры соревнования
						</p>
					</div>
					<div className="p-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">Название соревнования *</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
									placeholder="Введите название соревнования"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="maxTeams">Максимальное количество команд</Label>
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
								/>
								<p className="text-xs text-gray-500">Минимум: 2, Максимум: 10</p>
							</div>

							<Button
								type="submit"
								className="w-full"
								disabled={createCompetition.isPending}
							>
								{createCompetition.isPending ? 'Создание...' : 'Создать соревнование'}
							</Button>
						</form>
					</div>
				</div>
			)}
		</div>
	)
} 