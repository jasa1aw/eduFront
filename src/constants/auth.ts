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
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password',

	// Teacher routes
	TEACHER: {
		STATS: '/teacher/stats',
		TESTS: '/teacher/tests',
		TEST_DETAIL: (id: string) => `/teacher/tests/${id}`,
		PROFILE: '/teacher/profile',
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
		PROFILE: '/student/profile',
		TAKE_TESTID: (id: string) => `/student/take-test/${id}`,
		TAKE_TEST: `/student/take-test`,
	},

	// Common routes
	TEST_RESULT: (attemptId: string) => `/test-result/${attemptId}`,
	CHANGE_EMAIL: '/change-email',
	HOME: '/',
	COMPETITION: (id: string) => `/competitions/${id}`,
	COMPETITION_GAME: (id: string) => `/competitions/${id}/game`,
	COMPETITION_LOBBY: (id: string) => `/competitions/${id}/lobby`,
	COMPETITION_RESULTS: (id: string) => `/competitions/${id}/results`,
	COMPETITION_DASHBOARD: (id: string) => `/competitions/${id}/dashboard`,
	COMPETITION_CREATE: '/competitions/create',
	COMPETITION_JOIN: '/competitions/join',
	COMPETITION_JOIN_BY_CODE: '/competitions/join-by-code',
} as const

// Public paths that don't require authentication
export const PUBLIC_PATHS = [
	ROUTES.SIGN_IN,
	ROUTES.SIGN_UP,
	ROUTES.SIGN_UP_TEACHER,
	ROUTES.FORGOT_PASSWORD,
	ROUTES.RESET_PASSWORD,
	ROUTES.CHANGE_EMAIL,
	ROUTES.HOME,
	ROUTES.COMPETITION_CREATE,
	ROUTES.COMPETITION_JOIN,
	ROUTES.COMPETITION_JOIN_BY_CODE,
	'/competitions/code', // Allow access to competition join by code pages
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