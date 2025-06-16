'use client'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/auth'
import { useConfirmChangeEmail } from '@/hooks/auth/useConfirmChangeEmail'
import { useAuthStore } from '@/store/auth/authStore'
import { AlertTriangle, CheckCircle, Mail, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'


export default function ChangeEmailPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { user } = useAuthStore()
	const confirmChangeEmail = useConfirmChangeEmail()

	const [token, setToken] = useState<string | null>(null)
	const [tokenError, setTokenError] = useState<string>('')

	useEffect(() => {
		const tokenFromUrl = searchParams.get('token')
		setToken(tokenFromUrl)

		if (!tokenFromUrl) {
			setTokenError('Растау токені сілтемеде табылмады')
		} else {
			setTokenError('')
		}
	}, [searchParams])

	const handleVerifyEmail = () => {
		if (!token) {
			setTokenError('Растау токені табылмады')
			return
		}

		confirmChangeEmail.mutate({ token })
	}

	const handleGoToLogin = () => {
		router.push(ROUTES.SIGN_IN)
	}

	const handleGoHome = () => {
		router.push(ROUTES.HOME)
	}

	const handleGoToProfile = () => {
		if (user?.role === 'TEACHER') {
			router.push(ROUTES.TEACHER.PROFILE)
		} else if (user?.role === 'STUDENT') {
			router.push(ROUTES.STUDENT.PROFILE)
		} else {
			// Если роль неизвестна, перенаправляем на главную
			router.push(ROUTES.HOME)
		}
	}

	// Получаем статусы и данные из React Query
	const { isPending, isSuccess, isError, error } = confirmChangeEmail

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Initial State - Ready to verify */}
				{!isPending && !isSuccess && !isError && token && !tokenError && (
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Mail className="w-10 h-10 text-blue-600" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Email өзгертуді растау
						</h1>
						<p className="text-gray-600 mb-6">
							Email мекенжайыңызды өзгертуді растау үшін төмендегі түймені басыңыз.
						</p>
						<Button
							onClick={handleVerifyEmail}
							className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-3 font-medium transition-all mb-4"
						>
							Email өзгертуді растау
						</Button>
						<div className="space-y-3">
							<Button
								onClick={handleGoToLogin}
								variant="outline"
								className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3"
							>
								Аккаунтқа кіру
							</Button>
							<Button
								onClick={handleGoHome}
								variant="outline"
								className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3"
							>
								Басты бетке
							</Button>
						</div>
					</div>
				)}

				{/* Loading State */}
				{isPending && (
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Email өзгертуді растау
						</h1>
						<p className="text-gray-600">
							Сұрауыңызды өңдеп жатқан кезде күте тұрыңыз...
						</p>
					</div>
				)}

				{/* Success State */}
				{isSuccess && (
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<CheckCircle className="w-10 h-10 text-green-600" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Email сәтті өзгертілді!
						</h1>
						<div className="space-y-3">
							{user && (
								<Button
									onClick={handleGoToProfile}
									className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-3 font-medium transition-all"
								>
									Профильге өту
								</Button>
							)}
							<Button
								onClick={handleGoToLogin}
								variant={user ? "outline" : undefined}
								className={user
									? "w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3"
									: "w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg py-3 font-medium transition-all"
								}
							>
								Аккаунтқа кіру
							</Button>
							<Button
								onClick={handleGoHome}
								variant="outline"
								className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3"
							>
								Басты бетке
							</Button>
						</div>
					</div>
				)}

				{/* Error State */}
				{(isError || tokenError) && (
					<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertTriangle className="w-10 h-10 text-red-600" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">
							Растау қатесі
						</h1>
						<p className="text-gray-600 mb-6">
							{tokenError ||
								(error as any)?.response?.data?.message ||
								'Email өзгертуді растау кезінде қате орын алды'}
						</p>
						<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
							<div className="flex items-start space-x-2">
								<X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
								<div className="text-red-800 text-sm text-left">
									<p className="font-medium mb-1">Мүмкін себептер:</p>
									<ul className="list-disc list-inside space-y-1">
										<li>Сілтеме ескірген (токен 1 сағат жарамды)</li>
										<li>Сілтеме қазірдің өзінде пайдаланылған</li>
										<li>Сілтеме зақымдалған немесе толық емес</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="space-y-3">
							<Button
								onClick={handleGoToLogin}
								className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg py-3 font-medium transition-all"
							>
								Аккаунтқа кіру
							</Button>
							<Button
								onClick={handleGoHome}
								variant="outline"
								className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3"
							>
								Басты бетке
							</Button>
						</div>
						<div className="mt-6 pt-6 border-t border-gray-200">
							<p className="text-sm text-gray-500">
								Егер мәселе қайталанса,{' '}
								<Link href={ROUTES.SIGN_IN} className="text-blue-600 hover:text-blue-700 font-medium">
									пайдаланушы профилінен
								</Link>
								{' '}email өзгертуді қайта сұрауды көріңіз
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
} 