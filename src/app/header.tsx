'use client'

import React from 'react'
import useChainInfo from '@/utils/hooks/useChainInfo'

export default function Header() {
	useChainInfo();

	return (
		<div className="flex gap-2 p-4 bg-black justify-between items-center">
			<div className="flex items-center">
				<img src="/logo.svg" className="h-10" />
			</div>
			<a
				className="text-sm text-white ml-5"
				href="https://github.com/yours-org"
				target="_blank"
			>
				<img className="h-4 w-4" src="/github.svg" />
			</a>
		</div>
	)
}
