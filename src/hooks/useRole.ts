import { USER_ROLES, type UserRole } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { useMemo } from 'react'

export const useRole = () => {
	const { user } = useAuthStore()

	const roleChecks = useMemo(() => {
		const userRole = user?.role as UserRole

		return {
			isTeacher: userRole === USER_ROLES.TEACHER,
			isStudent: userRole === USER_ROLES.STUDENT,
			hasRole: (role: UserRole) => userRole === role,
			hasAnyRole: (roles: UserRole[]) => userRole ? roles.includes(userRole) : false,
		}
	}, [user?.role])

	return {
		user,
		role: user?.role as UserRole | undefined,
		...roleChecks,
	}
} 