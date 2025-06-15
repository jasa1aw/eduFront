
// Типы для пользователей
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
	questions?: {
		question: string
		options: string[]
		correctAnswer: number
		points: number
	}[]
}

export interface AssignTestRequest {
	testIds: string[]
	targetType: 'ALL' | 'GROUPS' | 'INDIVIDUAL'
	userIds?: string[]
	groupIds?: string[]
	deadline?: string
	maxAttempts?: number
	autoGrade?: boolean
	notifyUsers?: boolean
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

// Типы для дашборда
export interface DashboardResponse {
	overview: {
		totalUsers: number
		totalTests: number
		totalResults: number
		activeUsers: number
		newUsersToday: number
		testsCompletedToday: number
	}
	recentActivity: {
		type: string
		user: string
		test?: string
		score?: number
		timestamp: string
	}[]
	systemHealth: {
		status: 'healthy' | 'warning' | 'critical'
		memoryUsage: string
		diskUsage: string
	}
}

// Типы для health
export interface HealthResponse {
	status: 'healthy' | 'warning' | 'critical'
	version: string
	uptime: string
	environment: string
	resources: {
		cpu: {
			usage: string
			loadAverage?: number[]
		}
		memory: {
			used: string
			total: string
			percentage: number
		}
		disk: {
			used: string
			total: string
			percentage: number
		}
	}
	services: {
		database: {
			status: 'connected' | 'disconnected'
			responseTime: string
			connections: {
				active: number
				idle: number
				total: number
			}
		}
		redis: {
			status: 'connected' | 'disconnected'
			responseTime: string
			memoryUsage: string
		}
		email: {
			status: 'operational' | 'error'
			lastTest: string
			queueSize: number
		}
	}
	metrics: {
		requestsPerMinute: number
		averageResponseTime: string
		errorRate: string
		activeUsers: number
	}
}

// Типы для overview
export interface OverviewResponse {
	summary: {
		totalUsers: number
		totalTests: number
		totalResults: number
		systemUptime: string
		lastBackup: string
	}
	growth: {
		usersGrowth: {
			value: number
			percentage: number
		}
		testsGrowth: {
			value: number
			percentage: number
		}
		resultsGrowth: {
			value: number
			percentage: number
		}
	}
	recentActivity: {
		type: string
		user: string
		test?: string
		timestamp: string
	}[]
	topPerformers: {
		users: {
			id: string
			name: string
			testsCompleted: number
			averageScore: number
		}[]
		tests: {
			id: string
			title: string
			completions: number
			averageScore: number
		}[]
	}
	alerts: {
		type: 'info' | 'warning' | 'error'
		message: string
		timestamp: string
	}[]
}

// Типы для расширенной статистики
export interface AdvancedStatsFilters {
	startDate?: string
	endDate?: string
	groupBy?: 'day' | 'week' | 'month'
	metric?: 'users' | 'tests' | 'results'
}

export interface AdvancedStatsResponse {
	users: {
		total: number
		growth: number
		byRole: Record<string, number>
		registrations: {
			date: string
			count: number
		}[]
	}
	tests: {
		total: number
		active: number
		byCategory: Record<string, number>
		completions: {
			date: string
			count: number
		}[]
	}
	results: {
		total: number
		averageScore: number
		distribution: Record<string, number>
		trends: {
			date: string
			average: number
		}[]
	}
}

export interface ExportRequest {
	type: 'users' | 'tests' | 'results' | 'full'
	format: 'csv' | 'xlsx' | 'json'
	filters?: Record<string, any>
	startDate?: string
	endDate?: string
}

// API клиент
// class AdminAPI {
// 	private baseURL = '/admin'

// 	// Пользователи
// 	async getUsers(filters: UsersFilters = {}): Promise<UsersResponse> {
// 		const params = new URLSearchParams()
// 		Object.entries(filters).forEach(([key, value]) => {
// 			if (value !== undefined) {
// 				params.set(key, String(value))
// 			}
// 		})

// 		const response = await api(`${this.baseURL}/users?${params}`)
// 		return response.json()
// 	}

// 	async createUser(data: CreateUserRequest): Promise<User> {
// 		const response = await api(`${this.baseURL}/users`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.json()
// 	}

// 	async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
// 		const response = await api(`${this.baseURL}/users/${id}`, {
// 			method: 'PATCH',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.json()
// 	}

// 	async blockUser(id: string, data: BlockUserRequest): Promise<User> {
// 		const response = await api(`${this.baseURL}/users/${id}/block`, {
// 			method: 'PATCH',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.json()
// 	}

// 	async deleteUser(id: string): Promise<void> {
// 		await api(`${this.baseURL}/users/${id}`, {
// 			method: 'DELETE'
// 		})
// 	}

// 	// Тесты
// 	async getTests(filters: TestsFilters = {}): Promise<TestsResponse> {
// 		const params = new URLSearchParams()
// 		Object.entries(filters).forEach(([key, value]) => {
// 			if (value !== undefined) {
// 				params.set(key, String(value))
// 			}
// 		})

// 		const response = await api(`${this.baseURL}/tests?${params}`)
// 		return response.json()
// 	}

// 	async createTest(data: CreateTestRequest): Promise<Test> {
// 		const response = await api(`${this.baseURL}/tests`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.json()
// 	}

// 	async updateTest(id: string, data: UpdateTestRequest): Promise<Test> {
// 		const response = await api(`${this.baseURL}/tests/${id}`, {
// 			method: 'PATCH',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.json()
// 	}

// 	async deleteTest(id: string): Promise<void> {
// 		await api(`${this.baseURL}/tests/${id}`, {
// 			method: 'DELETE'
// 		})
// 	}

// 	async assignTest(data: AssignTestRequest): Promise<void> {
// 		await authFetch(`${this.baseURL}/tests/assign`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 	}

// 	// Дашборд
// 	async getDashboard(): Promise<DashboardResponse> {
// 		const response = await authFetch(`${this.baseURL}/dashboard`)
// 		return response.json()
// 	}

// 	// Health
// 	async getHealth(): Promise<HealthResponse> {
// 		const response = await authFetch(`${this.baseURL}/health`)
// 		return response.json()
// 	}

// 	// Overview
// 	async getOverview(): Promise<OverviewResponse> {
// 		const response = await authFetch(`${this.baseURL}/overview`)
// 		return response.json()
// 	}

// 	// Расширенная статистика
// 	async getAdvancedStats(filters: AdvancedStatsFilters = {}): Promise<AdvancedStatsResponse> {
// 		const params = new URLSearchParams()
// 		Object.entries(filters).forEach(([key, value]) => {
// 			if (value !== undefined) {
// 				params.set(key, String(value))
// 			}
// 		})

// 		const response = await authFetch(`${this.baseURL}/statistics/advanced?${params}`)
// 		return response.json()
// 	}

// 	// Экспорт данных
// 	async exportData(data: ExportRequest): Promise<Blob> {
// 		const response = await authFetch(`${this.baseURL}/statistics/export`, {
// 			method: 'POST',
// 			headers: { 'Content-Type': 'application/json' },
// 			body: JSON.stringify(data)
// 		})
// 		return response.blob()
// 	}
// }

// export const adminAPI = new AdminAPI() 