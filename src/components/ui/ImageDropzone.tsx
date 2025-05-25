import React, { useEffect, useRef, useState } from "react"

interface ImageDropzoneProps {
	value?: File | null
	// value?: string | Blob
	onChange: (file: File | null) => void
	// onChange: (file: File | Blob) => void
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ value, onChange }) => {
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!value) {
			setPreview(null)
		} else {
			setPreview(URL.createObjectURL(value))
		}
	}, [value])

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file && file.type.startsWith('image/')) {
			onChange(file)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			onChange(file)
		}
	}

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation()
		onChange(null)
		if (inputRef.current) {
			inputRef.current.value = ''
		}
	}

	const handleClick = () => {
		if (!value) {
			inputRef.current?.click()
		}
	}

	return (
		<div className="w-full">
			{value && preview ? (
				<div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-3">
					<div className="flex items-center justify-center">
						<img
							src={preview}
							alt="Предварительный просмотр"
							className="max-h-32 max-w-full object-contain rounded-lg"
						/>
					</div>
					<button
						onClick={handleRemoveImage}
						className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
						title="Удалить изображение"
					>
						✕
					</button>
					<div className="mt-3 text-center">
						<button
							onClick={() => inputRef.current?.click()}
							className="text-blue-600 hover:text-blue-700 text-sm font-medium"
						>
							Изменить изображение
						</button>
					</div>
				</div>
			) : (
				<div
					className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
					onClick={handleClick}
					onDrop={handleDrop}
					onDragOver={e => e.preventDefault()}
				>
					<div className="text-3xl mb-2 text-gray-400">📷</div>
					<div className="text-gray-600 font-medium mb-1">Добавить изображение</div>
					<div className="text-gray-400 text-sm">Перетащите файл или нажмите для выбора</div>
				</div>
			)}
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleChange}
			/>
		</div>
	)
}

export default ImageDropzone 