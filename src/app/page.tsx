import Image from 'next/image'

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black">
			<Image
				className="relative"
				src="/next.svg"
				alt="Next.js Logo"
				width={180}
				height={37}
				priority
			/>
		</main>
	)
}
