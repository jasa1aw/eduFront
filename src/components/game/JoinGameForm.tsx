'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useJoinCompetition } from '@/hooks/game/useJoinCompetition'
import { useAuthStore } from '@/store/auth/authStore'
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
			toast.error('Необходимо указать код соревнования')
			return
		}

		if (!formData.displayName.trim()) {
			toast.error('Необходимо указать отображаемое имя')
			return
		}

		try {
			const result = await joinCompetition.mutateAsync({
				code: formData.code.toUpperCase(),
				displayName: formData.displayName,
			})

			toast.success('Успешно подключились к соревнованию!')
			router.push(`/competitions/${result.competition.id}/lobby?participantId=${result.participantId}`)
		} catch (error: any) {
			console.error('Failed to join competition:', error)
			toast.error(error?.response?.data?.message || 'Ошибка при подключении к соревнованию')
		}
	}

	return (
		<div className="max-w-md mx-auto mt-8">
			<div className="bg-white rounded-lg border shadow-sm">
				<div className="p-6 border-b">
					<h3 className="text-2xl font-semibold leading-none tracking-tight">
						Присоединиться к игре
					</h3>
					<p className="text-sm text-gray-600 mt-2">
						Введите код соревнования для участия в командной игре
					</p>
				</div>
				<div className="p-6">
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="code">Код соревнования *</Label>
							<Input
								id="code"
								value={formData.code}
								onChange={(e) => setFormData(prev => ({
									...prev,
									code: e.target.value.toUpperCase()
								}))}
								placeholder="Введите 6-значный код"
								maxLength={6}
								className="uppercase"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="displayName">Отображаемое имя *</Label>
							<Input
								id="displayName"
								value={formData.displayName}
								onChange={(e) => setFormData(prev => ({
									...prev,
									displayName: e.target.value
								}))}
								placeholder="Ваше имя в игре"
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={joinCompetition.isPending}
						>
							{joinCompetition.isPending ? 'Подключение...' : 'Присоединиться к игре'}
						</Button>
					</form>
				</div>
			</div>
		</div>
	)
} 