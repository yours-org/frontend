'use client'

import React from 'react'
import useWindowSize from '@/utils/hooks/useWindowSize'
import Loading from '@/components/loading'
import Chart from '@/app/home/chart'
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

	return (
		<main className="flex flex-col gap-4 w-full relative px-4">
			<Chart height={600} data={data} unlockData={unlockData} mempoolData={mempoolData} />
		</main>
	)
}
