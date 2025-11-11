import { API_URL } from '@/utils/constants'
import useSwr from 'swr'
import type { LockHistoryEntry, UnlockHistoryEntry } from '@/types/lock-history'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

type MempoolResponse = {
	sats?: number
}

type UseLockHistoryResult = {
	data: LockHistoryEntry[] | null
	unlockData: UnlockHistoryEntry[] | null
	isLoading: boolean
	isUnlockLoading: boolean
	mempoolData: MempoolResponse | null
}

export default function useLockHistory(): UseLockHistoryResult {
	const { data, isLoading } = useSwr<LockHistoryEntry[]>(`${API_URL}/lock-history`, fetcher, {
		refreshInterval: 5000
	})
	const { data: unlockData, isLoading: isUnlockLoading } = useSwr<UnlockHistoryEntry[]>(
		`${API_URL}/unlock-history`,
		fetcher,
		{ refreshInterval: 5000 }
	)
	const { data: mempoolData } = useSwr<MempoolResponse>(
		`${API_URL}/mempool`,
		fetcher,
		{
			refreshInterval: 2000
		}
	)

	const mempoolSats = mempoolData?.sats || 0

	return {
		data: data
			? data.map((e, i) => {
					if (i === data.length - 1) {
						return {
							...e,
							sum: `${parseInt(e.sum, 10) + mempoolSats}`,
							sats: `${parseInt(e.sats, 10) + mempoolSats}`
						}
					}

					return e
			  })
			: null,
		unlockData: unlockData ?? null,
		isLoading,
		isUnlockLoading,
		mempoolData: mempoolData ?? null
	}
}
