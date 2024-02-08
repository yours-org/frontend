'use client'

import React from 'react'
import useLockHistory from '@/utils/hooks/useLockHistory'
import useExchangeRate from '@/utils/hooks/useExchangeRate'
import formatNumber from '@/utils/format-number'

export default function Header() {
	const { data, unlockData, isLoading, isUnlockLoading } = useLockHistory()
	const { exchangeRate } = useExchangeRate()

	const tvl = React.useMemo(() => {
		if (!data?.length || !unlockData?.length) {
			return null
		}
		const lastLock = data.slice(-1)[0]
		const lastUnlock = unlockData
			.filter((e) => parseInt(e.height) <= parseInt(lastLock.height))
			.slice(-1)[0]
		return (parseInt(lastLock.sum) - parseInt(lastUnlock.sum)) / 1e8
	}, [data, unlockData])

	return (
		<div className="flex gap-2 p-4 bg-black justify-between">
			<img src="/logo.svg" className="h-16" />
			{!isLoading && !isUnlockLoading && (
				<div className="flex flex-col">
					<p className="text-xs text-slate-400">TVL</p>
					<p className="text-md text-white">{formatNumber(tvl.toFixed(2))} BSV</p>
					<p className="text-md text-white">${formatNumber((tvl * exchangeRate).toFixed(2))}</p>
				</div>
			)}
		</div>
	)
}
