import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getFundHistory } from '@api/fund';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { childIdAtom } from '@store/childIdsAtom.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ParentFundProfitGraph() {
    const childId = useRecoilValue(childIdAtom);
    console.log('ParentFundProfitGraph childId', childId);

    const [statementdata, setStatementdata] = useState([]);
    const [rateList, setRateList] = useState([]);

    useEffect(() => {
        getFundHistory(
            childId,
            (success) => {
                setStatementdata(success.data.FundHistory);
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            console.log('ChildManagement userEffect return');
        };
    }, []);

    useEffect(() => {
        if (statementdata) {
            const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
            const endOfThisWeek = endOfWeek(new Date(), { weekStartsOn: 1 });
            const eachDayThisWeek = eachDayOfInterval({ start: startOfThisWeek, end: endOfThisWeek });

            const thisWeekData = eachDayThisWeek.map((day) => {
                const formattedDay = format(day, 'yyyy-MM-dd');
                const foundItem = statementdata.find((item) => {
                    const itemDate = parseISO(item.dataLog);
                    return isSameDay(itemDate, day);
                });

                if (foundItem) {
                    return foundItem;
                } else {
                    return { dataLog: formattedDay, seedMoney: 0, yield: 0, pnl: 0, childId: 0 };
                }
            });

            const tempRateList = [];
            thisWeekData.map((data) => {
                let sign = data.pnl < data.seedMoney ? -1 : 1;
                tempRateList.push(sign * data.yield);
            });

            setRateList(tempRateList);
        }
    }, [statementdata]);

    const options = {
        plugins: {
            title: {
                display: true,
                text: '투자 이익률 그래프',
                font: {
                    size: 18, // 원하는 폰트 크기로 조절
                },
                color: 'var(--nav-background)',
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = ['월', '화', '수', '목', '금', '토', '일'];

    const data = {
        labels,
        datasets: [
            {
                label: '이익률',
                data: rateList,
                backgroundColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 0 ? '#F1554C' : '#4285F4';
                },
            },
        ],
    };

    return (
        <>
            <Bar options={options} data={data} />
        </>
    );
}
