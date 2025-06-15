'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/auth'
import { useOverview } from '@/hooks/admin/useAdminQueries'
import {
	Activity,
	AlertCircle,
	BookOpen,
	CheckCircle,
	Download,
	Eye,
	Info,
	Loader2,
	Shield,
	TrendingDown,
	TrendingUp,
	Users
} from 'lucide-react'
import Link from 'next/link'

export default function AdminOverviewPage() {
	const { data: overviewData, isPending, isError, error } = useOverview()

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const formatGrowthPercentage = (percentage: number) => {
		const abs = Math.abs(percentage)
		const sign = percentage >= 0 ? '+' : '-'
		return `${sign}${abs.toFixed(1)}%`
	}

	const getAlertIcon = (type: string) => {
		switch (type) {
			case 'warning':
				return <AlertCircle className="h-4 w-4 text-yellow-600" />
			case 'error':
				return <AlertCircle className="h-4 w-4 text-red-600" />
			case 'info':
			default:
				return <Info className="h-4 w-4 text-blue-600" />
		}
	}

	const getAlertColor = (type: string) => {
		switch (type) {
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800'
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800'
			case 'info':
			default:
				return 'bg-blue-50 border-blue-200 text-blue-800'
		}
	}

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'user_login':
				return <Users className="h-4 w-4 text-green-600" />
			case 'test_created':
				return <BookOpen className="h-4 w-4 text-blue-600" />
			case 'user_registered':
				return <Users className="h-4 w-4 text-purple-600" />
			default:
				return <Activity className="h-4 w-4 text-gray-600" />
		}
	}

	if (isPending) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="flex items-center space-x-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="text-lg">Загрузка обзора системы...</span>
					</div>
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="space-y-6">
				<Card className="border-red-200 bg-red-50">
					<CardContent className="p-6">
						<div className="flex items-center space-x-2 text-red-600">
							<AlertCircle className="h-5 w-5" />
							<span>Ошибка загрузки обзора: {error?.message || 'Неизвестная ошибка'}</span>
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						Обзор системы
					</h1>
					<p className="text-gray-600 mt-2">
						Сводная информация о состоянии и активности платформы
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button asChild variant="outline" className="gap-2">
						<Link href={ROUTES.ADMIN.HEALTH}>
							<Shield className="h-4 w-4" />
							Мониторинг
						</Link>
					</Button>
					<Button asChild className="gap-2">
						<Link href={ROUTES.ADMIN.STATISTICS_EXPORT}>
							<Download className="h-4 w-4" />
							Экспорт
						</Link>
					</Button>
				</div>
			</div>

			{/* Quick Stats */}
			{overviewData?.summary && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<Users className="h-8 w-8" />
								{overviewData.growth?.usersGrowth && (
									<div className={`flex items-center gap-1 text-xs ${overviewData.growth.usersGrowth.percentage >= 0 ? 'text-green-200' : 'text-red-200'
										}`}>
										{overviewData.growth.usersGrowth.percentage >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
										{formatGrowthPercentage(overviewData.growth.usersGrowth.percentage)}
									</div>
								)}
							</div>
							<div className="text-3xl font-bold mb-1">
								{overviewData.summary.totalUsers.toLocaleString()}
							</div>
							<div className="text-sm opacity-80">Пользователей</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<BookOpen className="h-8 w-8" />
								{overviewData.growth?.testsGrowth && (
									<div className={`flex items-center gap-1 text-xs ${overviewData.growth.testsGrowth.percentage >= 0 ? 'text-green-200' : 'text-red-200'
										}`}>
										{overviewData.growth.testsGrowth.percentage >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
										{formatGrowthPercentage(overviewData.growth.testsGrowth.percentage)}
									</div>
								)}
							</div>
							<div className="text-3xl font-bold mb-1">
								{overviewData.summary.totalTests.toLocaleString()}
							</div>
							<div className="text-sm opacity-80">Тестов</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<Activity className="h-8 w-8" />
								{overviewData.growth?.resultsGrowth && (
									<div className={`flex items-center gap-1 text-xs ${overviewData.growth.resultsGrowth.percentage >= 0 ? 'text-green-200' : 'text-red-200'
										}`}>
										{overviewData.growth.resultsGrowth.percentage >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
										{formatGrowthPercentage(overviewData.growth.resultsGrowth.percentage)}
									</div>
								)}
							</div>
							<div className="text-3xl font-bold mb-1">
								{overviewData.summary.totalResults.toLocaleString()}
							</div>
							<div className="text-sm opacity-80">Результатов</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<Shield className="h-8 w-8" />
							</div>
							<div className="text-3xl font-bold mb-1">
								{overviewData.summary.systemUptime}
							</div>
							<div className="text-sm opacity-80">Время работы</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-2">
								<Download className="h-8 w-8" />
							</div>
							<div className="text-3xl font-bold mb-1">
								{formatDate(overviewData.summary.lastBackup).split(',')[0]}
							</div>
							<div className="text-sm opacity-80">Последний бэкап</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* System Status */}
				<div className="lg:col-span-1">
					<Card className="shadow-lg h-full">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-green-600" />
								Состояние системы
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-5 w-5 text-green-600" />
									<span className="font-medium">Система</span>
								</div>
								<Badge className="bg-green-100 text-green-800">Стабильно</Badge>
							</div>
							<div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
								<div className="flex items-center gap-2">
									<Activity className="h-5 w-5 text-blue-600" />
									<span className="font-medium">API</span>
								</div>
								<Badge className="bg-blue-100 text-blue-800">Работает</Badge>
							</div>
							<div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
								<div className="flex items-center gap-2">
									<Users className="h-5 w-5 text-purple-600" />
									<span className="font-medium">База данных</span>
								</div>
								<Badge className="bg-purple-100 text-purple-800">Подключена</Badge>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Activity */}
				<div className="lg:col-span-2">
					<Card className="shadow-lg h-full">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Activity className="h-5 w-5 text-blue-600" />
								Последняя активность
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{overviewData?.recentActivity && overviewData.recentActivity.length > 0 ?
									overviewData.recentActivity.slice(0, 8).map((activity, index) => (
										<div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
											{getActivityIcon(activity.type)}
											<div className="flex-1 min-w-0">
												<p className="text-sm text-gray-900">
													<span className="font-medium">{activity.user}</span>
													{activity.test && ` - ${activity.test}`}
												</p>
												<p className="text-xs text-gray-500">
													{formatDate(activity.timestamp)}
												</p>
											</div>
										</div>
									)) : (
										<div className="text-center py-8 text-gray-500">
											<Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
											<p>Активность не найдена</p>
										</div>
									)
								}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Top Performers */}
			{overviewData?.topPerformers && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Top Users */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5 text-purple-600" />
								Лучшие пользователи
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{overviewData.topPerformers.users.length > 0 ?
									overviewData.topPerformers.users.map((user, index) => (
										<div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
											<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
												{index + 1}
											</div>
											<div className="flex-1">
												<div className="font-medium text-gray-900">{user.name}</div>
												<div className="text-sm text-gray-600">
													{user.testsCompleted} тестов • Средний балл: {user.averageScore.toFixed(1)}%
												</div>
											</div>
										</div>
									)) : (
										<div className="text-center py-8 text-gray-500">
											<Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
											<p>Данные не найдены</p>
										</div>
									)
								}
							</div>
						</CardContent>
					</Card>

					{/* Top Tests */}
					<Card className="shadow-lg">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5 text-green-600" />
								Популярные тесты
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{overviewData.topPerformers.tests.length > 0 ?
									overviewData.topPerformers.tests.map((test, index) => (
										<div key={test.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
											<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
												{index + 1}
											</div>
											<div className="flex-1">
												<div className="font-medium text-gray-900">{test.title}</div>
												<div className="text-sm text-gray-600">
													{test.completions} завершений • Средний балл: {test.averageScore.toFixed(1)}%
												</div>
											</div>
										</div>
									)) : (
										<div className="text-center py-8 text-gray-500">
											<BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
											<p>Данные не найдены</p>
										</div>
									)
								}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Alerts */}
			{overviewData?.alerts && overviewData.alerts.length > 0 && (
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-orange-600" />
							Уведомления и предупреждения
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{overviewData.alerts.map((alert, index) => (
								<div
									key={index}
									className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertColor(alert.type)}`}
								>
									{getAlertIcon(alert.type)}
									<div className="flex-1">
										<p className="font-medium">{alert.message}</p>
										<p className="text-xs opacity-75 mt-1">
											{formatDate(alert.timestamp)}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Quick Actions */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5 text-blue-600" />
						Быстрые действия
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<Button asChild variant="outline" className="h-auto p-4 justify-start">
							<Link href={ROUTES.ADMIN.USERS} className="flex flex-col items-start gap-2">
								<Users className="h-5 w-5 text-blue-600" />
								<div>
									<div className="font-medium">Управление пользователями</div>
									<div className="text-xs text-gray-600">Добавить, редактировать пользователей</div>
								</div>
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-auto p-4 justify-start">
							<Link href={ROUTES.ADMIN.TESTS} className="flex flex-col items-start gap-2">
								<BookOpen className="h-5 w-5 text-green-600" />
								<div>
									<div className="font-medium">Управление тестами</div>
									<div className="text-xs text-gray-600">Создать, назначить тесты</div>
								</div>
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-auto p-4 justify-start">
							<Link href={ROUTES.ADMIN.STATISTICS_ADVANCED} className="flex flex-col items-start gap-2">
								<Activity className="h-5 w-5 text-purple-600" />
								<div>
									<div className="font-medium">Аналитика</div>
									<div className="text-xs text-gray-600">Подробная статистика</div>
								</div>
							</Link>
						</Button>
						<Button asChild variant="outline" className="h-auto p-4 justify-start">
							<Link href={ROUTES.ADMIN.SETTINGS} className="flex flex-col items-start gap-2">
								<Shield className="h-5 w-5 text-orange-600" />
								<div>
									<div className="font-medium">Настройки</div>
									<div className="text-xs text-gray-600">Конфигурация системы</div>
								</div>
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
} 