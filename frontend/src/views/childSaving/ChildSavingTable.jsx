import styles from './ChildSavingTable.module.css';
import { format, getHours } from 'date-fns';

const ChildSavingTable = ({ data }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const checkMA = getHours(date) > 11 ? '오후' : '오전';
        const formatTime = format(date, 'yyyy.MM.dd ' + checkMA + ' HH:mm');
        return { formatTime };
    };
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headtr}>
                        <th>일자</th>
                        <th>유형</th>
                        <th>금액</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.toReversed().map((row, index) => {
                            const { formatTime } = formatDate(row.dataLog);
                            return (
                                <tr key={index}>
                                    <td>{formatTime}</td>
                                    {row.detail == '적금 납입' ? (
                                        <td style={{ color: '#5E82CD' }}>{row.detail}</td>
                                    ) : (
                                        <td style={{ color: '#E26459' }}>{row.detail}</td>
                                    )}
                                    <td>{row.amount}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default ChildSavingTable;
