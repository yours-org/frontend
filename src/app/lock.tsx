'use client'

import { bsv, DefaultProvider, Ripemd160, hash160, findSig, MethodCallOptions } from 'scrypt-ts'

import { PandaSigner } from '@/contracts/providers/panda'
import React from 'react'
import { Lockup } from '@/contracts/lockup'
import artifact from '../../artifacts/lockup.json'
Lockup.loadArtifact(artifact)
import useChainInfo from '@/utils/hooks/useChainInfo'

export default function Locking() {
	const { data: chainInfo } = useChainInfo()

	const handleLock = React.useCallback(async () => {
		const provider = new DefaultProvider()
		const signer = new PandaSigner(provider)

		// request authentication
		const { isAuthenticated, error } = await signer.requestAuth()
		console.log({ isAuthenticated, error })
		if (!isAuthenticated) {
			// something went wrong, throw an Error with `error` message
			throw new Error(error)
		}

		const publicKey = await signer.getIdentityPubKey()
		const address = await signer.getIdentityAddress()
		const publicKeyHash = bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer())
		const instance = new Lockup(hash160(publicKey.toString()), chainInfo.blocks + 1)

		await instance.connect(signer)
		const tx = await instance.deploy(1)

		console.log(tx.id)
	}, [chainInfo])

	const handleUnlock = React.useCallback(async () => {
		const provider = new DefaultProvider()
		const signer = new PandaSigner(provider)

		const { isAuthenticated, error } = await signer.requestAuth()
		console.log({ isAuthenticated, error })
		if (!isAuthenticated) {
			// something went wrong, throw an Error with `error` message
			throw new Error(error)
		}

		const tx = await signer.connectedProvider.getTransaction(
			'14b6be76f83b5ec19dd1317a48773948c7b09e4dfcfab98e98b1b3214be32c59'
		)

		const pubkey = await signer.getIdentityPubKey()

		const instance = Lockup.fromTx(tx, 0)

		console.log(instance.lockUntilHeight)

		await instance.connect(signer)

		const { tx: callTx, atInputIndex } = await instance.methods.redeem(
			(sigResps) => findSig(sigResps, pubkey),
			pubkey.toHex(),
			{
				pubKeyOrAddrToSign: pubkey,
				lockTime: Number(instance.lockUntilHeight) + 1,
				fromUTXO: {
					script: tx.outputs[0].script.toBuffer().toString('hex'),
					outputIndex: 0,
					satoshis: 1,
					txId: '14b6be76f83b5ec19dd1317a48773948c7b09e4dfcfab98e98b1b3214be32c59'
				}
			} as MethodCallOptions<Lock>
		)

		console.log({ callTx, atInputIndex })
	}, [chainInfo])

	return (
		<div className="flex gap-2 p-4 bg-black justify-between items-center">
			<button onClick={handleLock} className="text-white">
				Lock
			</button>
			<button onClick={handleUnlock} className="text-white">
				unlock
			</button>
		</div>
	)
}
