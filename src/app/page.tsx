'use client'

import React from 'react'
import useWindowSize from '@/utils/hooks/useWindowSize'
import Loading from '@/components/loading'
import Chart from './chart'
import useLockHistory from '@/utils/hooks/useLockHistory'

export default function Home() {
	const { height, width } = useWindowSize()
	const { data, unlockData, isLoading, isUnlockLoading } = useLockHistory()

	if (!height || isLoading || isUnlockLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loading />
			</div>
		)
	}

	return (
		<main className="flex w-full relative">
			<Chart height={height - 96} data={data} unlockData={unlockData} />
		</main>
	)
}
