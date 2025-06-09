import { PUBLIC_PATHS, ROUTES, USER_ROLES, getDefaultRouteForRole, type UserRole } from '@/constants/auth'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { toast } from 'sonner'

// Интерфейс для payload токена
interface TokenPayload {
	sub: string
	role: UserRole
	exp: number
	iat: number
}

// Функция для безопасного декодирования токена
async function decodeToken(token: string): Promise<TokenPayload | null> {
	try {
		// JWT_SECRET должен быть таким же, как на бэкенде
		const secret = new TextEncoder().encode(process.env.JWT_SECRET)
		const { payload } = await jwtVerify(token, secret)
		return payload as unknown as TokenPayload
	} catch (error) {
		console.error('Failed to decode token:', error)
		return null
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Получаем токен из cookies или headers
	const token = request.cookies.get('token')?.value ||
		request.headers.get('authorization')?.replace('Bearer ', '')

	// Проверяем, является ли текущий путь публичным
	const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))

	// Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url))
	}

	// Если есть токен, декодируем его для получения роли
	if (token) {
		const payload = await decodeToken(token)

		// Если токен невалидный, удаляем его и перенаправляем на страницу входа
		if (!payload) {
			const response = NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url))
			toast.error('Неверный токен')
			response.cookies.delete('token')
			return response
		}

		// Определяем маршрут по умолчанию для роли пользователя
		const defaultRoute = getDefaultRouteForRole(payload.role)

		// Публичные страницы, с которых нужно перенаправлять авторизованных пользователей
		const publicPagesForRedirect = [
			ROUTES.HOME,
			ROUTES.SIGN_IN,
			ROUTES.SIGN_UP,
			ROUTES.SIGN_UP_TEACHER
		] as const

		// Если пользователь авторизован и находится на публичной странице, перенаправляем его
		if (publicPagesForRedirect.includes(pathname as any)) {
			return NextResponse.redirect(new URL(defaultRoute, request.url))
		}

		// Проверяем, имеет ли пользователь доступ к текущему маршруту на основе его роли
		if (payload.role === USER_ROLES.TEACHER && pathname.startsWith('/student/')) {
			return NextResponse.redirect(new URL(ROUTES.TEACHER.STATS, request.url))
		} else if (payload.role === USER_ROLES.STUDENT && pathname.startsWith('/teacher/')) {
			return NextResponse.redirect(new URL(ROUTES.STUDENT.STATS, request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)',
	],
} 