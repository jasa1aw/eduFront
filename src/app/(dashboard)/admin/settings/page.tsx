'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
	AlertCircle,
	Bell,
	CheckCircle,
	Clock,
	Eye,
	EyeOff,
	Globe,
	Mail,
	RotateCcw,
	Save,
	Server,
	Shield,
	Users
} from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
	const [showSMTPPassword, setShowSMTPPassword] = useState(false)
	const [showDBPassword, setShowDBPassword] = useState(false)
	const [settings, setSettings] = useState({
		// Общие настройки
		siteName: 'TestiQ',
		siteDescription: 'Платформа для онлайн тестирования',
		maintenanceMode: false,

		// Настройки пользователей
		allowRegistration: true,
		requireEmailVerification: true,
		passwordMinLength: 8,
		sessionTimeout: 24,
		maxLoginAttempts: 5,

		// Настройки тестирования
		maxTestDuration: 180,
		defaultTestDuration: 60,
		allowTestRetake: true,
		maxRetakeAttempts: 3,

		// Настройки email
		smtpEnabled: true,
		smtpServer: 'smtp.gmail.com',
		smtpPort: 587,
		smtpUsername: 'admin@testiq.com',
		smtpPassword: '',

		// Настройки уведомлений
		emailNotifications: true,
		testCompletionNotifications: true,
		systemAlerts: true,

		// Настройки безопасности
		enableTwoFactor: false,
		sessionSecure: true,
		passwordComplexity: true,

		// Настройки базы данных
		dbBackupEnabled: true,
		dbBackupInterval: 24,
		dbPassword: '',

		// Настройки производительности
		cacheEnabled: true,
		cacheTimeout: 3600,
		enableLogging: true,
		logLevel: 'info'
	})

	const handleSettingChange = (key: string, value: any) => {
		setSettings(prev => ({
			...prev,
			[key]: value
		}))
	}

	const handleSave = () => {
		console.log('Сохранение настроек:', settings)
		// Здесь будет API вызов для сохранения настроек
	}

	const handleReset = () => {
		// Сброс к значениям по умолчанию
		console.log('Сброс настроек')
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
						Настройки системы
					</h1>
					<p className="text-gray-600 mt-2">
						Конфигурация и настройки платформы TestiQ
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={handleReset} className="gap-2">
						<RotateCcw className="h-4 w-4" />
						Сбросить
					</Button>
					<Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
						<Save className="h-4 w-4" />
						Сохранить
					</Button>
				</div>
			</div>

			{/* Общие настройки */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Globe className="h-5 w-5 text-blue-600" />
						Общие настройки
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Название сайта</label>
							<Input
								value={settings.siteName}
								onChange={(e) => handleSettingChange('siteName', e.target.value)}
								placeholder="TestiQ"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Описание сайта</label>
							<Input
								value={settings.siteDescription}
								onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
								placeholder="Платформа для онлайн тестирования"
							/>
						</div>
					</div>
					<div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
						<div className="flex items-center gap-3">
							<AlertCircle className="h-5 w-5 text-yellow-600" />
							<div>
								<p className="font-medium text-yellow-900">Режим обслуживания</p>
								<p className="text-sm text-yellow-700">Временно отключить доступ к сайту</p>
							</div>
						</div>
						<Switch
							checked={settings.maintenanceMode}
							onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Настройки пользователей */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5 text-green-600" />
						Настройки пользователей
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Разрешить регистрацию</p>
									<p className="text-sm text-gray-600">Позволить новым пользователям регистрироваться</p>
								</div>
								<Switch
									checked={settings.allowRegistration}
									onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Подтверждение email</p>
									<p className="text-sm text-gray-600">Требовать подтверждение email при регистрации</p>
								</div>
								<Switch
									checked={settings.requireEmailVerification}
									onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Минимальная длина пароля</label>
								<Input
									type="number"
									value={settings.passwordMinLength}
									onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
									min="6"
									max="20"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Тайм-аут сессии (часы)</label>
								<Input
									type="number"
									value={settings.sessionTimeout}
									onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
									min="1"
									max="168"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Максимум попыток входа</label>
								<Input
									type="number"
									value={settings.maxLoginAttempts}
									onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
									min="3"
									max="10"
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Настройки тестирования */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-purple-600" />
						Настройки тестирования
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Максимальная продолжительность теста (минуты)</label>
								<Input
									type="number"
									value={settings.maxTestDuration}
									onChange={(e) => handleSettingChange('maxTestDuration', parseInt(e.target.value))}
									min="15"
									max="300"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Продолжительность по умолчанию (минуты)</label>
								<Input
									type="number"
									value={settings.defaultTestDuration}
									onChange={(e) => handleSettingChange('defaultTestDuration', parseInt(e.target.value))}
									min="15"
									max="180"
								/>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Разрешить пересдачу</p>
									<p className="text-sm text-gray-600">Позволить пользователям пересдавать тесты</p>
								</div>
								<Switch
									checked={settings.allowTestRetake}
									onCheckedChange={(checked) => handleSettingChange('allowTestRetake', checked)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Максимум попыток пересдачи</label>
								<Input
									type="number"
									value={settings.maxRetakeAttempts}
									onChange={(e) => handleSettingChange('maxRetakeAttempts', parseInt(e.target.value))}
									min="1"
									max="10"
									disabled={!settings.allowTestRetake}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Настройки email */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Mail className="h-5 w-5 text-red-600" />
						Настройки email
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
						<div className="flex items-center gap-3">
							<Mail className="h-5 w-5 text-blue-600" />
							<div>
								<p className="font-medium text-blue-900">SMTP сервер</p>
								<p className="text-sm text-blue-700">Включить отправку email через SMTP</p>
							</div>
						</div>
						<Switch
							checked={settings.smtpEnabled}
							onCheckedChange={(checked) => handleSettingChange('smtpEnabled', checked)}
						/>
					</div>
					{settings.smtpEnabled && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">SMTP сервер</label>
									<Input
										value={settings.smtpServer}
										onChange={(e) => handleSettingChange('smtpServer', e.target.value)}
										placeholder="smtp.gmail.com"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">Порт</label>
									<Input
										type="number"
										value={settings.smtpPort}
										onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
										placeholder="587"
									/>
								</div>
							</div>
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">Имя пользователя</label>
									<Input
										value={settings.smtpUsername}
										onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
										placeholder="admin@testiq.com"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700">Пароль</label>
									<div className="relative">
										<Input
											type={showSMTPPassword ? 'text' : 'password'}
											value={settings.smtpPassword}
											onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
											placeholder="Пароль SMTP"
										/>
										<button
											type="button"
											onClick={() => setShowSMTPPassword(!showSMTPPassword)}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											{showSMTPPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Настройки уведомлений */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5 text-yellow-600" />
						Настройки уведомлений
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Email уведомления</p>
							<p className="text-sm text-gray-600">Отправлять уведомления по email</p>
						</div>
						<Switch
							checked={settings.emailNotifications}
							onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Уведомления о завершении тестов</p>
							<p className="text-sm text-gray-600">Уведомлять о завершении тестов студентами</p>
						</div>
						<Switch
							checked={settings.testCompletionNotifications}
							onCheckedChange={(checked) => handleSettingChange('testCompletionNotifications', checked)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Системные уведомления</p>
							<p className="text-sm text-gray-600">Получать системные уведомления и предупреждения</p>
						</div>
						<Switch
							checked={settings.systemAlerts}
							onCheckedChange={(checked) => handleSettingChange('systemAlerts', checked)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Настройки безопасности */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-red-600" />
						Настройки безопасности
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Двухфакторная аутентификация</p>
							<p className="text-sm text-gray-600">Включить 2FA для администраторов</p>
						</div>
						<Switch
							checked={settings.enableTwoFactor}
							onCheckedChange={(checked) => handleSettingChange('enableTwoFactor', checked)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Безопасные сессии</p>
							<p className="text-sm text-gray-600">Использовать безопасные cookies</p>
						</div>
						<Switch
							checked={settings.sessionSecure}
							onCheckedChange={(checked) => handleSettingChange('sessionSecure', checked)}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<p className="font-medium text-gray-900">Сложность паролей</p>
							<p className="text-sm text-gray-600">Требовать сложные пароли</p>
						</div>
						<Switch
							checked={settings.passwordComplexity}
							onCheckedChange={(checked) => handleSettingChange('passwordComplexity', checked)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Настройки производительности */}
			<Card className="border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Server className="h-5 w-5 text-indigo-600" />
						Настройки производительности
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Кеширование</p>
									<p className="text-sm text-gray-600">Включить кеширование для повышения производительности</p>
								</div>
								<Switch
									checked={settings.cacheEnabled}
									onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Время жизни кеша (секунды)</label>
								<Input
									type="number"
									value={settings.cacheTimeout}
									onChange={(e) => handleSettingChange('cacheTimeout', parseInt(e.target.value))}
									min="300"
									max="86400"
									disabled={!settings.cacheEnabled}
								/>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Логирование</p>
									<p className="text-sm text-gray-600">Включить системное логирование</p>
								</div>
								<Switch
									checked={settings.enableLogging}
									onCheckedChange={(checked) => handleSettingChange('enableLogging', checked)}
								/>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">Уровень логирования</label>
								<select
									value={settings.logLevel}
									onChange={(e) => handleSettingChange('logLevel', e.target.value)}
									disabled={!settings.enableLogging}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
								>
									<option value="debug">Debug</option>
									<option value="info">Info</option>
									<option value="warn">Warning</option>
									<option value="error">Error</option>
								</select>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Сохранение настроек */}
			<div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
				<div className="text-center">
					<CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
					<p className="text-lg font-semibold text-gray-900 mb-2">Настройки готовы к сохранению</p>
					<p className="text-sm text-gray-600 mb-4">Убедитесь, что все параметры настроены правильно</p>
					<Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
						<Save className="h-4 w-4" />
						Сохранить все настройки
					</Button>
				</div>
			</div>
		</div>
	)
} 