'use client'

import { createChart, ColorType } from 'lightweight-charts'
// @ts-ignore
import React, { useEffect, useRef } from 'react'

function groupData(data, interval) {
	const groupedData = {}
	const intervalMilliseconds = {
		'5m': 5 * 60 * 1000,
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

export default function Chart(props: { height: number; data: any; unlockData: any }) {
	const { data, unlockData, height } = props
	const chartContainerRef = useRef()

	useEffect(() => {
		const groups = groupData(data, '1D')

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
					value: lockVolume / 1e8,
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
			chart.applyOptions({ width: chartContainerRef.current.clientWidth })
		}

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: colors.backgroundColor },
				textColor: colors.textColor
			},
			grid: {
				vertLines: {
					visible: false
				},
				horzLines: {
					visible: false,
				}
			},
			// @ts-ignore
			width: chartContainerRef.current.clientWidth,
			height: height
		})
		chart.timeScale().fitContent()

		var volumeSeries = chart.addHistogramSeries({
			color: '#26a69a',
			priceFormat: {
				type: 'volume'
			},
			priceScaleId: ''
		})

		volumeSeries.setData(volumeData)

		const newSeries = chart.addAreaSeries({
			lineColor: colors.lineColor,
			topColor: colors.areaTopColor,
			bottomColor: colors.areaBottomColor
		})
		newSeries.setData(parsedData)

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)

			chart.remove()
		}
	}, [data, height, unlockData])

	return <div className="h-full w-full" ref={chartContainerRef} />
}
