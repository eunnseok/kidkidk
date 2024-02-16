import { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { getFundHistory } from '@api/fund';
import { getChild } from '@api/child.js';
import { useRecoilValue } from 'recoil';
import { childIdAtom } from '@store/childIdsAtom.js';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ParentFundAccountGraph() {
    const childId = useRecoilValue(childIdAtom);
    console.log('ParentFundAccountGraph childId', childId);
    const [child, setChild] = useState([]);
    const [statementdata, setStatementdata] = useState([]);
    const [thisWeekInvestments, setThisWeekInvestments] = useState([]);

    useEffect(() => {
        getChild(
            childId,
            (success) => {
                setChild(success.data);
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
            const today = format(new Date(), 'yyyy-MM-dd');

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

            const reverseThisWeekData = thisWeekData.reverse();
            const tempThisWeekInvestments = [];
            const currentFundMoney = child.fundMoney;
            let fundMoneyPointer = null;

            reverseThisWeekData.map((data) => {
                let fundMoney = fundMoneyPointer;
                if (data.seedMoney != 0) {
                    fundMoneyPointer += data.seedMoney - data.pnl;
                    fundMoney = fundMoneyPointer;
                } else if (data.dataLog === today) {
                    fundMoney = currentFundMoney;
                    fundMoneyPointer = currentFundMoney;
                }
                tempThisWeekInvestments.push(fundMoney);
            });

            setThisWeekInvestments(tempThisWeekInvestments.reverse());
        }
    }, [statementdata]);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: '투자 손익금 그래프',
                font: {
                    size: 18, // 원하는 폰트 크기로 조절
                },
                color: 'color: var(--nav-background)',
            },
        },
    };

    const labels = ['월', '화', '수', '목', '금', '토', '일'];

    const data = {
        labels,
        datasets: [
            {
                label: '투자 손익금 누적액',
                data: thisWeekInvestments,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <>
            <Line options={options} data={data} />
        </>
    );
}
