'use client'
import { ConfirmDeleteModal } from '@/components/modal/ConfirmDeleteModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useBlockUser, useDeleteUser, useUsers } from '@/hooks/admin/useAdminQueries'
import { useDebounce } from '@/hooks/useDebounce'
import { User } from '@/lib/api/admin'
import { useAdminStore, useUserFilters } from '@/store/admin/adminStore'
import {
	AlertCircle,
	BookOpen,
	Crown,
	Edit,
	Filter,
	GraduationCap,
	Loader2,
	Plus,
	Search,
	Shield,
	ShieldCheck,
	Trash2,
	UserCheck,
	Users,
	UserX
} from 'lucide-react'
import { Suspense, useCallback, useMemo, useState } from 'react'

export default function AdminUsers() {
	const userFilters = useUserFilters()
	const { setUserFilters, openEditUser, openModal } = useAdminStore()
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null)
	const deleteUserMutation = useDeleteUser()

	// Локальное состояние для поиска с debounce
	const [searchValue, setSearchValue] = useState(userFilters.search || '')

	// Debounced поиск - делаем запрос только через 500мс после остановки ввода
	const debouncedSearch = useDebounce(
		useCallback((value: string) => {
			setUserFilters({ search: value, page: 1 })
		}, [setUserFilters]),
		500
	)

	const { data: usersData, isPending, isError, error } = useUsers({
		...userFilters,
		page: Number(userFilters.page || 1),
		limit: Number(userFilters.limit || 20)
	})
	const blockUserMutation = useBlockUser()

	const handleSearchChange = useCallback((value: string) => {
		setSearchValue(value)
		debouncedSearch(value)
	}, [debouncedSearch])

	const handleRoleFilter = useCallback((role: string) => {
		setUserFilters({
			role: role === 'all' ? undefined : role as 'ADMIN' | 'TEACHER' | 'STUDENT',
			page: 1
		})
	}, [setUserFilters])

	const handleStatusFilter = useCallback((status: string) => {
		setUserFilters({
			isBlocked: status === 'all' ? undefined : status === 'blocked',
			page: 1
		})
	}, [setUserFilters])

	const handlePageChange = useCallback((page: number) => {
		setUserFilters({ page })
	}, [setUserFilters])

	const handleDelete = useCallback((e: React.MouseEvent, user: { id: string, name: string }) => {
		e.stopPropagation()
		setUserToDelete(user)
		setShowDeleteModal(true)
	}, [])

	const handleConfirmDelete = useCallback(() => {
		if (userToDelete) {
			deleteUserMutation.mutate(userToDelete.id)
			setShowDeleteModal(false)
			setUserToDelete(null)
		}
	}, [deleteUserMutation, userToDelete])

	const handleBlockUser = useCallback(async (user: User) => {
		try {
			await blockUserMutation.mutateAsync({
				id: user.id,
				data: {
					isBlocked: !user.isBlocked,
					reason: user.isBlocked ? undefined : 'Заблокирован администратором'
				}
			})
		} catch (error) {
			console.error(error)
		}
	}, [blockUserMutation])

	const getRoleIcon = useCallback((role: string) => {
		switch (role) {
			case 'ADMIN':
				return <Crown className="h-4 w-4" />
			case 'TEACHER':
				return <GraduationCap className="h-4 w-4" />
			case 'STUDENT':
				return <BookOpen className="h-4 w-4" />
			default:
				return <Users className="h-4 w-4" />
		}
	}, [])

	const getRoleBadgeColor = useCallback((role: string) => {
		switch (role) {
			case 'ADMIN':
				return 'bg-red-100 text-red-800'
			case 'TEACHER':
				return 'bg-blue-100 text-blue-800'
			case 'STUDENT':
				return 'bg-green-100 text-green-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}, [])

	const getRoleLabel = useCallback((role: string) => {
		switch (role) {
			case 'ADMIN':
				return 'Администратор'
			case 'TEACHER':
				return 'Преподаватель'
			case 'STUDENT':
				return 'Студент'
			default:
				return role
		}
	}, [])

	// Мемоизированная статистика
	const stats = useMemo(() => {
		if (!usersData) return null

		return {
			total: usersData.pagination.total,
			active: usersData.users.filter(u => !u.isBlocked).length,
			blocked: usersData.users.filter(u => u.isBlocked).length,
			verified: usersData.users.filter(u => u.isVerified).length,
			byRole: {
				admin: usersData.users.filter(u => u.role === 'ADMIN').length,
				teacher: usersData.users.filter(u => u.role === 'TEACHER').length,
				student: usersData.users.filter(u => u.role === 'STUDENT').length,
			}
		}
	}, [usersData])

	if (isPending) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-center h-64">
					<div className="flex items-center space-x-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="text-lg">Загрузка пользователей...</span>
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
							<span>Ошибка загрузки пользователей: {error?.message || 'Неизвестная ошибка'}</span>
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
						Управление пользователями
					</h1>
				</div>
			</div>

			{/* Statistics Cards */}
			{stats && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
									<Users className="h-5 w-5" />
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold">{stats.total}</div>
								<div className="text-sm text-white/80">Всего пользователей</div>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
									<UserCheck className="h-5 w-5" />
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold">{stats.active}</div>
								<div className="text-sm text-white/80">Активных</div>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
									<UserX className="h-5 w-5" />
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold">{stats.blocked}</div>
								<div className="text-sm text-white/80">Заблокированных</div>
							</div>
						</CardContent>
					</Card>

					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-90" />
						<CardContent className="relative p-6 text-white">
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
									<ShieldCheck className="h-5 w-5" />
								</div>
							</div>
							<div className="space-y-2">
								<div className="text-3xl font-bold">{stats.verified}</div>
								<div className="text-sm text-white/80">Подтвержденных</div>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Filters */}
			<Card className="shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Фильтры и поиск
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Поиск по имени или email..."
									value={searchValue}
									onChange={(e) => handleSearchChange(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
						<div className="flex gap-4">
							<Select value={userFilters.role || 'all'} onValueChange={handleRoleFilter}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Роль" />
								</SelectTrigger>
								<SelectContent className="animate-none">
									<SelectItem value="all">Все роли</SelectItem>
									<SelectItem value="ADMIN">Администратор</SelectItem>
									<SelectItem value="TEACHER">Преподаватель</SelectItem>
									<SelectItem value="STUDENT">Студент</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={userFilters.isBlocked === undefined ? 'all' : userFilters.isBlocked ? 'blocked' : 'active'}
								onValueChange={handleStatusFilter}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Статус" />
								</SelectTrigger>
								<SelectContent className="animate-none">
									<SelectItem value="all">Все</SelectItem>
									<SelectItem value="active">Активные</SelectItem>
									<SelectItem value="blocked">Заблокированные</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Users List */}
			<Suspense fallback="Loading">
				<Card className="shadow-lg">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								Список пользователей
							</div>
							{usersData?.pagination && (
								<div className="text-sm text-gray-500">
									{usersData.pagination.page} из {usersData.pagination.totalPages} страниц
									({usersData.pagination.total} всего)
								</div>
							)}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<div className="space-y-0">
								{usersData?.users.map((user, index) => (
									<div
										key={user.id}
										className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors ${index !== usersData.users.length - 1 ? 'border-b border-gray-100' : ''
											}`}
									>
										{/* Avatar */}
										<div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
											{user.name.charAt(0).toUpperCase()}
										</div>

										{/* User Info */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
												{!user.isVerified && (
													<Badge variant="outline" className="text-xs">
														Не подтвержден
													</Badge>
												)}
											</div>
											<p className="text-sm text-gray-600 truncate">{user.email}</p>
											<p className="text-xs text-gray-500 mt-1">{user.institution}</p>
										</div>

										{/* Role */}
										<div className="flex items-center gap-2">
											<Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1`}>
												{getRoleIcon(user.role)}
												{getRoleLabel(user.role)}
											</Badge>
										</div>

										{/* Status */}
										<div className="flex items-center gap-2">
											{user.isBlocked ? (
												<Badge variant="destructive" className="flex items-center gap-1">
													<UserX className="h-3 w-3" />
													Заблокирован
												</Badge>
											) : (
												<Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
													<UserCheck className="h-3 w-3" />
													Активен
												</Badge>
											)}
										</div>

										{/* Stats */}
										<div className="text-center px-4">
											<div className="text-sm font-medium text-gray-900">
												{user._count.results}
											</div>
											<div className="text-xs text-gray-500">Результатов</div>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => openEditUser(user)}
												className="h-8 w-8 p-0"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant={user.isBlocked ? "default" : "destructive"}
												size="sm"
												onClick={() => handleBlockUser(user)}
												disabled={blockUserMutation.isPending}
												className="h-8 px-3"
											>
												{blockUserMutation.isPending ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : user.isBlocked ? (
													<>
														<Shield className="h-4 w-4 mr-1" />
														Разблокировать
													</>
												) : (
													<>
														<UserX className="h-4 w-4 mr-1" />
														Заблокировать
													</>
												)}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={(e) => handleDelete(e, { id: user.id, name: user.name })}
												className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Pagination */}
						{usersData?.pagination && usersData.pagination.totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(userFilters.page! - 1)}
									disabled={usersData.pagination.page === 1}
								>
									Предыдущая
								</Button>
								<span className="text-sm text-gray-600 px-4">
									Страница {usersData.pagination.page} из {usersData.pagination.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(userFilters.page! + 1)}
									disabled={usersData.pagination.totalPages === usersData.pagination.page}
								>
									Следующая
								</Button>
							</div>
						)}

						{/* Empty State */}
						{usersData?.users.length === 0 && (
							<div className="text-center py-12">
								<Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">Пользователи не найдены</h3>
								<p className="text-gray-600 mb-6">
									{userFilters.search || userFilters.role || userFilters.isBlocked !== undefined
										? 'Попробуйте изменить параметры поиска'
										: 'Пользователи еще не зарегистрированы в системе'
									}
								</p>
								{(!userFilters.search && !userFilters.role && userFilters.isBlocked === undefined) && (
									<Button onClick={() => openModal('createUser')}>
										<Plus className="h-4 w-4 mr-2" />
										Добавить первого пользователя
									</Button>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</Suspense>
			<ConfirmDeleteModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleConfirmDelete}
				title="Удалить пользователя"
				message={`Вы уверены, что хотите удалить пользователя "${userToDelete?.name}"? Это действие нельзя будет отменить.`}
				isLoading={deleteUserMutation.isPending}
			/>
		</div>
	)
} 