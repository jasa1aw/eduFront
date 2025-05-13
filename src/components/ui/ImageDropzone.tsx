import React, { useEffect, useRef, useState } from "react"

interface ImageDropzoneProps {
	value?: File | null
	onChange: (file: File | null) => void
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ value, onChange }) => {
	const [preview, setPreview] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!value) setPreview(null)
	}, [value])

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (file) {
			setPreview(URL.createObjectURL(file))
			onChange(file)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setPreview(URL.createObjectURL(file))
			onChange(file)
		}
	}

	const imgSrc = preview ?? (value ? URL.createObjectURL(value) : undefined)

	return (
		<div
			className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
			onClick={() => inputRef.current?.click()}
			onDrop={handleDrop}
			onDragOver={e => e.preventDefault()}
			style={{ minHeight: 120 }}
		>
			{imgSrc ? (
				<img src={imgSrc} alt="preview" className="max-h-32 mb-2" />
			) : (
				<>
					<div className="text-4xl mb-2 text-blue-500">🖼️</div>
					<div className="text-blue-600 font-semibold">Добавить обложку</div>
				</>
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