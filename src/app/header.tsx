'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function Header() {
	return (
		<header className="bg-black justify-between items-center sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex justify-between h-16 max-w-screen-xl items-center">
				<div className="flex items-center gap-4">
					<img src="/logo.svg" className="h-10" />
				</div>
				<div className="flex items-center gap-3">
					<a
						href="https://chromewebstore.google.com/detail/yours-wallet/mlbnicldlpdimbjdcncnklfempedeipj?pli=1"
						target="_blank"
						className="hidden md:block"
					>
						<Button className="bg-[linear-gradient(45deg,rgb(161,255,139),rgb(52,211,153))]">
							Download Extension
						</Button>
					</a>
					<a
						className="text-sm text-white"
						href="https://github.com/yours-org/yours-wallet"
						target="_blank"
					>
						<img className="h-4 w-4" src="/github.svg" />
					</a>
					<a className="text-sm text-white" href="https://x.com/yoursxbt" target="_blank">
						<img className="h-4 w-4" src="/twitter.svg" />
					</a>
				</div>
			</div>
		</header>
	)
}
