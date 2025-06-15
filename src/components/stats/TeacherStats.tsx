'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMyResults, useMyStats, useTopTests, useTopUsers, TestResult } from '@/hooks/useStatistics'
import { Award, BookOpen, Star, Target, TrendingUp, Trophy, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatsCard } from './StatsCard'

export function TeacherStats() {
	const { data: teacherStats, isLoading: statsLoading } = useMyStats()
	const { data: topUsers, isLoading: usersLoading } = useTopUsers()
	const { data: topTests, isLoading: testsLoading } = useTopTests()
	const { data: myResults, isLoading: resultsLoading } = useMyResults()

	if (statsLoading) {
		return <div className="p-6">Загрузка статистики...</div>
	}

	// Создаем данные для графика на основе топ тестов
	const testPerformance = (topTests || []).map(test => ({
		testName: test.title.length > 15 ? test.title.substring(0, 15) + '...' : test.title,
		attempts: test._count.attempts,
		results: test._count.results,
		questions: test._count.questions
	}))

	// Данные для графика результатов
	const resultsData = (myResults || []).map((result:TestResult) => ({
		testName: result.test.title || "Тест",
		results: result.test._count.results,
		attempts: result.test._count.attempts
	}))

	return (
		<div className="space-y-6">
			{/* Основные метрики учителя */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Мои тесты"
					value={teacherStats?.stats?.testsCreated?.toString() || '0'}
					icon={BookOpen}
					color="blue"
				/>
				<StatsCard
					title="Всего попыток"
					value={teacherStats?.stats?.totalAttempts?.toString() || '0'}
					icon={Users}
					color="green"
				/>
				<StatsCard
					title="Средний балл"
					value={teacherStats?.stats?.avgScore?.toFixed(1) || '0.0'}
					icon={Target}
					color="purple"
				/>
				<StatsCard
					title="Завершаемость"
					value={`${Math.round(teacherStats?.stats?.completionRate || 0)}%`}
					icon={Trophy}
					color="orange"
					description="Процент завершенных тестов"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* График производительности тестов */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Производительность тестов
						</CardTitle>
					</CardHeader>
					<CardContent>
						{testsLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<div className="text-gray-500">Загрузка...</div>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={testPerformance}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="testName" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="attempts" fill="#8884d8" name="Попытки" />
									<Bar dataKey="results" fill="#82ca9d" name="Результаты" />
									<Bar dataKey="questions" fill="#ffc658" name="Вопросы" />
								</BarChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>

				{/* Топ студенты */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Star className="h-5 w-5" />
							Топ студенты
						</CardTitle>
					</CardHeader>
					<CardContent>
						{usersLoading ? (
							<div className="text-gray-500">Загрузка...</div>
						) : (
							<div className="space-y-4">
								{(topUsers || []).slice(0, 5).map((user, index) => (
									<div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold">
												{index + 1}
											</div>
											<div>
												<p className="font-medium">{user.name}</p>
												<p className="text-xs text-muted-foreground">{user._count.results} результатов</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-sm">{user.avgScore?.toFixed(1) || '0.0'}</p>
											<p className="text-xs text-muted-foreground">средний балл</p>
										</div>
									</div>
								))}
								{(!topUsers || topUsers.length === 0) && (
									<div className="text-gray-500 text-sm">Нет данных</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Статистика тестов и активность */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Award className="h-5 w-5" />
							Мои топ тесты
						</CardTitle>
					</CardHeader>
					<CardContent>
						{testsLoading ? (
							<div className="text-gray-500">Загрузка...</div>
						) : (
							<div className="space-y-3">
								{(topTests || []).slice(0, 5).map((test) => (
									<div key={test.id} className="flex justify-between items-start">
										<div className="flex-1">
											<p className="font-medium text-sm">{test.title}</p>
											<p className="text-xs text-muted-foreground">{test._count.attempts} попыток</p>
										</div>
										<div className="text-right ml-2">
											<p className="text-xs font-medium">{test._count.results}</p>
											<p className="text-xs text-muted-foreground">результатов</p>
										</div>
									</div>
								))}
								{(!topTests || topTests.length === 0) && (
									<div className="text-gray-500 text-sm">Нет данных</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Последние результаты</CardTitle>
					</CardHeader>
					<CardContent>
						{resultsLoading ? (
							<div className="text-gray-500">Загрузка...</div>
						) : (
							<div className="space-y-3">
								<div className="space-y-2">
									{(myResults || []).map((result: TestResult, index: number) => (
										<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div className="flex-1">
												<p className="font-medium text-sm">{result.test?.title || 'Результат теста'}</p>
											</div>
											<div className="text-right">
												<p className="font-bold text-lg">
													{result.score || '0'}
												</p>
											</div>
										</div>
									))}
								</div>
								{(!myResults || !myResults.length) && (
									<div className="text-gray-500 text-sm">Нет данных</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Еженедельная статистика</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Всего попыток</span>
								<span className="font-medium">{teacherStats?.stats?.totalAttempts || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Завершено</span>
								<span className="font-medium text-green-600">{teacherStats?.stats?.completedAttempts || '0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Лучший результат</span>
								<span className="font-medium">{teacherStats?.stats?.bestScore?.toFixed(1) || '0.0'}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Всего результатов</span>
								<span className="font-medium">{teacherStats?.stats?.totalResults || '0'}</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Детальная аналитика результатов */}
			<Card>
				<CardHeader>
					<CardTitle>Детальная аналитика по результатам</CardTitle>
				</CardHeader>
				<CardContent>
					{resultsLoading ? (
						<div className="h-[300px] flex items-center justify-center">
							<div className="text-gray-500">Загрузка...</div>
						</div>
					) : (
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={resultsData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="testName"  />
								<YAxis />
								<Tooltip />
								<Line
									type="monotone"
									dataKey="attempts"
									stroke="#8884d7"
									strokeWidth={2}
									name="Попытки"
								/>
								<Line
									type="monotone"
									dataKey="results"
									stroke="#82ca9d"
									strokeWidth={2}
									name="Результаты"
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>
		</div>
	)
} 