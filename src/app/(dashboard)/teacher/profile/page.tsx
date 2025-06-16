'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import { FormInput } from '@/components/ui/form-input'
import { LoadingButton } from '@/components/ui/loading-button'
import { USER_ROLES } from '@/constants/auth'
import { useChangeEmail } from '@/hooks/auth/useChangeEmail'
import { useUpdateProfile } from '@/hooks/auth/useUpdateProfile'
import { useAuthStore } from '@/store/auth/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit3, Mail, Save, User, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const updateProfileSchema = z.object({
	name: z.string().min(2, 'Аты кемінде 2 символдан тұруы қажет'),
	institution: z.string().min(2, 'Мекеменің атауында кемінде 2 таңба болуы керек'),
})

const changeEmailSchema = z.object({
	newEmail: z.string().email('Дұрыс емес email'),
})

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>

function TeacherProfileContent() {
	const { user } = useAuthStore()
	const updateProfile = useUpdateProfile()
	const changeEmail = useChangeEmail()

	const [isEditingProfile, setIsEditingProfile] = useState(false)
	const [isEditingEmail, setIsEditingEmail] = useState(false)

	const {
		register: registerProfile,
		handleSubmit: handleSubmitProfile,
		formState: { errors: profileErrors },
		reset: resetProfile,
	} = useForm<UpdateProfileFormValues>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user?.name || '',
			institution: user?.institution || '',
		}
	})

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: { errors: emailErrors },
		reset: resetEmail,
	} = useForm<ChangeEmailFormValues>({
		resolver: zodResolver(changeEmailSchema),
		defaultValues: {
			newEmail: '',
		}
	})

	const onSubmitProfile = (data: UpdateProfileFormValues) => {
		updateProfile.mutate(data, {
			onSuccess: () => {
				setIsEditingProfile(false)
				resetProfile({
					name: data.name,
					institution: data.institution,
				})
			}
		})
	}

	const onSubmitEmail = (data: ChangeEmailFormValues) => {
		changeEmail.mutate(data, {
			onSuccess: () => {
				setIsEditingEmail(false)
				resetEmail()
			}
		})
	}

	const handleCancelProfile = () => {
		setIsEditingProfile(false)
		resetProfile({
			name: user?.name || '',
			institution: user?.institution || '',
		})
	}

	const handleCancelEmail = () => {
		setIsEditingEmail(false)
		resetEmail()
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-xl text-gray-600">Профильді жүктеу...</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
					<div className="flex items-center space-x-6">
						<div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							{user.name?.charAt(0).toUpperCase()}
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
							<p className="text-lg text-gray-600">{user.institution}</p>
							<div className="flex items-center space-x-2 mt-2">
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
									<User size={14} className="mr-1" />
									Мұғалім
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Profile Information */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">Профиль ақпараты</h2>
						{!isEditingProfile && (
							<button
								onClick={() => setIsEditingProfile(true)}
								className="flex items-center space-x-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
							>
								<Edit3 size={16} />
								<span>Өңдеу</span>
							</button>
						)}
					</div>

					{isEditingProfile ? (
						<form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormInput
									id="name"
									label="Аты"
									type="text"
									placeholder="Атыңызды енгізіңіз"
									error={profileErrors.name}
									{...registerProfile("name")}
									className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
								/>
								<FormInput
									id="institution"
									label="Мекеме"
									type="text"
									placeholder="Мекеменің атауын енгізіңіз"
									error={profileErrors.institution}
									{...registerProfile("institution")}
									className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
								/>
							</div>

							<div className="flex space-x-3">
								<LoadingButton
									type="submit"
									isLoading={updateProfile.isPending}
									loadingText="Сақталуда..."
									className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
								>
									<Save size={16} />
									<span>Сақтау</span>
								</LoadingButton>
								<button
									type="button"
									onClick={handleCancelProfile}
									className="px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center space-x-2"
								>
									<X size={16} />
									<span>Күшін жою</span>
								</button>
							</div>
						</form>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="text-sm font-medium text-gray-500">Аты</label>
								<p className="mt-1 text-lg text-gray-900">{user.name}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">Мекеме</label>
								<p className="mt-1 text-lg text-gray-900">{user.institution || 'Берілмеген'}</p>
							</div>
						</div>
					)}
				</div>

				{/* Email Settings */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-gray-900">Email</h2>
						{!isEditingEmail && (
							<button
								onClick={() => setIsEditingEmail(true)}
								className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
							>
								<Mail size={16} />
								<span>Email өңдеу</span>
							</button>
						)}
					</div>

					{isEditingEmail ? (
						<form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-6">
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-gray-500">Ағымдағы email</label>
									<p className="mt-1 text-lg text-gray-900">{user.email}</p>
								</div>
								<FormInput
									id="newEmail"
									label="Жаңа email"
									type="email"
									placeholder="Жаңа emailді енгізіңіз"
									error={emailErrors.newEmail}
									{...registerEmail("newEmail")}
									className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
								/>
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<p className="text-blue-800 text-sm">
										📧 Жаңа emailге сілтеме жіберіледі
									</p>
								</div>
							</div>

							<div className="flex space-x-3">
								<LoadingButton
									type="submit"
									isLoading={changeEmail.isPending}
									loadingText="Жіберуде..."
									className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all flex items-center space-x-2"
								>
									<Mail size={16} />
									<span>Растау</span>
								</LoadingButton>
								<button
									type="button"
									onClick={handleCancelEmail}
									className="px-6 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium flex items-center space-x-2"
								>
									<X size={16} />
									<span>Күшін жою</span>
								</button>
							</div>
						</form>
					) : (
						<div>
							<label className="text-sm font-medium text-gray-500">Ағымдағы email</label>
							<p className="mt-1 text-lg text-gray-900">{user.email}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default function TeacherProfilePage() {
	return (
		<RoleGuard allowedRoles={[USER_ROLES.TEACHER]}>
			<TeacherProfileContent />
		</RoleGuard>
	)
}
