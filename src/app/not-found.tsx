import Link from "next/link"

const NotFoundPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F8F9FE] via-[#F3F4F8] to-[#EEF0F7]">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-[#7C3AED] animate-pulse mb-4">404</h1>
                    <div className="w-24 h-1 bg-[#7C3AED] mx-auto rounded-full mb-6"></div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Бет табылмады
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    Кешіріңіз, бірақ біз сұралған бетті таба алмадық.
                    Мүмкін сіз қате адреске кірген шығарсыз.
                </p>

                <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-8 py-3 text-white font-semibold bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2"
                >
                    Кіру бетіне оралу
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
