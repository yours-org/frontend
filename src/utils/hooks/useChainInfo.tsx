import useLockHistory from '@/utils/hooks/useLockHistory'
import useSwr from 'swr'
// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function useChainInfo() {
	const { data: lockHistoryData } = useLockHistory()
	const { data, isLoading } = useSwr(
		'https://api.whatsonchain.com/v1/bsv/main/chain/info',
		fetcher,
		{
			refreshInterval: 30000
		}
	)

	const tip = (data?.blocks) || 0
	
	const historyTip = lockHistoryData ? parseInt(lockHistoryData?.slice(-1)?.[0]?.height, 10) : 0
	const lastProcessed = historyTip;
	//console.log({ tip, historyTip, blockDiff: tip - historyTip })

	return { data, isLoading, lastProcessed}
}
