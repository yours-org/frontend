'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { useWallet } from '@/components/layout'

interface ConnectWalletButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string
}

export function ConnectWalletButton({ label = 'Connect Wallet', className, onClick, ...props }: ConnectWalletButtonProps) {
	const { connect } = useWallet()

	return (
		<button
			type="button"
			onClick={(event) => {
				onClick?.(event)
				if (!event.defaultPrevented) {
					connect()
				}
			}}
			className={cn(
				'inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-50 transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200',
				className
			)}
			{...props}
		>
			{label}
		</button>
	)
}


