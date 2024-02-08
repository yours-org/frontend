import type { Metadata } from 'next'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Yours',
	description: 'Your Bitcoin.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="">
			<body className={`${inter.className} bg-black`}>
				<div className="flex gap-2 p-4 bg-black">
					<img src="/logo.svg" className="h-16" />
				</div>
				{children}
			</body>
		</html>
	)
}
