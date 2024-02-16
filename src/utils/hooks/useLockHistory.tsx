import { API_URL } from '@/utils/constants'
import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useLockHistory() {
	const { data, isLoading } = useSwr(`${API_URL}/lock-history`, fetcher, {
		refreshInterval: 5000
	})
	const { data: unlockData, isLoading: isUnlockLoading } = useSwr(
		`${API_URL}/unlock-history`,
		fetcher,
		{ refreshInterval: 5000 }
	)
	const { data: mempoolData, isLoading: isMempoolLoading } = useSwr(`${API_URL}/mempool`, fetcher, {
		refreshInterval: 2000
	})

	const mempoolSats = mempoolData?.sats || 0

	return {
		data: data
			? data.map((e, i) => {
					if (i === data.length - 1) {
						return {
							...e,
							sum: `${parseInt(e.sum) + mempoolSats}`,
							sats: `${parseInt(e.sats) + mempoolSats}`
						}
					}

					return e
			  })
			: null,
		unlockData,
		isLoading,
		isUnlockLoading,
		mempoolData
	}
}
