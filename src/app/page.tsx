'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
	return (
		<main className="flex flex-col gap-4 w-full relative max-w-screen-2xl container py-12">
			<div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
				<div className="flex flex-col gap-5 items-center lg:items-start">
					<h1 className="font-bold text-3xl">Yours Wallet</h1>
					<p className="text-sm text-[#D4D4D8]">
						Yours is an open-source wallet for managing your BSV, on-chain assets and more. Download
						the wallet extension to get started.
					</p>
					<div className="flex flex-col items-center gap-4 lg:flex-row">
						<a
							href="https://chromewebstore.google.com/detail/yours-wallet/mlbnicldlpdimbjdcncnklfempedeipj?pli=1"
							target="_blank"
						>
							<Button className="flex gap-2">
								<img className="h-4 w-4" src="/chrome.svg" />
								Download extension
							</Button>
						</a>
						<a href="https://github.com/yours-org/yours-wallet" target="_blank">
							<Button className="flex gap-2 border-white" variant="outline">
								<img className="h-4 w-4" src="/github.svg" />
								View Source
							</Button>
						</a>
					</div>
				</div>
				<div className="flex justify-center">
					<div className="absolute top-0 right-0 z-[-1] bg-gradient-to-l from-[#22C55E] h-[800px] w-[800px]"></div>
					<img className="w-[400px] max-w-full rounded-xl" src="/wallet.png" />
				</div>
			</div>
		</main>
	)
}
