import Image from "next/image"
import React from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex min-h-screen">
			<section className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#804EED] via-[#9B6EF7] to-[#6B46C1] p-10">
				<div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12 text-center">
					<div className="space-y-2">
						<div className="text-white text-sm font-medium bg-white/20 rounded-full px-4 py-2 inline-block">
							5 Minute School
						</div>
						<h1 className="text-4xl font-bold text-white leading-tight">
							Learn From World's<br />
							Best Instructors 👨‍🎓<br />
							Around The World.
						</h1>
					</div>

					<div className="flex justify-center">
						<Image
							src="/assets/icons/authIcon.png"
							alt="Auth illustration"
							width={300}
							height={300}
							className="transition-all hover:scale-105"
						/>
					</div>
				</div>
			</section>

			<section className="flex flex-1 flex-col items-center justify-center bg-white p-10">
				<div className="w-full max-w-md">
					{children}
				</div>
			</section>
		</div>
	)
}

export default Layout
