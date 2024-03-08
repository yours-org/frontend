import useLockHistory from '@/utils/hooks/useLockHistory'
import useSwr from 'swr'
import Wallet from '@/utils/wallet'

const fetcher = (url) => {
	if (url.includes('undefined')) {
		return { satoshis: 0 }
	}

	return fetch(url).then((res) => res.json())
}

export default function useWalletBalance() {
	const { data, isLoading } = useSwr(
		`https://utxo-detective-bsv.twetch.app/balance/${Wallet.address}`,
		fetcher
	)

	return { data, isLoading }
}
