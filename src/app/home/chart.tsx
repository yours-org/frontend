'use client'

import { createChart, ColorType } from 'lightweight-charts'
// @ts-ignore
import React, { useEffect, useRef } from 'react'
import formatNumber from '@/utils/format-number'
import useExchangeRate from '@/utils/hooks/useExchangeRate'
import classNames from 'classnames'
import useChainInfo from '@/utils/hooks/useChainInfo'
import Lock from '@/app/home/lock'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'

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
	const { data: chainInfo, isLoading, lastProcessed } = useChainInfo()
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

		//console.log({
			//lastLock,
			//lastUnlock,
			//dayAgoLock,
			//dayAgoUnlock,
			//diff: tvl - dayAgoTvl,
			//mempool: mempoolSats
		//})
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
				<TabsTrigger key={e} value={e} onClick={() => setSelectedTab(e)}>
					{e}
				</TabsTrigger>
			)
		},
		[selectedTab]
	)

	return (
		<div className="w-full flex flex-col gap-4">
			<div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardHeader>
						<CardDescription>Locked bsv</CardDescription>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img src="/bsv.svg" className="h-5 w-5" />
								{formatNumber(tvl.toFixed(2))}
							</div>
							<p
								className={classNames(
									'bg-opacity-20 px-2 h-[24px] flex items-center rounded-lg text-sm whitespace-nowrap',
									{
										['text-[#6CE9A6] bg-[#6CE9A6]']: percentChange > 0,
										['text-red-500 bg-red-500']: percentChange < 0
									}
								)}
							>
								{percentChange.toFixed(2).replace('-', '')}%
							</p>
						</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Locked usd</CardDescription>
						<CardTitle>${formatNumber((tvl * exchangeRate).toFixed(2))}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Percentage of supply locked</CardDescription>
						<CardTitle>{((tvl / totalCirculatingSupply) * 100).toFixed(2)}%</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Block height indexed</CardDescription>
						<CardTitle>
							{lastProcessed}/{chainInfo?.blocks}
						</CardTitle>
					</CardHeader>
				</Card>
			</div>
			<div className="grid grid-cols-8 gap-4">
				<Card className="relative col-span-8 lg:col-span-6">
					<Tabs className="absolute ml-4 mt-4 l-0 t-0 z-10" defaultValue={selectedTab}>
						<TabsList>{TABS.map(renderTab)}</TabsList>
					</Tabs>
					<div className="h-[600px] w-full" ref={ref} />
				</Card>
				<div className="col-span-8 lg:col-span-2">
					<Lock />
				</div>
			</div>
		</div>
	)
}
