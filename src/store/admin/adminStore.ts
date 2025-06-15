import { Test, TestsFilters, User, UsersFilters } from '@/lib/api/admin'
import { create } from 'zustand'

// Интерфейсы для стора
interface UserFormData {
	name: string
	email: string
	password: string
	role: 'ADMIN' | 'TEACHER' | 'STUDENT'
	institution: string
}

interface TestFormData {
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

interface AdminState {
	// Модальные окна
	modals: {
		createUser: boolean
		editUser: boolean
		createTest: boolean
		editTest: boolean
		assignTest: boolean
		deleteConfirm: boolean
	}

	// Формы
	userForm: UserFormData
	testForm: TestFormData

	// Текущие данные для редактирования
	currentUser: User | null
	currentTest: Test | null

	// Выбранные элементы
	selectedUser: User | null
	selectedTest: Test | null
	selectedUsers: string[]
	selectedTests: string[]

	// Фильтры
	userFilters: UsersFilters
	testFilters: TestsFilters

	// Модальное окно подтверждения удаления
	deleteConfirm: {
		isOpen: boolean
		type: 'user' | 'test' | null
		id: string | null
		name: string | null
	}

	// Цель для удаления
	deleteTarget: {
		type: 'user' | 'test' | null
		id: string | null
		name: string | null
	}

	// Actions
	openModal: (modal: keyof AdminState['modals']) => void
	closeModal: (modal: keyof AdminState['modals']) => void
	closeAllModals: () => void

	setUserForm: (data: Partial<UserFormData>) => void
	setTestForm: (data: Partial<TestFormData>) => void
	resetUserForm: () => void
	resetTestForm: () => void

	setSelectedUser: (user: User | null) => void
	setSelectedTest: (test: Test | null) => void

	setSelectedUsers: (userIds: string[]) => void
	setSelectedTests: (testIds: string[]) => void
	toggleUserSelection: (userId: string) => void
	toggleTestSelection: (testId: string) => void
	clearSelections: () => void

	setUserFilters: (filters: Partial<UsersFilters>) => void
	setTestFilters: (filters: Partial<TestsFilters>) => void
	resetUserFilters: () => void
	resetTestFilters: () => void

	setDeleteTarget: (type: 'user' | 'test', id: string, name: string) => void
	clearDeleteTarget: () => void

	// Convenience methods
	openEditUser: (user: User) => void
	openEditTest: (test: Test) => void
	openDeleteConfirm: (type: 'user' | 'test', id: string, name: string) => void
	closeDeleteConfirm: () => void
}

const initialUserForm: UserFormData = {
	name: '',
	email: '',
	password: '',
	role: 'STUDENT',
	institution: '',
}

const initialTestForm: TestFormData = {
	title: '',
	description: '',
	category: '',
	timeLimit: 3600,
	maxAttempts: 3,
	isActive: true,
	startDate: undefined,
	endDate: undefined,
	questions: [{
		question: '',
		options: ['', '', '', ''],
		correctAnswer: 0,
		points: 1
	}],
}

const initialUserFilters: UsersFilters = {
	page: 1,
	limit: 20,
	search: '',
	role: undefined,
	isBlocked: undefined,
	sortBy: 'createdAt',
	sortOrder: 'desc',
}

const initialTestFilters: TestsFilters = {
	page: 1,
	limit: 20,
	search: '',
	category: undefined,
	isActive: undefined,
	sortBy: 'createdAt',
	sortOrder: 'desc',
}

export const useAdminStore = create<AdminState>((set, get) => ({
	// Начальное состояние
	modals: {
		createUser: false,
		editUser: false,
		createTest: false,
		editTest: false,
		assignTest: false,
		deleteConfirm: false,
	},

	userForm: initialUserForm,
	testForm: initialTestForm,

	currentUser: null,
	currentTest: null,

	selectedUser: null,
	selectedTest: null,
	selectedUsers: [],
	selectedTests: [],

	userFilters: initialUserFilters,
	testFilters: initialTestFilters,

	deleteConfirm: {
		isOpen: false,
		type: null,
		id: null,
		name: null
	},

	deleteTarget: {
		type: null,
		id: null,
		name: null
	},

	// Actions
	openModal: (modal) => set((state) => ({
		modals: { ...state.modals, [modal]: true }
	})),

	closeModal: (modal) => set((state) => ({
		modals: { ...state.modals, [modal]: false }
	})),

	closeAllModals: () => set({
		modals: {
			createUser: false,
			editUser: false,
			createTest: false,
			editTest: false,
			assignTest: false,
			deleteConfirm: false,
		},
		userForm: initialUserForm,
		testForm: initialTestForm,
		currentUser: null,
		currentTest: null,
		deleteConfirm: {
			isOpen: false,
			type: null,
			id: null,
			name: null
		}
	}),

	setUserForm: (data) => set((state) => ({
		userForm: { ...state.userForm, ...data }
	})),

	setTestForm: (data) => set((state) => ({
		testForm: { ...state.testForm, ...data }
	})),

	resetUserForm: () => set({ userForm: initialUserForm }),

	resetTestForm: () => set({ testForm: initialTestForm }),

	setSelectedUser: (user) => set({ selectedUser: user }),

	setSelectedTest: (test) => set({ selectedTest: test }),

	setSelectedUsers: (userIds) => set({ selectedUsers: userIds }),

	setSelectedTests: (testIds) => set({ selectedTests: testIds }),

	toggleUserSelection: (userId) => set((state) => {
		const isSelected = state.selectedUsers.includes(userId)
		return {
			selectedUsers: isSelected
				? state.selectedUsers.filter(id => id !== userId)
				: [...state.selectedUsers, userId]
		}
	}),

	toggleTestSelection: (testId) => set((state) => {
		const isSelected = state.selectedTests.includes(testId)
		return {
			selectedTests: isSelected
				? state.selectedTests.filter(id => id !== testId)
				: [...state.selectedTests, testId]
		}
	}),

	clearSelections: () => set({
		selectedUsers: [],
		selectedTests: [],
	}),

	setUserFilters: (filters) => set((state) => ({
		userFilters: { ...state.userFilters, ...filters }
	})),

	setTestFilters: (filters) => set((state) => ({
		testFilters: { ...state.testFilters, ...filters }
	})),

	resetUserFilters: () => set({ userFilters: initialUserFilters }),

	resetTestFilters: () => set({ testFilters: initialTestFilters }),

	setDeleteTarget: (type, id, name) => set({
		deleteTarget: { type, id, name }
	}),

	clearDeleteTarget: () => set({
		deleteTarget: { type: null, id: null, name: null }
	}),

	// Convenience methods
	openEditUser: (user) => {
		set({
			currentUser: user,
			userForm: {
				name: user.name,
				email: user.email,
				password: '', // Пароль не заполняем при редактировании
				role: user.role,
				institution: user.institution,
			},
			modals: { ...get().modals, editUser: true }
		})
	},

	openEditTest: (test) => {
		set({
			currentTest: test,
			testForm: {
				title: test.title,
				description: test.description,
				category: test.category,
				timeLimit: test.timeLimit,
				maxAttempts: test.maxAttempts,
				isActive: test.isActive,
				startDate: test.startDate,
				endDate: test.endDate,
				questions: [{
					question: '',
					options: ['', '', '', ''],
					correctAnswer: 0,
					points: 1
				}], // Вопросы загружаются отдельно
			},
			modals: { ...get().modals, editTest: true }
		})
	},

	openDeleteConfirm: (type, id, name) => {
		set({
			deleteConfirm: {
				isOpen: true,
				type,
				id,
				name
			},
			modals: { ...get().modals, deleteConfirm: true }
		})
	},

	closeDeleteConfirm: () => {
		set({
			deleteConfirm: {
				isOpen: false,
				type: null,
				id: null,
				name: null
			},
			modals: { ...get().modals, deleteConfirm: false }
		})
	}
}))

// Селекторы для удобства
export const useModals = () => useAdminStore((state) => state.modals)
export const useUserForm = () => useAdminStore((state) => state.userForm)
export const useTestForm = () => useAdminStore((state) => state.testForm)
export const useSelectedUser = () => useAdminStore((state) => state.selectedUser)
export const useSelectedTest = () => useAdminStore((state) => state.selectedTest)
export const useUserFilters = () => useAdminStore((state) => state.userFilters)
export const useTestFilters = () => useAdminStore((state) => state.testFilters)
export const useDeleteConfirm = () => useAdminStore((state) => state.deleteConfirm) 