export type LockHistoryEntry = {
	time: number
	height: number | string
	sum: string
	sats: string
}

export type UnlockHistoryEntry = {
	height: number | string
	sum: string
	sats: string
	time?: number
}
