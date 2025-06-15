'use client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeleteTest, useTests } from '@/hooks/admin/useAdminQueries'
import { useDebounce } from '@/hooks/useDebounce'
import { useAdminStore, useTestFilters } from '@/store/admin/adminStore'
import {
	AlertCircle,
	BookOpen,
	CheckCircle,
	Clock,
	Edit,
	Eye,
	Loader2,
	Plus,
	Search,
	Target,
	Trash2,
	Users,
	XCircle
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

export default function AdminTestsPage() {
	const testFilters = useTestFilters()
	const { setTestFilters, openEditTest, openDeleteConfirm, openModal } = useAdminStore()

	// Локальное состояние для поиска с debounce
	const [searchValue, setSearchValue] = useState(testFilters.search || '')

	// Debounced поиск
	const debouncedSearch = useDebounce(
		useCallback((value: string) => {
			setTestFilters({ search: value, page: 1 })
		}, [setTestFilters]),
		500
	)

	const { data: testsData, isPending, isError, error } = useTests({
		...testFilters,
		page: Number(testFilters.page || 1),
		limit: Number(testFilters.limit || 20)
	})
	const deleteTestMutation = useDeleteTest()

	const handleSearchChange = useCallback((value: string) => {
		setSearchValue(value)
		debouncedSearch(value)
	}, [debouncedSearch])

	const handleCategoryFilter = useCallback((category: string) => {
		setTestFilters({
			category: category === 'all' ? undefined : category,
			page: 1
		})
	}, [setTestFilters])

	const handleStatusFilter = useCallback((status: string) => {
		setTestFilters({
			isActive: status === 'all' ? undefined : status === 'active',
			page: 1
		})
	}, [setTestFilters])

	const handlePageChange = useCallback((page: number) => {
		setTestFilters({ page })
	}, [setTestFilters])

	const getStatusBadgeColor = useCallback((isActive: boolean) => {
		return isActive
			? 'bg-emerald-100 text-emerald-800 border-emerald-200'
			: 'bg-yellow-100 text-yellow-800 border-yellow-200'
	}, [])

	const getStatusIcon = useCallback((isActive: boolean) => {
		return isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />
	}, [])

	const getStatusText = useCallback((isActive: boolean) => {
		return isActive ? 'Активный' : 'Неактивный'
	}, [])

	const formatDuration = useCallback((seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)

		if (hours > 0) {
			return `${hours}ч ${minutes}м`
		}
		return `${minutes}м`
	}, [])

	const formatDate = useCallback((dateString: string) => {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}, [])

	// Мемоизированная статистика тестов
	const stats = useMemo(() => {
		if (!testsData) return null

		return {
			total: testsData.pagination.total,
			active: testsData.tests.filter(t => t.isActive).length,
			inactive: testsData.tests.filter(t => !t.isActive).length,
			totalQuestions: testsData.tests.reduce((acc, test) => acc + test._count.questions, 0),
			totalResults: testsData.tests.reduce((acc, test) => acc + test._count.results, 0),
			totalAssigned: testsData.tests.reduce((acc, test) => acc + test._count.assignedUsers, 0)
		}
	}, [testsData])

	const categories = useMemo(() => {
		return testsData ? Array.from(new Set(testsData.tests.map(t => t.category))) : []
	}, [testsData])

	if (isPending) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="flex items-center space-x-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="text-lg">Загрузка тестов...</span>
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
							<span>Ошибка загрузки тестов: {error?.message || 'Неизвестная ошибка'}</span>
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
						Управление тестами
					</h1>
				</div>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
					<Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<BookOpen className="h-8 w-8 text-blue-600" />
								<div>
									<p className="text-2xl font-bold text-blue-900">{stats.total}</p>
									<p className="text-sm text-blue-700">Всего тестов</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<CheckCircle className="h-8 w-8 text-emerald-600" />
								<div>
									<p className="text-2xl font-bold text-emerald-900">{stats.active}</p>
									<p className="text-sm text-emerald-700">Активных</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<XCircle className="h-8 w-8 text-yellow-600" />
								<div>
									<p className="text-2xl font-bold text-yellow-900">{stats.inactive}</p>
									<p className="text-sm text-yellow-700">Неактивных</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Target className="h-8 w-8 text-purple-600" />
								<div>
									<p className="text-2xl font-bold text-purple-900">{stats.totalQuestions}</p>
									<p className="text-sm text-purple-700">Вопросов</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Users className="h-8 w-8 text-indigo-600" />
								<div>
									<p className="text-2xl font-bold text-indigo-900">{stats.totalResults}</p>
									<p className="text-sm text-indigo-700">Результатов</p>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<Eye className="h-8 w-8 text-rose-600" />
								<div>
									<p className="text-2xl font-bold text-rose-900">{stats.totalAssigned}</p>
									<p className="text-sm text-rose-700">Назначений</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Tests List */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<BookOpen className="h-5 w-5" />
							Список тестов
						</div>
						{testsData?.pagination && (
							<div className="text-sm text-gray-500">
								{testsData.pagination.page} из {testsData.pagination.totalPages} страниц
								({testsData.pagination.total} всего)
							</div>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<div className="space-y-0">
							{testsData?.tests.map((test, index) => (
								<div
									key={test.id}
									className={`p-6 hover:bg-gray-50 transition-colors ${index !== testsData.tests.length - 1 ? 'border-b border-gray-100' : ''
										}`}
								>
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0 pr-4">
											<div className="flex items-center gap-2 mb-2">
												<h3 className="font-semibold text-gray-900 truncate">
													{test.title}
												</h3>
												<Badge className={`${getStatusBadgeColor(test.isActive)} flex items-center gap-1`}>
													{getStatusIcon(test.isActive)}
													{getStatusText(test.isActive)}
												</Badge>
												<Badge variant="outline">
													{test.category}
												</Badge>
											</div>
											<p className="text-sm text-gray-600 mb-3 line-clamp-2">
												{test.description}
											</p>
											<div className="flex items-center gap-4 text-sm text-gray-500">
												<div className="flex items-center gap-1">
													<BookOpen className="h-4 w-4" />
													{test._count.questions} вопросов
												</div>
												<div className="flex items-center gap-1">
													<Clock className="h-4 w-4" />
													{formatDuration(test.timeLimit)}
												</div>
												<div className="flex items-center gap-1">
													<Users className="h-4 w-4" />
													{test._count.results} результатов
												</div>
												<div className="flex items-center gap-1">
													<Target className="h-4 w-4" />
													{test._count.assignedUsers} назначений
												</div>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											<div className="text-right">
												<div className="text-sm font-medium text-gray-900">
													{test.creator.name}
												</div>
												<div className="text-xs text-gray-500">
													Создан {formatDate(test.createdAt)}
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => openEditTest(test)}
													className="h-8 w-8 p-0"
												>
													<Edit className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													variant="outline"
													size="sm"
													onClick={() => openDeleteConfirm('test', test.id, test.title)}
													className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Pagination */}
					{testsData?.pagination && testsData.pagination.totalPages > 1 && (
						<div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(testFilters.page! - 1)}
								disabled={testsData.pagination.page === 1}
							>
								Предыдущая
							</Button>
							<span className="text-sm text-gray-600 px-4">
								Страница {testsData.pagination.page} из {testsData.pagination.totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(testFilters.page! + 1)}
								disabled={testsData.pagination.totalPages === testsData.pagination.page}
							>
								Следующая
							</Button>
						</div>
					)}

					{/* Empty State */}
					{testsData?.tests.length === 0 && (
						<div className="text-center py-12">
							<BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">Тесты не найдены</h3>
							<p className="text-gray-600 mb-6">
								{testFilters.search || testFilters.category || testFilters.isActive !== undefined
									? 'Попробуйте изменить параметры поиска'
									: 'Тесты еще не созданы в системе'
								}
							</p>
							{(!testFilters.search && !testFilters.category && testFilters.isActive === undefined) && (
								<Button onClick={() => openModal('createTest')}>
									<Plus className="h-4 w-4 mr-2" />
									Создать первый тест
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
} 