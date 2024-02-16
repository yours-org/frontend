import { API_URL } from '@/utils/constants'
import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useLockHistory() {
	const { data, isLoading } = useSwr(`${API_URL}/lock-history`, fetcher, {
		refreshInterval: 1000
	})
	const { data: unlockData, isLoading: isUnlockLoading } = useSwr(
		`${API_URL}/unlock-history`,
		fetcher,
		{ refreshInterval: 1000 }
	)
	const { data: mempoolData, isLoading: isMempoolLoading } = useSwr(
		`${API_URL}/mempool`,
		fetcher,
		{ refreshInterval: 1000 }
	)

	return { data, unlockData, isLoading, isUnlockLoading, mempoolData }
}
