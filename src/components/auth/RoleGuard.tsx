'use client'

import { getDefaultRouteForRole, ROUTES, type UserRole } from '@/constants/auth'
import { useAuthStore } from '@/store/auth/authStore'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RoleGuardProps {
	children: React.ReactNode
	allowedRoles: UserRole[]
	redirectPath?: string
}

const LoadingScreen = ({ message }: { message: string }) => (
	<div className="flex items-center justify-center min-h-screen bg-[#465FF1]">
		<div className="text-white text-xl">{message}</div>
	</div>
)

export const RoleGuard: React.FC<RoleGuardProps> = ({
	children,
	allowedRoles,
	redirectPath
}) => {
	const router = useRouter()
	const { user, isAuthenticated, fetchUser, isLoading } = useAuthStore()
	const [isClient, setIsClient] = useState(false)

	const isRoleAllowed = useMemo(() => {
		return user?.role ? allowedRoles.includes(user.role as UserRole) : false
	}, [user?.role, allowedRoles])

	const getRedirectPath = useCallback(() => {
		if (redirectPath) return redirectPath
		return user?.role
			? getDefaultRouteForRole(user.role as UserRole)
			: ROUTES.SIGN_IN
	}, [redirectPath, user?.role])

	useEffect(() => {
		setIsClient(true)
	}, [])

	useEffect(() => {
		if (!isClient) return

		const token = localStorage.getItem('token')

		if (!isAuthenticated && !token) {
			router.push(ROUTES.SIGN_IN)
			return
		}

		if (isAuthenticated && !user && !isLoading) {
			fetchUser()
		}
	}, [isClient, isAuthenticated, user, isLoading, fetchUser, router])

	useEffect(() => {
		if (isClient && user && !isRoleAllowed) {
			router.push(getRedirectPath())
		}
	}, [isClient, user, isRoleAllowed, getRedirectPath, router])

	if (!isClient || !isAuthenticated || isLoading || !user) {
		return <LoadingScreen message="Загрузка..." />
	}

	if (!isRoleAllowed) {
		return <LoadingScreen message="Перенаправление..." />
	}

	return <>{children}</>
}

export default RoleGuard
