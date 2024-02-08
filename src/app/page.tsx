'use client'

import useWindowSize from '@/utils/hooks/useWindowSize'
import Loading from '@/components/loading'
import Chart from './chart'
import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function Home() {
	const { height, width } = useWindowSize()
	const { data, isLoading } = useSwr('https://lock.yours.org/lock-history', fetcher)
	const { data: unlockData, isLoading: isUnlockLoading } = useSwr('https://lock.yours.org/unlock-history', fetcher)

	if (!height || isLoading || isUnlockLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loading />
			</div>
		)
	}

	return (
		<main className="flex w-full">
			<Chart height={height - 96} data={data} unlockData={unlockData} />
		</main>
	)
}
