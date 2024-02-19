'use client'

import { createChart, ColorType } from 'lightweight-charts'
// @ts-ignore
import React, { useEffect, useRef } from 'react'
import formatNumber from '@/utils/format-number'
import useExchangeRate from '@/utils/hooks/useExchangeRate'
import classNames from 'classnames'
import Blockheight from '@/components/blockheight'

const TABS = ['1h', '4h', '6h', '12h', '1D']

function groupData(data, interval) {
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
	data: any
	unlockData: any
	mempoolData: any
}) {
	const { data, unlockData, mempoolData, height } = props
	const { exchangeRate } = useExchangeRate()
	const [selectedTab, setSelectedTab] = React.useState('1D')

	const { dayAgoTvl, tvl, percentChange } = React.useMemo(() => {
		if (!data?.length || !unlockData?.length) {
			return null
		}
		const lastLock = data.slice(-1)[0]
		const lastUnlock = unlockData
			.filter((e) => parseInt(e.height) <= parseInt(lastLock.height))
			.slice(-1)[0]

		const lastLockHeight = parseInt(lastLock.height, 10)

		const dayAgoLock = data.filter((e) => parseInt(e.height) < lastLockHeight - 144).slice(-1)[0]
		const dayAgoUnlock = unlockData
			.filter((e) => parseInt(e.height) <= parseInt(dayAgoLock.height))
			.slice(-1)[0]

		const mempoolSats = mempoolData?.sats || 0
		const tvl = (parseInt(lastLock.sum) - parseInt(lastUnlock.sum)) / 1e8
		const dayAgoTvl = (parseInt(dayAgoLock.sum) - parseInt(dayAgoUnlock.sum)) / 1e8

		console.log({
			lastLock,
			lastUnlock,
			dayAgoLock,
			dayAgoUnlock,
			diff: tvl - dayAgoTvl,
			mempool: mempoolSats
		})

		const percentChange = ((tvl - dayAgoTvl) / dayAgoTvl) * 100

		return { tvl, percentChange, dayAgoTvl }
	}, [data, unlockData, mempoolData])

	const totalCirculatingSupply = 19600000 // 19.6M

	const ref = useRef()

	useEffect(() => {
		const groups = groupData(data, selectedTab)

		const parsedData = Object.keys(groups)
			.map((key) => {
				const values = groups[key].map((e) => parseInt(e.sum))
				const maxHeight = Math.max(...groups[key].map((e) => e.height))
				const lastUnlock = unlockData
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
				const unlocks = unlockData.filter((e) => e.height >= minHeight && e.height <= maxHeight)

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
						'flex justify-center bg-[#17191E] hover:text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800 cursor-pointer text-xs rounded-lg p-2',
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
		<div className="h-full w-full relative">
			<div className="md:absolute l-0 t-0 z-10 flex flex-col px-4 gap-2">
				<p className="text-sm font-semibold text-white">Locked BSV</p>
				<div className="bg-[#17191E] rounded-lg p-4 flex justify-between gap-8 md:w-[350px] max-w-full">
					<div className="flex flex-col">
						<div className="flex gap-2 items-center">
							<img src="/bsv.svg" className="h-4 w-4" />
							<p className="text-2xl text-white whitespace-nowrap">
								{formatNumber(tvl.toFixed(2))}
							</p>
						</div>
						<p
							className={classNames('text-sm whitespace-nowrap', {
								['text-[#6CE9A6]']: percentChange > 0,
								['text-red-500']: percentChange < 0
							})}
						>
							{formatNumber(((dayAgoTvl * percentChange) / 100).toFixed(2))} (
							{percentChange.toFixed(2)}%)
						</p>
					</div>
					<div className="flex flex-col">
						<p className="text-2xl text-white whitespace-nowrap">
							${formatNumber((tvl * exchangeRate).toFixed(2))}
						</p>
						<p
							className={classNames('text-right text-sm whitespace-nowrap', {
								['text-[#6CE9A6]']: percentChange > 0,
								['text-red-500']: percentChange < 0
							})}
						>
							${formatNumber((((dayAgoTvl * percentChange) / 100) * exchangeRate).toFixed(2))}
						</p>
					</div>
				</div>
				<div className="flex flex-col bg-[#17191E] rounded-lg p-2">
					<p className="text-sm flex justify-between items-center bg-[#17191E] rounded-lg p-2">
						<span className="text-gray-300">Percent of circulating supply locked</span>
						<span>
							<span className="text-white">
								{((tvl / totalCirculatingSupply) * 100).toFixed(2)}%
							</span>
						</span>
					</p>
					<div><Blockheight /></div>
				</div>
				<div className="gap-2 grid grid-cols-5">{TABS.map(renderTab)}</div>
			</div>
			<div className="h-full w-full" ref={ref} />
		</div>
	)
}
