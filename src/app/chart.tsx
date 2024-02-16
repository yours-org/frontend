import React, { useEffect, useRef, useState } from 'react';
import Chart from 'react-apexcharts';
import formatNumber from '@/utils/format-number';
import useExchangeRate from '@/utils/hooks/useExchangeRate';
import classNames from 'classnames';

const TABS = ['1h', '4h', '6h', '12h', '1D'];

function groupData(data, interval) {
    const groupedData = {};
    const intervalMilliseconds = {
        '10m': 10 * 60 * 1000,
        '1h': 60 * 60 * 1000,
        '4h': 60 * 60 * 1000 * 4,
        '6h': 60 * 60 * 1000 * 6,
        '12h': 60 * 60 * 1000 * 12,
        '1D': 24 * 60 * 60 * 1000
    };

    data.forEach((item) => {
        const date = new Date(item.time * 1000);
        const roundedDate = new Date(
            Math.floor(date.getTime() / intervalMilliseconds[interval]) * intervalMilliseconds[interval]
        );

        const key = roundedDate.toISOString();
        if (!groupedData[key]) {
            groupedData[key] = [];
        }
        groupedData[key].push(item);
    });

    return groupedData;
}

export default function ChartComponent(props) {
    const { data, unlockData, height } = props;
    const { exchangeRate } = useExchangeRate();
    const [selectedTab, setSelectedTab] = useState('1D');
    const [chartType, setChartType] = useState('area');
    const chartRef = useRef(null);
    const [showPieChart, setShowPieChart] = useState(false);

    useEffect(() => {
        const groups = groupData(data, selectedTab);

        const lockedData = Object.keys(groups).map((key) => {
            const totalLocked = groups[key].reduce((acc, curr) => acc + parseInt(curr.sum), 0);
            return {
                x: new Date(key).getTime(),
                y: totalLocked
            };
        });

        if (chartRef.current) {
            chartRef.current.chart.updateSeries([{ name: 'Locked', data: lockedData }]);
        }
    }, [data, height, selectedTab]);

    const tvl = React.useMemo(() => {
        if (!data?.length || !unlockData?.length) {
            return null;
        }
        const lastLock = data.slice(-1)[0];
        const lastUnlock = unlockData.filter((e) => parseInt(e.height) <= parseInt(lastLock.height)).slice(-1)[0];
        return (parseInt(lastLock.sum) - parseInt(lastUnlock.sum)) / 1e8;
    }, [data, unlockData]);

    const renderTab = (e) => {
        return (
            <div
                className={classNames(
                    'flex justify-center bg-[#17191E] cursor-pointer text-xs rounded-lg p-2 font-semibold shadow-md',
                    {
                        ['text-white']: selectedTab === e,
                        ['text-[#D0D5DD]']: selectedTab !== e,
                        ['bg-blue-500']: selectedTab === e // Adding blue background when selected
                    }
                )}
                key={e}
                onClick={() => setSelectedTab(e)}
            >
                {e}
            </div>
        );
    };

    const handleChartTypeChange = (type) => {
        setChartType(type);
        if (type === 'line') {
            setSelectedTab('4h'); // Set default time interval to 4 hours for Line Chart
        }
    };

    const togglePieChart = () => {
        setShowPieChart(!showPieChart);
    };

    return (
        <div className="h-full w-full relative">
            <div className="md:absolute l-0 t-0 z-10 flex flex-col px-4 gap-2">
                <p className="text-sm font-semibold text-white">Locked Coins</p>
                <div className="bg-[#17191E] rounded-lg p-4 flex justify-between gap-8">
                    <div className="flex gap-2 items-center">
                        <img src="/bsv.svg" className="h-4 w-4" alt="BSV" />
                        <p className="text-2xl text-white whitespace-nowrap">{formatNumber(tvl.toFixed(2))}</p>
                    </div>
                    <div>
                        <p className="text-2xl text-white whitespace-nowrap">
                            ${formatNumber((tvl * exchangeRate).toFixed(2))}
                        </p>
                    </div>
                </div>
                <div className="gap-2 grid grid-cols-5">{TABS.map(renderTab)}</div>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => handleChartTypeChange('line')}
                        className={classNames(
                            'text-white bg-[#17191E] cursor-pointer text-xs rounded-lg p-2 font-semibold shadow-md',
                            { 'text-[#2962FF] bg-blue-500': chartType === 'line' }
                        )}
                    >
                        Line Chart
                    </button>
                    <button
                        onClick={() => handleChartTypeChange('area')}
                        className={classNames(
                            'text-white bg-[#17191E] cursor-pointer text-xs rounded-lg p-2 font-semibold shadow-md',
                            { 'text-[#2962FF] bg-blue-500': chartType === 'area' }
                        )}
                    >
                        Area Chart
                    </button>
                    <button
                        onClick={togglePieChart}
                        className={classNames(
                            'text-white bg-[#17191E] cursor-pointer text-xs rounded-lg p-2 font-semibold shadow-md',
                            { 'text-[#2962FF] bg-blue-500': showPieChart }
                        )}
                    >
                        Pie Chart
                    </button>
                </div>
            </div>
            <div className="h-full w-full">
                {showPieChart ? (
                    <Chart options={pieChartOptions} series={[tvl, 21_000_000 - tvl]} type="pie" width="100%" height="100%" />
                ) : (
                    <Chart options={chartOptions[chartType]} series={[{ data: [] }]} type={chartType} height={height} ref={chartRef} />
                )}
            </div>
        </div>
    );
}

const pieChartOptions = {
    labels: ['Locked', 'Unlocked'],
    colors: ['#00FF00', '#FF1744']
};

const chartOptions = {
    line: {
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#BDBDBD',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#BDBDBD',
                    fontSize: '12px'
                },
                formatter: function (val) {
                    return formatNumber(val);
                }
            },
            title: {
                text: 'Locked Sats'
            }
        },
        grid: {
            borderColor: '#303030',
            strokeDashArray: 4,
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 1,
        },
        colors: ['#00E676', '#FF1744'],
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: 'dd MMM yyyy'
            },
            y: {
                formatter: function (val) {
                    return formatNumber(val);
                }
            }
        },
        markers: {
            size: 0
        }
    },
    area: {
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#BDBDBD',
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#BDBDBD',
                    fontSize: '12px'
                },
                formatter: function (val) {
                    return formatNumber(val);
                }
            },
            title: {
                text: 'Locked Sats'
            }
        },
        grid: {
            borderColor: '#303030',
            strokeDashArray: 4,
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 1,
        },
        colors: ['#00E676'], 
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: 'dd MMM yyyy'
            },
            y: {
                formatter: function (val) {
                    return formatNumber(val);
                }
            }
        },
        markers: {
            size: 0
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        }
    }
};
