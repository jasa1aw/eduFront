// User roles
export const USER_ROLES = {
	TEACHER: 'TEACHER',
	STUDENT: 'STUDENT',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Route paths
export const ROUTES = {
	// Auth routes
	SIGN_IN: '/sign-in',
	SIGN_UP: '/sign-up',
	SIGN_UP_TEACHER: '/sign-up-teacher',

	// Teacher routes
	TEACHER: {
		STATS: '/teacher/stats',
		TESTS: '/teacher/tests',
		TEST_DETAIL: (id: string) => `/teacher/tests/${id}`,
		CLASSES: '/teacher/classes',
		TEST_COLLECTION: '/teacher/test-collection',
		JOIN_GAME: '/teacher/join-game',
		CREATE_COMPETITION: '/teacher/create-competition',
	},

	// Student routes
	STUDENT: {
		STATS: '/student/stats',
		TESTS: '/student/tests',
		TEST_DETAIL: (id: string) => `/student/tests/${id}`,
		JOIN_GAME: '/student/join-game',
		CREATE_COMPETITION: '/student/create-competition',
	},

	// Common routes
	TEST_RESULT: (attemptId: string) => `/test-result/${attemptId}`,
	HOME: '/',
} as const

// Public paths that don't require authentication
export const PUBLIC_PATHS = [
	ROUTES.SIGN_IN,
	ROUTES.SIGN_UP,
	ROUTES.SIGN_UP_TEACHER,
	ROUTES.HOME,
] as const

// Get default route for user role
export const getDefaultRouteForRole = (role: UserRole): string => {
	switch (role) {
		case USER_ROLES.TEACHER:
			return ROUTES.TEACHER.STATS
		case USER_ROLES.STUDENT:
			return ROUTES.STUDENT.STATS
		default:
			return ROUTES.SIGN_IN
	}
} 