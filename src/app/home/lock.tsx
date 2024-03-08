'use client'

import React from 'react'
import useChainInfo from '@/utils/hooks/useChainInfo'
import Loading from '@/components/loading'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import classNames from 'classnames'
import {
	Card,
	CardFooter,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import useLoggedIn, { useLogin } from '@/utils/hooks/useLoggedIn'
import useWalletBalance from '@/utils/hooks/useWalletBalance'
import { EXPLORER_URL } from '@/utils/constants'

const TABS = ['1H', '6H', '12H', '1D', '1W']

export default function Locking() {
	const { data: chainInfo } = useChainInfo()
	const [selectedTab, setSelectedTab] = React.useState('1H')
	const [loading, setLoading] = React.useState(false)
	const [value, setValue] = React.useState('')
	const [open, setOpen] = React.useState(false)
	const [params, setParams] = React.useState({
		amount: null,
		durationName: null,
		txid: null,
		height: null
	})
	const [txid, setTxid] = React.useState('')
	const { toast } = useToast()
	const { data: walletBalance } = useWalletBalance()

	const handleClose = React.useCallback(() => {
		setParams({
			amount: null,
			durationName: null,
			txid: null,
			height: null
		})
		setOpen(false)
	}, [])

	const handleViewTx = React.useCallback(() => {
		window.open(`${EXPLORER_URL}/tx/${params.txid}`, '__blank')
		handleClose()
	}, [params, handleClose])

	const handleShare = React.useCallback(() => {
		const intent = encodeURIComponent(`I just locked BSV! Check it out 👇\n https://yours.org`)
		window.open(`https://twitter.com/intent/tweet?text=${intent}`, '__blank')
		handleClose()
	}, [handleClose])

	const loggedIn = useLoggedIn()
	const logIn = useLogin()

	const handleConnect = React.useCallback(async () => {
		setLoading(true)
		await logIn()
		setLoading(false)
	}, [logIn])

	const handleChange = React.useCallback((evt) => {
		const v = evt.target.value

		if (!v) {
			return setValue(v)
		}

		const parsed = parseFloat(v)

		if (!isNaN(parsed)) {
			setValue(v)
		}
	}, [])

	const handleLock = React.useCallback(async () => {
		setLoading(true)

		// @ts-ignore
		const { bsv, DefaultProvider, Ripemd160, hash160, findSig, MethodCallOptions } = await import(
			'scrypt-ts'
		)
		const { PandaSigner } = await import('@/contracts/providers/panda')
		const { Lockup, LockupArtifact } = await import('@/contracts/lockup')
		Lockup.loadArtifact(LockupArtifact)

		try {
			const provider = new DefaultProvider()
			const signer = new PandaSigner(provider)

			// request authentication
			const { isAuthenticated, error } = await signer.requestAuth()
			if (!isAuthenticated) {
				// something went wrong, throw an Error with `error` message
				throw new Error(error)
			}

			const sats = parseInt((parseFloat(value) * 1e8).toFixed(8))

			const duration = {
				'1H': { blocks: 6, name: '1 hour' },
				'6H': { blocks: 36, name: '6 hours' },
				'12H': { blocks: 72, name: '12 hours' },
				'1D': { blocks: 144, name: '1 day' },
				'1W': { blocks: 1008, name: '1 week' }
			}[selectedTab]

			const blockHeight = chainInfo.blocks + duration.blocks

			const publicKey = await signer.getIdentityPubKey()
			const address = await signer.getIdentityAddress()
			const publicKeyHash = bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer())
			const instance = new Lockup(hash160(publicKey.toString()), blockHeight)

			await instance.connect(signer)
			const tx = await instance.deploy(sats)

			setParams({ txid: tx.id, durationName: duration.name, height: blockHeight, amount: value })
			setOpen(true)
			setValue('')
		} catch (e) {
			toast({
				variant: 'destructive',
				title: e.message
			})
			console.log(e)
		}

		setLoading(false)
	}, [chainInfo, selectedTab, value, toast])

	const renderTab = React.useCallback(
		(e) => {
			return (
				<TabsTrigger key={e} value={e} onClick={() => setSelectedTab(e)}>
					{e}
				</TabsTrigger>
			)
		},
		[selectedTab]
	)

	const isInsufficient = React.useMemo(() => {
		return parseFloat(value) > walletBalance?.satoshis / 1e8
	}, [walletBalance, value])

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Lock BSV</CardTitle>
				<CardDescription>Lock your BSV for a specified duration</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-1">
					<Label>Amount (BSV)</Label>
					<Input
						className={classNames({ ['focus-visible:ring-red-500']: isInsufficient })}
						disabled={!loggedIn}
						value={value}
						onChange={handleChange}
						placeholder="0"
					/>
					<div className="flex items-center justify-between">
						<div />
						{loggedIn && !isInsufficient && (
							<p className="text-sm text-muted-foreground">
								Available {(walletBalance?.satoshis / 1e8).toFixed(8)} BSV
							</p>
						)}
						{loggedIn && isInsufficient && (
							<p className="text-sm text-red-500">Insufficient balance</p>
						)}
					</div>
				</div>
				<div className="space-y-1">
					<Label>Duration</Label>
					<Tabs defaultValue={selectedTab}>
						<TabsList>{TABS.map(renderTab)}</TabsList>
					</Tabs>
				</div>
			</CardContent>
			<CardFooter>
				{loggedIn && (
					<Button
						variant="gradient"
						size="lg"
						className="w-full"
						disabled={loading || !value || isInsufficient}
						onClick={handleLock}
					>
						{loading && <Loading dark={true} />}
						{!loading && 'Lock BSV'}
					</Button>
				)}
				{!loggedIn && (
					<Button variant="gradient" size="lg" className="w-full" onClick={handleConnect}>
						{loading && <Loading dark={true} />}
						{!loading && 'Connect Wallet'}
					</Button>
				)}
			</CardFooter>
			<Dialog open={open}>
				<DialogContent onPointerDownOutside={handleClose} className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{params.amount} BSV Lock Success!</DialogTitle>
						<DialogDescription>
							Your BSV will be unlockable at block {params.height}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={handleViewTx} variant="outline">
							View Transaction
						</Button>
						<Button onClick={handleShare} variant="gradient">
							Share it!
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	)
}
