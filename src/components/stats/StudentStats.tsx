'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMyAttempts, useMyCompetitions, useMyResults, useMyStats } from '@/hooks/useStatistics'
import { TestResultRecent } from '@/types/test'
import { Award, BookOpen, Clock, Star, Target, TrendingUp, Trophy, User } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { StatsCard } from './StatsCard'

export function StudentStats() {
	const { data: studentStats, isLoading: statsLoading } = useMyStats()
	const { data: results, isLoading: resultsLoading } = useMyResults()
	const { data: competitions, isLoading: competitionsLoading } = useMyCompetitions()
	const { data: attempts, isLoading: attemptsLoading } = useMyAttempts()

	if (statsLoading) {
		return <div className="p-6">Статистика жүктелуде...</div>
	}

	// Создаем график по результатам тестов
	const resultsChart = (results || []).map((result: TestResultRecent) => ({
		testName: result.test?.title || 'Тест',
		results: result.test._count.results,
		attempts: result.test._count.attempts
	}))


	return (
		<div className="space-y-6">
			{/* Основные метрики студента */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatsCard
					title="Жасалған тесттер"
					value={`${studentStats?.stats?.testsCreated || 'N/A'}`}
					icon={Star}
					color="orange"
					description="жасалған тесттер саны"
				/>
				<StatsCard
					title="Өткен тесттер"
					value={`${studentStats?.stats?.completedAttempts || 0}/${studentStats?.stats?.totalAttempts || 0}`}
					icon={BookOpen}
					color="blue"
				/>
				<StatsCard
					title="Орташа балл"
					value={studentStats?.stats?.avgScore?.toFixed(1) || '0.0'}
					icon={Target}
					color="green"
				/>
				<StatsCard
					title="Ең жақсы нәтиже"
					value={`${Math.round(studentStats?.stats?.bestScore || 0)}`}
					icon={Trophy}
					color="purple"
					description="Максималды балл"
				/>

			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* График результатов по тестам */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Тесттер бойынша нәтижелер
						</CardTitle>
					</CardHeader>
					<CardContent>
						{resultsLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<div className="text-gray-500">Жүктелуде...</div>
							</div>
						) : (
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={resultsChart}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="testName" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="attempts" fill="#8884d8" name="Әрекеттер" />
									<Bar dataKey="results" fill="#82ca9d" name="Нәтижелер" />
								</BarChart>
							</ResponsiveContainer>
						)}
					</CardContent>
				</Card>

				{/* Статус попыток */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5" />
							Соңғы әрекеттер
						</CardTitle>
					</CardHeader>
					<CardContent>
						{attemptsLoading ? (
							<div className="h-[300px] flex items-center justify-center">
								<div className="text-gray-500">Жүктелуде...</div>
							</div>
						) : (
							<div className="space-y-4">
								{(attempts || []).map((item, index) => (
									<div key={index} className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium">{item.test?.title || 'Тест'}</span>
											<span className="text-sm text-muted-foreground">{item.status}</span>
										</div>
									</div>
								))}
								{(!attempts || !attempts.length) && (
									<div className="text-gray-500 text-sm">Деректер жоқ</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Последние результаты и соревнования */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Соңғы нәтижелер
						</CardTitle>
					</CardHeader>
					<CardContent>
						{resultsLoading ? (
							<div className="text-gray-500">Жүктелуде...</div>
						) : (
							<div className="space-y-4">
								{(results || []).map((result, index) => (
									<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex-1">
											<p className="font-medium text-sm">{result.test?.title || 'Тест нәтижесі'}</p>
										</div>
										<div className="text-right">
											<p className="font-bold text-lg">
												{result.score || '0'}
											</p>
										</div>
									</div>
								))}
								{(!results || !results.length) && (
									<div className="text-gray-500 text-sm">Нәтижелер жоқ</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Trophy className="h-5 w-5" />
							Менің жарыстарым
						</CardTitle>
					</CardHeader>
					<CardContent>
						{competitionsLoading ? (
							<div className="text-gray-500">Жүктелуде...</div>
						) : (
							<div className="space-y-4">
								{(competitions || []).flatMap(comp => comp.created || []).slice(0, 5).map((competition, index) => (
									<div key={competition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold">
												{index + 1}
											</div>
											<div>
												<p className="font-medium text-sm">{competition.title}</p>
												<p className="text-xs text-muted-foreground">
													{competition._count.participants} қатысушы
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-bold text-sm">{competition.status}</p>
											<p className="text-xs text-muted-foreground">{competition._count.teams} команда</p>
										</div>
									</div>
								))}
								{!competitions && (
									<div className="text-gray-500 text-sm">Жарыстар жоқ</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Детальная статистика */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Жалпы статистика</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Барлық нәтижелер</span>
								<span className="font-medium">{studentStats?.stats?.totalResults || 0}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Жасалған жарыстар</span>
								<span className="font-medium">{studentStats?.stats?.competitionsCreated || 0}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Аяқтау пайызы</span>
								<span className="font-medium text-green-600">
									{Math.round(studentStats?.stats?.completionRate || 0)}%
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Жарыстарға қатысты</span>
								<span className="font-medium text-blue-600">{studentStats?.stats?.competitionsParticipated || 0}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Жетістіктер</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{(studentStats?.stats?.bestScore || 0) >= 9 && (
								<div className="flex items-center gap-2">
									<Award className="h-4 w-4 text-yellow-500" />
									<span className="text-sm">Керемет нәтиже</span>
								</div>
							)}
							{(studentStats?.stats?.completedAttempts || 0) >= 10 && (
								<div className="flex items-center gap-2">
									<Star className="h-4 w-4 text-blue-500" />
									<span className="text-sm">10+ тест өтілді</span>
								</div>
							)}
							{(studentStats?.stats?.avgScore || 0) >= 8 && (
								<div className="flex items-center gap-2">
									<Target className="h-4 w-4 text-green-500" />
									<span className="text-sm">Орташа балл 8-ден жоғары</span>
								</div>
							)}
							{studentStats?.stats?.competitionsCreated && studentStats.stats.competitionsCreated > 0 && (
								<div className="flex items-center gap-2">
									<Trophy className="h-4 w-4 text-purple-500" />
									<span className="text-sm">Жарыс ұйымдастырушысы</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Ұсыныстар</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{(studentStats?.stats?.avgScore || 0) < 6 && (
								<div className="p-3 bg-orange-50 rounded-lg">
									<p className="text-sm font-medium text-orange-800">Көбірек жаттығу керек</p>
									<p className="text-xs text-orange-600">Көбірек тест өтуге тырысыңыз</p>
								</div>
							)}
							{(studentStats?.stats?.completionRate || 0) < 50 && (
								<div className="p-3 bg-blue-50 rounded-lg">
									<p className="text-sm font-medium text-blue-800">Бастаған тесттерді аяқтаңыз</p>
									<p className="text-xs text-blue-600">Аяқтау пайызы төмен</p>
								</div>
							)}
							{(studentStats?.stats?.avgScore || 0) >= 8 && (
								<div className="p-3 bg-green-50 rounded-lg">
									<p className="text-sm font-medium text-green-800">Керемет жұмыс!</p>
									<p className="text-xs text-green-600">Осылай жалғастырыңыз</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}