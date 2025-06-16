import { Loader2 } from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F8F9FE]/90 via-[#F3F4F8]/90 to-[#EEF0F7]/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6 p-8 bg-white/80 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-[#7C3AED] animate-spin" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-[#8B5CF6]/30 rounded-full animate-pulse"></div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700 mb-2">Жүктелуде...</p>
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#7C3AED] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen 