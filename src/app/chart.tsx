'use client'

import { createChart, ColorType } from 'lightweight-charts'
// @ts-ignore
import React, { useEffect, useRef } from 'react'
import formatNumber from '@/utils/format-number'
import useExchangeRate from '@/utils/hooks/useExchangeRate'
import classNames from 'classnames'

const TABS = ['1h', '4h', '6h', '12h', '1D']

function groupData(data, interval) {
	if (!Array.isArray(data) || data.length === 0) {
		return {}
	}

	const groupedData = {}
	const intervalMilliseconds = {
		'10m': 10 * 60 * 1000,
		'1h': 60 * 60 * 1000,
		'4h': 60 * 60 * 1000 * 4,
		'6h': 60 * 60 * 1000 * 6,
		'12h': 60 * 60 * 1000 * 12,
		'1D': 24 * 60 * 60 * 1000
	}

	data.forEach((item) => {
		const date = new Date(item.time * 1000)
		// Round down the date to the nearest interval
		const roundedDate = new Date(
			Math.floor(date.getTime() / intervalMilliseconds[interval]) * intervalMilliseconds[interval]
		)

		// Use the rounded date as a key for grouping
		const key = roundedDate.toISOString()
		if (!groupedData[key]) {
			groupedData[key] = []
		}
		groupedData[key].push(item)
	})

	return groupedData
}

export default function Chart(props: {
	height: number
	data: any[]
	unlockData: any[]
	mempoolData: any
}) {
	const { data, unlockData, mempoolData, height } = props
	const { exchangeRate } = useExchangeRate()
	const [selectedTab, setSelectedTab] = React.useState('1D')

	const { dayAgoTvl, tvl, percentChange, ready } = React.useMemo(() => {
		const safeData = Array.isArray(data) ? data : []
		const safeUnlockData = Array.isArray(unlockData) ? unlockData : []

		if (safeData.length === 0) {
			return {
				tvl: 0,
				percentChange: 0,
				dayAgoTvl: 0,
				ready: false
			}
		}

		if (safeUnlockData.length === 0) {
			return {
				tvl: 0,
				percentChange: 0,
				dayAgoTvl: 0,
				ready: false
			}
		}

		const lastLock = safeData.slice(-1)[0]
		const filteredUnlocks = safeUnlockData.filter(
			(e) => parseInt(e.height, 10) <= parseInt(lastLock.height, 10)
		)
		const lastUnlock = filteredUnlocks.slice(-1)[0]

		const lastLockHeight = parseInt(lastLock.height, 10)

		if (!lastUnlock) {
			return {
				tvl: 0,
				percentChange: 0,
				dayAgoTvl: 0,
				ready: false
			}
		}

		const dayAgoLock = safeData
			.filter((e) => parseInt(e.height, 10) < lastLockHeight - 144)
			.slice(-1)[0]
		if (!dayAgoLock) {
			const tvl = (parseInt(lastLock.sum, 10) - parseInt(lastUnlock.sum, 10)) / 1e8
			return {
				tvl,
				percentChange: 0,
				dayAgoTvl: tvl,
				ready: true
			}
		}

		const dayAgoUnlockCandidates = safeUnlockData.filter(
			(e) => parseInt(e.height, 10) <= parseInt(dayAgoLock.height, 10)
		)
		const dayAgoUnlock = dayAgoUnlockCandidates.slice(-1)[0]

		if (!dayAgoUnlock) {
			const tvl = (parseInt(lastLock.sum, 10) - parseInt(lastUnlock.sum, 10)) / 1e8
			return {
				tvl,
				percentChange: 0,
				dayAgoTvl: tvl,
				ready: true
			}
		}

		const tvl = (parseInt(lastLock.sum, 10) - parseInt(lastUnlock.sum, 10)) / 1e8
		const dayAgoTvl = (parseInt(dayAgoLock.sum, 10) - parseInt(dayAgoUnlock.sum, 10)) / 1e8

		const percentChange =
			dayAgoTvl === 0 ? 0 : ((tvl - dayAgoTvl) / dayAgoTvl) * 100

		return { tvl, percentChange, dayAgoTvl, ready: true }
	}, [data, unlockData, mempoolData])

	const totalCirculatingSupply = 19600000 // 19.6M

	const ref = useRef()

	useEffect(() => {
		const safeData = Array.isArray(data) ? data : []
		const safeUnlockData = Array.isArray(unlockData) ? unlockData : []
		const groups = groupData(safeData, selectedTab)

		const parsedData = Object.keys(groups)
			.map((key) => {
				const values = groups[key].map((e) => parseInt(e.sum))
				const maxHeight = Math.max(...groups[key].map((e) => e.height))
				const lastUnlock = safeUnlockData
					.filter((e) => e.height <= maxHeight)
					.reduce((a, e) => a + parseInt(e.sats), 0)

				return {
					time: groups[key][0].time,
					value: (Math.max(...values) - parseInt(lastUnlock)) / 1e8
				}
			})
			.sort((a, b) => a?.time - b?.time)

		const volumeData = Object.keys(groups)
			.map((key) => {
				const values = groups[key].map((e) => parseInt(e.sum))
				const heights = groups[key].map((e) => e.height)
				const maxHeight = Math.max(...heights)
				const minHeight = Math.min(...heights)
				const unlocks = safeUnlockData.filter((e) => e.height >= minHeight && e.height <= maxHeight)

				const lockVolume = groups[key].map((e) => parseInt(e.sats)).reduce((a, e) => a + e, 0)
				const unlockVolume = unlocks.map((e) => parseInt(e.sats)).reduce((a, e) => a + e, 0)

				return {
					time: groups[key][0].time,
					value: (lockVolume + unlockVolume) / 1e8,
					color: lockVolume > unlockVolume ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255,82,82, 0.8)'
				}
			})
			.sort((a, b) => a?.time - b?.time)

		const colors = {
			backgroundColor: 'black',
			lineColor: '#2962FF',
			textColor: 'white',
			areaTopColor: '#2962FF',
			areaBottomColor: 'rgba(41, 98, 255, 0.28)'
		}
		const handleResize = () => {
			// @ts-ignore
			chart.applyOptions({ width: ref.current.clientWidth })
		}

		const chart = createChart(ref.current, {
			layout: {
				background: { type: ColorType.Solid, color: colors.backgroundColor },
				textColor: colors.textColor
			},
			grid: {
				vertLines: {
					visible: false
				},
				horzLines: {
					visible: false
				}
			},
			rightPriceScale: {
				borderVisible: false,
				textColor: 'black'
			},
			timeScale: {
				borderVisible: false,
				timeVisible: true
			},
			//localization: {
			//priceFormatter: (p) => {
			//return `${p} BSV`
			//}
			//},

			// @ts-ignore
			width: ref.current.clientWidth,
			height: height
		})
		chart.timeScale().fitContent()

		// Locks
		const newSeries = chart.addAreaSeries({
			lineColor: '#34D399',
			topColor: 'rgba(52, 211, 153, 0.9)',
			bottomColor: 'rgba(161, 255, 139, 0.04)'
		})
		newSeries.setData(parsedData)
		//newSeries.setMarkers([
			//{
				//time: '2024-02-07',
				//position: 'inBar',
				//color: 'white',
				//shape: 'circle',
				//text: 'yours.org launch'
			//}
		//])

		// Lock Volume
		const volumeSeries = chart.addHistogramSeries({
			color: '#26a69a',
			priceFormat: {
				type: 'volume'
			},
			priceScaleId: ''
		})
		volumeSeries.setData(volumeData)

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			chart.remove()
		}
	}, [data, height, unlockData, selectedTab])

	const renderTab = React.useCallback(
		(e) => {
			return (
				<div
					className={classNames(
<<<<<<< HEAD
						'flex justify-center bg-white/[0.06] hover:text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.12] cursor-pointer text-xs rounded-full px-4 py-2 font-medium tracking-wide text-white/60',
=======
						'flex justify-center bg-[#17191E] hover:text-white transition cursor-pointer text-xs rounded-lg p-2',
>>>>>>> 08c121f (Style changes, hover state)
						{
							['text-white font-semibold']: selectedTab === e,
							['text-gray-300']: selectedTab !== e
						}
					)}
					key={e}
					onClick={() => setSelectedTab(e)}
				>
					{e}
				</div>
			)
		},
		[selectedTab]
	)

	return (
		<div className="relative h-full w-full">
			<div className="md:absolute md:left-0 md:top-0 md:z-10 flex flex-col gap-3 px-5 py-5">
				<div className="rounded-3xl border border-white/10 bg-[#0f131b]/90 p-4 shadow-[0_24px_60px_rgba(8,12,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
						Locked BSV
					</p>
					<div className="mt-4 flex items-end justify-between gap-6">
						<div>
							<div className="flex items-center gap-2">
								<img src="/bsv.svg" className="h-5 w-5" />
								<p className="text-3xl font-semibold text-white">
									{formatNumber(tvl.toFixed(2))}
								</p>
							</div>
							<p
								className={classNames('mt-2 text-sm', {
									['text-[#6CE9A6]']: percentChange > 0,
									['text-red-400']: percentChange < 0,
									['text-white/60']: percentChange === 0
								})}
							>
								{ready ? (
									<>
										{formatNumber(((dayAgoTvl * percentChange) / 100).toFixed(2))} (
										{percentChange.toFixed(2)}%)
									</>
								) : (
									'Updating…'
								)}
							</p>
						</div>
						<div className="text-right">
							<p className="text-3xl font-semibold text-white">
								${formatNumber((tvl * exchangeRate).toFixed(2))}
							</p>
							<p
								className={classNames('mt-2 text-sm', {
									['text-[#6CE9A6]']: percentChange > 0,
									['text-red-400']: percentChange < 0,
									['text-white/60']: percentChange === 0
								})}
							>
								{ready
									? `$${formatNumber((((dayAgoTvl * percentChange) / 100) * exchangeRate).toFixed(2))}`
									: '—'}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-3xl border border-white/10 bg-[#0f131b]/90 p-4 shadow-[0_24px_60px_rgba(8,12,20,0.35)]">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
						Share of circulating supply
					</p>
					<p className="mt-3 text-2xl font-semibold text-white">
						{ready ? ((tvl / totalCirculatingSupply) * 100).toFixed(2) : '—'}%
					</p>
					<p className="mt-1 text-sm text-white/60">Measured against 19.6M BSV total supply.</p>
				</div>
				<div className="grid grid-cols-5 gap-2">{TABS.map(renderTab)}</div>
			</div>
			<div className="h-full w-full" ref={ref} />
		</div>
	)
}
