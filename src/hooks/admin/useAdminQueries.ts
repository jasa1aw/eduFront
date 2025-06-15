import api from '@/lib/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Типы для пользователей - используем те же типы, что и в API
export interface User {
	id: string
	name: string
	email: string
	role: 'ADMIN' | 'TEACHER' | 'STUDENT'
	institution: string
	isBlocked: boolean
	isVerified: boolean
	createdAt: string
	updatedAt: string
	_count: {
		results: number
		createdTests: number
	}
}

export interface UsersResponse {
	users: User[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
	filters: {
		role?: string
		search?: string
		isBlocked?: boolean
	}
}

export interface UsersFilters {
	page?: number
	limit?: number
	search?: string
	role?: 'ADMIN' | 'TEACHER' | 'STUDENT'
	isBlocked?: boolean
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export interface CreateUserRequest {
	name: string
	email: string
	password: string
	role: 'ADMIN' | 'TEACHER' | 'STUDENT'
	institution: string
}

export interface UpdateUserRequest {
	name?: string
	email?: string
	role?: 'ADMIN' | 'TEACHER' | 'STUDENT'
	institution?: string
	isBlocked?: boolean
	isVerified?: boolean
}

export interface BlockUserRequest {
	isBlocked: boolean
	reason?: string
}

// Типы для тестов
export interface Test {
	id: string
	title: string
	description: string
	category: string
	timeLimit: number
	maxAttempts: number
	isActive: boolean
	startDate?: string
	endDate?: string
	createdAt: string
	updatedAt: string
	creator: {
		id: string
		name: string
		email: string
	}
	_count: {
		questions: number
		results: number
		assignedUsers: number
	}
}

export interface TestsResponse {
	tests: Test[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
	}
	filters: {
		search?: string
		category?: string
		isActive?: boolean
	}
}

export interface TestsFilters {
	page?: number
	limit?: number
	search?: string
	category?: string
	isActive?: boolean
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export interface CreateTestRequest {
	title: string
	description: string
	category: string
	timeLimit: number
	maxAttempts: number
	isActive: boolean
	startDate?: string
	endDate?: string
	questions: {
		question: string
		options: string[]
		correctAnswer: number
		points: number
	}[]
}

export interface UpdateTestRequest {
	title?: string
	description?: string
	category?: string
	timeLimit?: number
	maxAttempts?: number
	isActive?: boolean
	startDate?: string
	endDate?: string
}

export interface AssignTestRequest {
	testId: string
	userIds: string[]
	dueDate?: string
}


// Типы для здоровья системы
export interface HealthResponse {
	status: 'HEALTHY' | 'WARNING' | 'CRITICAL'
	uptime: number
	database: {
		status: 'CONNECTED' | 'DISCONNECTED'
		responseTime: number
	}
	memory: {
		used: number
		total: number
		percentage: number
	}
	cpu: {
		usage: number
	}
	disk: {
		used: number
		total: number
		percentage: number
	}
	errors: Array<{
		message: string
		timestamp: string
		level: 'WARNING' | 'ERROR' | 'CRITICAL'
	}>
}

// Типы для обзора
export interface OverviewResponse {
	summary: {
		totalUsers: number
		totalTests: number
		totalAttempts: number
		completionRate: number
	}
	trends: {
		usersGrowth: number
		testsGrowth: number
		attemptsGrowth: number
	}
	topPerformers: Array<{
		userId: string
		firstName: string
		lastName: string
		avgScore: number
		testsCompleted: number
	}>
	popularTests: Array<{
		testId: string
		title: string
		attemptsCount: number
		avgScore: number
	}>
	alerts: Array<{
		id: string
		type: 'INFO' | 'WARNING' | 'ERROR'
		message: string
		timestamp: string
	}>
}

// Хуки для пользователей
export const useUsers = (filters: UsersFilters = {}) => {
	return useQuery<UsersResponse, Error>({
		queryKey: ['admin', 'users', filters],
		queryFn: async () => {
			const params = new URLSearchParams()
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					if (key === 'page' || key === 'limit') {
						params.set(key, String(Number(value)))
					} else {
						params.set(key, String(value))
					}
				}
			})
			const { data } = await api.get<UsersResponse>(`/admin/users?${params}`)
			return data
		},
		staleTime: 30000, // 30 секунд
	})
}

export const useCreateUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (userData: CreateUserRequest) => {
			const { data } = await api.post<User>('/admin/users', userData)
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success('Пользователь создан успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка создания пользователя: ${error.message}`)
		}
	})
}

export const useUpdateUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
			const response = await api.patch<User>(`/admin/users/${id}`, data)
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success('Пользователь обновлен успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка обновления пользователя: ${error.message}`)
		}
	})
}

export const useBlockUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: BlockUserRequest }) => {
			const response = await api.patch<User>(`/admin/users/${id}/block`, data)
			return response.data
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success(data.isBlocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка изменения статуса пользователя: ${error.message}`)
		}
	})
}

export const useDeleteUser = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/admin/users/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
			toast.success('Пользователь удален успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка удаления пользователя: ${error.message}`)
		}
	})
}

// Хуки для тестов
export const useTests = (filters: TestsFilters = {}) => {
	return useQuery<TestsResponse, Error>({
		queryKey: ['admin', 'tests', filters],
		queryFn: async () => {
			const params = new URLSearchParams()
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					if (key === 'page' || key === 'limit') {
						params.set(key, String(Number(value)))
					} else {
						params.set(key, String(value))
					}
				}
			})
			const { data } = await api.get<TestsResponse>(`/admin/tests?${params}`)
			return data
		},
		staleTime: 30000,
	})
}

export const useCreateTest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (testData: CreateTestRequest) => {
			const { data } = await api.post<Test>('/admin/tests', testData)
			return data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] })
			toast.success('Тест создан успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка создания теста: ${error.message}`)
		}
	})
}

export const useUpdateTest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateTestRequest }) => {
			const response = await api.patch<Test>(`/admin/tests/${id}`, data)
			return response.data
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] })
			toast.success('Тест обновлен успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка обновления теста: ${error.message}`)
		}
	})
}

export const useDeleteTest = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/admin/tests/${id}`)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin', 'tests'] })
			toast.success('Тест удален успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка удаления теста: ${error.message}`)
		}
	})
}

// Хуки для системного здоровья
export const useHealth = () => {
	return useQuery<HealthResponse, Error>({
		queryKey: ['admin', 'health'],
		queryFn: async () => {
			const { data } = await api.get<HealthResponse>('/admin/health')
			return data
		},
		// refetchInterval: 60000, // Обновляем каждую минуту
	})
}

export const useHealthStats = () => {
	return useQuery<HealthResponse, Error>({
		queryKey: ['admin', 'health', 'stats'],
		queryFn: async () => {
			const { data } = await api.get<HealthResponse>('/admin/health/stats')
			return data
		},
		staleTime: 30000,
	})
}

export const useOverview = () => {
	return useQuery<OverviewResponse, Error>({
		queryKey: ['admin', 'overview'],
		queryFn: async () => {
			const { data } = await api.get<OverviewResponse>('/admin/overview')
			return data
		},
		staleTime: 60000, // 1 минута
	})
}

export const useExportData = () => {
	return useMutation({
		mutationFn: async (exportData: { type: string; filters?: any }) => {
			const response = await api.post('/admin/statistics/export', exportData, {
				responseType: 'blob'
			})
			return { blob: response.data, ...exportData }
		},
		onSuccess: ({ blob, type }) => {
			// Создаем ссылку для скачивания файла
			const url = window.URL.createObjectURL(blob as Blob)
			const link = document.createElement('a')
			link.href = url

			// Определяем расширение файла
			const extension = 'pdf'

			link.download = `export_${type}_${new Date().toISOString().split('T')[0]}.${extension}`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)

			toast.success('Данные экспортированы успешно')
		},
		onError: (error: Error) => {
			toast.error(`Ошибка экспорта: ${error.message}`)
		}
	})
}