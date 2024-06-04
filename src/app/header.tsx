'use client'

import React from 'react'

export default function Header() {
	return (
		<header className="bg-black justify-between items-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex justify-between h-12 max-w-screen-xl items-center">
				<div className="flex items-center gap-4">
					<img src="/logo.svg" className="h-6" />
				</div>
				<div className="flex items-center gap-4">
					<a
						className="text-sm text-white ml-5"
						href="https://github.com/yours-org/yours-wallet"
						target="_blank"
					>
						<img className="h-4 w-4" src="/github.svg" />
					</a>
				</div>
			</div>
		</header>
	)
}
