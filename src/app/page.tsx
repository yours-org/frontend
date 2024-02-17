'use client'

import React from 'react'
import useWindowSize from '@/utils/hooks/useWindowSize'
import Loading from '@/components/loading'
import Chart from './chart'
import useLockHistory from '@/utils/hooks/useLockHistory'

export default function Home() {
	const { height, width } = useWindowSize()
	const { data, unlockData, mempoolData, isLoading, isUnlockLoading } = useLockHistory()

	if (!height || isLoading || isUnlockLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loading />
			</div>
		)
	}

	const chartHeight = width < 768 ? height - 204 : height - 72

	return (
		<main className="flex w-full relative">
			<Chart height={chartHeight} data={data} unlockData={unlockData} mempoolData={mempoolData} />
		</main>
	)
}
