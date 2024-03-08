'use client'

import React from 'react'
import useWindowSize from '@/utils/hooks/useWindowSize'
import Loading from '@/components/loading'
import Chart from './chart'
import useLockHistory from '@/utils/hooks/useLockHistory'
import Lock from './lock'

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

	const chartHeight = 600

	return (
		<main className="flex flex-col gap-4 w-full relative px-4">
			<Chart height={chartHeight} data={data} unlockData={unlockData} mempoolData={mempoolData} />
		</main>
	)
}
