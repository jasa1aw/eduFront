import { PUBLIC_PATHS, ROUTES } from '@/constants/auth'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
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

	// Если пользователь аутентифицирован и пытается получить доступ к публичным страницам аутентификации
	const authPages = [ROUTES.SIGN_IN, ROUTES.SIGN_UP, ROUTES.SIGN_UP_TEACHER] as const
	if (token && authPages.includes(pathname as any)) {
		return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
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