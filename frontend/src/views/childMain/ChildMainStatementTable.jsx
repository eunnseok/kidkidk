import styles from './ChildMainStatementTable.module.css';
import { format, getHours } from 'date-fns';

const ChildMainStateMentTable = ({ data }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const checkMA = getHours(date) > 11 ? '오후' : '오전';
        const datePart = format(date, 'yyyy.MM.dd');
        const timePart = format(date, checkMA + ' HH:mm');
        return { datePart, timePart };
    };
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headtr}>
                        <th>일자</th>
                        <th>유형</th>
                        <th>변동내역</th>
                        <th>주머니</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.toReversed().map((row) => {
                            const { datePart, timePart } = formatDate(row.dataLog);
                            const sign = row.type === true ? '+' : '-';
                            return (
                                <tr key={row.dataLog}>
                                    <td>
                                        <div>{datePart}</div>
                                        <div>{timePart}</div>
                                    </td>
                                    <td>{row.detail}</td>
                                    {sign == '+' ? (
                                        <td style={{ color: '#5E82CD' }}>
                                            {sign}
                                            {row.amount}
                                        </td>
                                    ) : (
                                        <td style={{ color: '#E26459' }}>
                                            {sign}
                                            {row.amount}
                                        </td>
                                    )}
                                    <td>{row.money} 도토리</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default ChildMainStateMentTable;
