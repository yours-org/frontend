'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import useLoggedIn, { useLogin, useLogout } from '@/utils/hooks/useLoggedIn'
import Wallet from '@/utils/wallet'

export default function Header() {
	const [loading, setLoading] = React.useState(false)
	const loggedIn = useLoggedIn()
	const logIn = useLogin()
	const logOut = useLogout()

	const handleConnect = React.useCallback(async () => {
		setLoading(true)
		await logIn()
		setLoading(false)
	}, [logIn])

	const handleDisconnect = React.useCallback(async () => {
		logOut()
	}, [logOut])

	return (
		<div className="flex gap-2 p-4 bg-black justify-between items-center">
			<div className="flex items-center gap-4">
				<img src="/logo.svg" className="h-10" />
			</div>
			<div className="flex items-center gap-4">
				<a className="text-sm text-white ml-5" href="https://github.com/yours-org" target="_blank">
					<img className="h-4 w-4" src="/github.svg" />
				</a>
				{!loggedIn && (
					<Button disabled={loading} onClick={handleConnect} variant="gradient">
						Connect
					</Button>
				)}
				{loggedIn && (
					<Button disabled={loading} onClick={handleDisconnect} variant="gradient">
						{Wallet.address.slice(0, 4)}...{Wallet.address.slice(-4)}
					</Button>
				)}
			</div>
		</div>
	)
}
