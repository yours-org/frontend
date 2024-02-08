import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useLockHistory() {
	const { data, isLoading } = useSwr('https://lock.yours.org/lock-history', fetcher, {
		refreshInterval: 10000
	})
	const { data: unlockData, isLoading: isUnlockLoading } = useSwr(
		'https://lock.yours.org/unlock-history',
		fetcher,
		{ refreshInterval: 10000 }
	)

	return { data, unlockData, isLoading, isUnlockLoading }
}
