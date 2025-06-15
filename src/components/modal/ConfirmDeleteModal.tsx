'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useCallback } from 'react'

interface ConfirmDeleteModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	isLoading?: boolean
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	isLoading = false
}) => {
	const handleBackdropClick = useCallback((e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}, [onClose])

	const handleConfirm = useCallback(() => {
		onConfirm()
	}, [onConfirm])

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
				{/* Header */}
				<div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl p-6 text-white">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
						disabled={isLoading}
					>
						<X size={20} />
					</button>

					<div className="flex items-center space-x-3">
						<div className="p-3 bg-white/20 rounded-full">
							<AlertTriangle size={24} />
						</div>
						<div>
							<h2 className="text-xl font-bold">{title}</h2>
							<p className="text-red-100 text-sm mt-1">Это действие нельзя отменить</p>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="p-6">
					<p className="text-gray-700 text-center mb-6 leading-relaxed">
						{message}
					</p>

					{/* Actions */}
					<div className="flex space-x-3">
						<button
							onClick={onClose}
							disabled={isLoading}
							className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Отмена
						</button>
						<button
							onClick={handleConfirm}
							disabled={isLoading}
							className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									<span>Удаление...</span>
								</div>
							) : (
								'Удалить'
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
} 