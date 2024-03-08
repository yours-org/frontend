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
import useLoggedIn, { useLogin } from '@/utils/hooks/useLoggedIn'
import useWalletBalance from '@/utils/hooks/useWalletBalance'


const TABS = ['1H', '6H', '12H', '1D', '1W']

export default function Locking() {
	const { data: chainInfo } = useChainInfo()
	const [selectedTab, setSelectedTab] = React.useState('1H')
	const [loading, setLoading] = React.useState(false)
	const [value, setValue] = React.useState('')
	const { toast } = useToast()
	const { data: walletBalance } = useWalletBalance()

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
		const { Lockup, LockupArtifact } = await import( '@/contracts/lockup')
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
			toast({
				title: `${value} BSV Lock Success!`,
				description: `Your BSV will be unlockable in ${duration.name}`,
				action: (
					<ToastAction
						altText="View Tx"
						onClick={() => {
							window.open(`https://whatsonchain.com/tx/${tx.id}`, '__blank')
						}}
					>
						View Tx
					</ToastAction>
				)
			})
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

	//const handleUnlock = React.useCallback(async () => {
		//const provider = new DefaultProvider()
		//const signer = new PandaSigner(provider)

		//const { isAuthenticated, error } = await signer.requestAuth()
		//if (!isAuthenticated) {
			//// something went wrong, throw an Error with `error` message
			//throw new Error(error)
		//}

		//const tx = await signer.connectedProvider.getTransaction(
			//'14b6be76f83b5ec19dd1317a48773948c7b09e4dfcfab98e98b1b3214be32c59'
		//)

		//const pubkey = await signer.getIdentityPubKey()

		//const instance = Lockup.fromTx(tx, 0)

		//await instance.connect(signer)

		//const { tx: callTx, atInputIndex } = await instance.methods.redeem(
			//(sigResps) => findSig(sigResps, pubkey),
			//pubkey.toHex(),
			//{
				//pubKeyOrAddrToSign: pubkey,
				//lockTime: Number(instance.lockUntilHeight) + 1,
				//fromUTXO: {
					//script: tx.outputs[0].script.toBuffer().toString('hex'),
					//outputIndex: 0,
					//satoshis: 1,
					//txId: '14b6be76f83b5ec19dd1317a48773948c7b09e4dfcfab98e98b1b3214be32c59'
				//}
			//} as MethodCallOptions<Lock>
		//)

		//console.log({ callTx, atInputIndex })
	//}, [chainInfo])

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

	console.log({ isInsufficient })

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
		</Card>
	)
}
