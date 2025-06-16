'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSystemStats, useTopTests, useUsersByRole } from '@/hooks/useStatistics'
import { Activity, BookOpen, TrendingUp, Trophy, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatsCard } from './StatsCard'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe']

export function AdminSystemStats() {
	const { data: systemStats, isLoading: statsLoading } = useSystemStats()
	const { data: usersByRole, isLoading: usersLoading } = useUsersByRole()
	const { data: topTests, isLoading: testsLoading } = useTopTests()

	if (statsLoading) {
		return <div className="p-6">Жүйелік статистика жүктелуде...</div>
	}

	// Преобразуем данные для графика по статусам завершения
	const completionData = [
		{ name: 'Аяқталған', value: systemStats?.completedAttempts || 0 },
		{ name: 'Орындалуда', value: (systemStats?.totalAttempts || 0) - (systemStats?.completedAttempts || 0) }
	]

	return (
		<div className="space-y-6">
			{/* Основные метрики */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Барлық пайдаланушылар"
					value={systemStats?.totalUsers?.toLocaleString() || '0'}
					icon={Users}
					color="blue"
				/>
				<StatsCard
					title="Барлық тесттер"
					value={systemStats?.totalTests?.toLocaleString() || '0'}
					icon={BookOpen}
					color="green"

				/>
				<StatsCard
					title="Жарыстар"
					value={systemStats?.totalCompetitions?.toLocaleString() || '0'}
					icon={Trophy}
					color="purple"

				/>
				<StatsCard
					title="Барлық нәтижелер"
					value={systemStats?.totalResults?.toLocaleString() || '0'}
					icon={Activity}
					color="orange"

				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* График завершения тестов */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Тесттерді аяқтау статистикасы
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={completionData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="value" fill="#10b981" name="Саны" />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Распределение по ролям */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Пайдаланушыларды рөлдер бойынша бөлу
						</CardTitle>
					</CardHeader>
					<CardContent>
						{usersLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<div className="text-gray-500">Жүктелуде...</div>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={usersByRole || []}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ role, count }) => `${role}: ${count}`}
										outerRadius={80}
										fill="#8884d8"
										dataKey="count"
									>
										{(usersByRole || []).map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Дополнительная статистика */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Жүйе белсенділігі</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Студенттер</span>
								<span className="font-medium">{systemStats?.studentsCount?.toLocaleString() || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Оқытушылар</span>
								<span className="font-medium">{systemStats?.teachersCount?.toLocaleString() || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Барлық әрекеттер</span>
								<span className="font-medium">{systemStats?.totalAttempts || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Белсенді жарыстар</span>
								<span className="font-medium">{systemStats?.activeCompetitions || '0'}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Топ тесттер</CardTitle>
					</CardHeader>
					<CardContent>
						{testsLoading ? (
							<div className="text-gray-500">Жүктелуде...</div>
						) : (
							<div className="space-y-3">
								{(topTests || []).map((test, index) => (
									<div key={index} className="flex justify-between items-center">
										<span className="text-sm font-medium">{test.title}</span>
										<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
											{test._count.attempts} әрекет
										</span>
									</div>
								))}
								{(!topTests || topTests.length === 0) && (
									<div className="text-gray-500 text-sm">Деректер жоқ</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Жүйелік көрсеткіштер</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Барлық сұрақтар</span>
								<span className="font-medium">{systemStats?.totalQuestions?.toLocaleString() || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Аяқтау пайызы</span>
								<span className="font-medium text-green-600">{Math.round(systemStats?.completionRate || 0)}%</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Аяқталған әрекеттер</span>
								<span className="font-medium">{systemStats?.completedAttempts?.toLocaleString() || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Жалпы белсенділік</span>
								<span className="font-medium text-yellow-600">
									{systemStats?.totalAttempts && systemStats.totalAttempts > 1000 ? 'Жоғары' :
										systemStats?.totalAttempts && systemStats.totalAttempts > 100 ? 'Орташа' : 'Төмен'}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
} 