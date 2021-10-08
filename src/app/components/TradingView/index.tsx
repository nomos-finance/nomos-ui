import dayjs from 'dayjs'
import { BarData, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import * as React from 'react'
import { memo, useEffect, useRef, useState } from 'react'

import useWindowSize from '../../hooks/useWindowSize'

interface IProps {
    className?: string
    data: BarData[]
}

const TradingView: React.FC<IProps> = memo((props: IProps): React.ReactElement => {
    const wrapDom = useRef<HTMLDivElement>(null)
    const [chart, setChart] = useState<IChartApi>()
    const width = (document.querySelector('#root')?.clientWidth as number) - 468
    const [series, setSeries] = useState<ISeriesApi<'Candlestick'>>()
    const [series1, setSeries1] = useState<ISeriesApi<'Candlestick'>>()

    useEffect(() => {
        if (series) {
            series.setData(props.data)
            // series1.setData(props.data)
            if (props.data.length) {
                const ava = props.data.reduce((t, a) => a.close + t, 0) / props.data.length
                const priceFormat = {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01
                }
                if (ava <= 0.00001) {
                    priceFormat.precision = 8
                    priceFormat.minMove = 0.00000001
                } else if (ava <= 0.0001) {
                    priceFormat.precision = 7
                    priceFormat.minMove = 0.0000001
                } else if (ava <= 0.001) {
                    priceFormat.precision = 6
                    priceFormat.minMove = 0.000001
                } else if (ava <= 0.01) {
                    priceFormat.precision = 5
                    priceFormat.minMove = 0.00001
                } else if (ava <= 0.1) {
                    priceFormat.precision = 4
                    priceFormat.minMove = 0.0001
                } else if (ava <= 1) {
                    priceFormat.precision = 3
                    priceFormat.minMove = 0.001
                }
                series.applyOptions({
                    priceFormat
                })

                // series1.applyOptions({
                //     priceFormat
                // })
            }
        }
    }, [series, props.data])

    useEffect(() => {
        if (wrapDom.current) {
            setChart(
                createChart(wrapDom.current, {
                    width,
                    height: 562,
                    timeScale: {
                        timeVisible: true,
                        borderColor: '#6A6D76',
                        barSpacing: 15,
                        secondsVisible: false,
                        lockVisibleTimeRangeOnResize: true,
                        tickMarkFormatter: (unixTime: number) => {
                            return dayjs.unix(unixTime).format('MM/DD h:mm A')
                        }
                    },
                    rightPriceScale: {
                        borderColor: '#6A6D76'
                    },
                    layout: {
                        backgroundColor: '#2D2F35',
                        textColor: '#6A6D76',
                        fontSize: 14
                    },
                    grid: {
                        horzLines: {
                            color: '#2D2F35'
                        },
                        vertLines: {
                            color: '#2D2F35'
                        }
                    }
                })
            )
        }
    }, [wrapDom])

    useEffect(() => {
        if (chart) {
            const series = chart.addCandlestickSeries({
                // const series = chart.addLineSeries({
                upColor: '#44C27F',
                downColor: '#E15C48',
                wickUpColor: '#44C27F',
                wickDownColor: '#E15C48',
                borderVisible: true
            })
            // const series1 = chart.addLineSeries({
            //     upColor: '#44C27F',
            //     downColor: '#E15C48',
            //     wickUpColor: '#44C27F',
            //     wickDownColor: '#E15C48',
            //     borderVisible: true
            // })
            // setSeries1(series1)
            setSeries(series)
        }
    }, [chart])

    const size = useWindowSize()

    useEffect(() => {
        chart?.resize((document.querySelector('#root')?.clientWidth as number) - 398, 562)
    }, [size])

    return (
        <div
            ref={wrapDom}
            style={{ position: 'relative', zIndex: 0, visibility: props.data && props.data.length ? 'visible' : 'hidden' }}
            className={props.className}
        />
    )
})

export default TradingView
