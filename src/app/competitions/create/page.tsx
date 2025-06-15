'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCompetition } from '@/hooks/game/useCreateCompetition'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateCompetitionPage() {
	const router = useRouter()
	const [formData, setFormData] = useState({
		testId: '',
		title: '',
		maxTeams: 2, // Минимум 2 команды
		description: ''
	})

	const createCompetition = useCreateCompetition()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Проверка на минимальное количество команд
		if (formData.maxTeams < 2) {
			alert('Минимальное количество команд должно быть 2')
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
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg border">
			<h1 className="text-2xl font-bold mb-6">Create Competition</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Test ID</label>
					<Input
						value={formData.testId}
						onChange={(e) => setFormData(prev => ({ ...prev, testId: e.target.value }))}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Title (optional)</label>
					<Input
						value={formData.title}
						onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
						placeholder="Название соревнования"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Description (optional)</label>
					<Input
						value={formData.description}
						onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
						placeholder="Описание соревнования"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1">Max Teams (минимум 2)</label>
					<Input
						type="number"
						min="2"
						max="10"
						value={formData.maxTeams}
						onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) || 2 }))}
					/>
					<p className="text-xs text-gray-500 mt-1">Минимальное количество команд: 2</p>
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={createCompetition.isPending}
				>
					{createCompetition.isPending ? 'Creating...' : 'Create Competition'}
				</Button>
			</form>
		</div>
	)
} 