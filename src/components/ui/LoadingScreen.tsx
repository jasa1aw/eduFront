interface LoadingScreenProps {
	message?: string
}

export const LoadingScreen = ({ message = "Загрузка..." }: LoadingScreenProps) => (
	<div className="flex items-center justify-center min-h-screen bg-[#465FF1]">
		<div className="text-white text-xl">{message}</div>
	</div>
) 