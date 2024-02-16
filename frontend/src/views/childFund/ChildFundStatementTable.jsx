import styles from './ChildFundStatementTable.module.css';
import { format, getHours } from 'date-fns';

const ChildMainStateMentTable = ({ data }) => {
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
                        <th>변동내역</th>
                        <th>투자금</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.toReversed().map((row) => {
                            const { formatTime } = formatDate(row.dataLog);
                            const sign = row.pnl < row.seedMoney ? '-' : '+';
                            return (
                                <tr key={row.dataLog}>
                                    <td>{formatTime}</td>
                                    <td>투자 {sign == '+' ? '성공' : '실패'}</td>
                                    {sign == '+' ? (
                                        <td style={{ color: '#5E82CD' }}>
                                            {sign}
                                            {row.yield}%
                                        </td>
                                    ) : (
                                        <td style={{ color: '#E26459' }}>
                                            {sign}
                                            {row.yield}%
                                        </td>
                                    )}
                                    <td>{row.seedMoney} 도토리</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default ChildMainStateMentTable;
