import styles from './ChildMainStateMent.module.css';
import ChildMainStatementTable from './ChildMainStatementTable.jsx';
import { useRecoilValue } from 'recoil';
import { profileInfoState } from '../../store/profileInfoAtom.js';
import { Line } from 'react-chartjs-2';
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
import React, { useState, useEffect } from 'react';
import { getHistory } from '@api/deposit.js';
import { format } from 'date-fns';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChildMainStateMent() {
    const [labels, setLabels] = useState([]);
    const [money, setMoney] = useState([]);

    const profileInfo = useRecoilValue(profileInfoState);
    const childId = profileInfo.profileId;
    const [statementdata, setStatementdata] = useState([]);

    useEffect(() => {
        getHistory(
            childId,
            (success) => {
                setStatementdata(success.data.DepositList);
                let size = success.data.DepositList.length;
                let p = 0;
                labels.length = 0;
                money.length = 0;
                for (let i = 0; i < size; i++) {
                    let date = new Date(success.data.DepositList[i].dataLog);
                    let t = format(date, 'yyyy.MM.dd');
                    let m = success.data.DepositList[i].money;
                    if (p > 0 && labels[p - 1] === t) {
                        money[p - 1] += m;
                    } else {
                        labels.push(t);
                        money.push(m);
                        p++;
                    }
                }
                console.log(success.data);
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            console.log('ChildManagement userEffect return');
        };
    }, []);

    const data = {
        labels,
        datasets: [
            {
                label: '도토리',
                data: money,
                backgroundColor: '#5FB776',
                borderColor: '#5FB776',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const Canvas = () => {
        return <Line options={options} data={data} />;
    };

    return (
        <div className={styles.stateContainer}>
            <div className={styles.card}>
                <div className={styles.title}>나의 주머니 변동 그래프</div>
                <div className={styles.lineChart}>
                    <Canvas />
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.title}>나의 주머니 내역</div>
                <div className={styles.scrollContainer}>
                    <div className={styles.scrollContent}>
                        <ChildMainStatementTable data={statementdata} />
                    </div>
                </div>
            </div>
        </div>
    );
}
