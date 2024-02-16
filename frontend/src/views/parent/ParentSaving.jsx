import React, { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import styles from './ParentSaving.module.css';
import { getChild } from '@api/child.js';
import { getSaving, getSavingHistory } from '@api/saving.js';
import { useRecoilValue } from 'recoil';
import { childIdAtom, childNickNameAtom } from '@store/childIdsAtom.js';

export default function ParentSaving() {
    const childId = useRecoilValue(childIdAtom);
    console.log('ParentSaving childId', childId);
    const childNickName = useRecoilValue(childNickNameAtom);
    console.log('ParentMain childNickName', childNickName);

    const [child, setChild] = useState([]);
    const [saving, setSaving] = useState([]);
    const [savingHistory, setSavingHistory] = useState([]);
    const [payHistory, setPayHistory] = useState([]);
    const [remainPayment, setRemainPayment] = useState(0);
    const [endSavingDate, setEndSavingDate] = useState('');

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
        getSaving(
            childId,
            (success) => {
                setSaving(success.data.Saving);
                let tmpSaving = success.data.Saving;
                const savingStartDate = new Date(tmpSaving.startDate);
                const calcDate = addDays(savingStartDate, 29);
                const endDate = format(calcDate, 'yyyy-MM-dd');
                const remain = tmpSaving.payment * tmpSaving.count;
                const today = format(new Date(), 'yyyy-MM-dd');

                setRemainPayment(remain);
                setEndSavingDate(endDate);
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
        getSavingHistory(
            childId,
            (success) => {
                setSavingHistory(success.data.SavingHistories);
                let tempSavingHistories = success.data.SavingHistories;
                let size = tempSavingHistories.length;
                let eachSavingHistories = [1, 2, 3, 4];
                const tempPayHistory = eachSavingHistories.map((index) => {
                    const history = index <= size ? tempSavingHistories[index - 1] : false;

                    const amount = history ? history.amount : 0;
                    return { id: index, amount: amount };
                });
                setPayHistory(tempPayHistory);
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            console.log('ChildManagement userEffect return');
        };
    }, []);

    return (
        <>
            <div className={styles.childSavingStatus}>
                <p>{childNickName} 어린이의 적금 내역</p>
                {saving ? (
                    <div className={styles.childSavingStatusFrame}>
                        <div className={styles.childSavingStatusFrame_balance}>
                            <p>적금 잔액</p>
                            <p>{remainPayment} 도토리</p>
                        </div>
                        <div className={styles.childSavingStatusFrame_weeklyPayment}>
                            <p>주 납입 금액(회분)</p> <p>{saving.payment} 도토리</p>
                        </div>
                        <div className={styles.childSavingStatusFrame_expirationDate}>
                            <p>적금 만기 일</p> <p>{endSavingDate}</p>
                        </div>
                        <div className={styles.childSavingStatusFrame_paymentTimes}>
                            <p>적금 납부 횟수</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>1주차</th>
                                        <th>2주차</th>
                                        <th>3주차</th>
                                        <th>4주차</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {payHistory.map((data, index) => {
                                            return (
                                                <td
                                                    key={index}
                                                    style={{
                                                        // backgroundColor: 'lightgreen'
                                                        backgroundColor: data.amount > 0 ? '#35B356' : '#d3d3d3',
                                                    }}
                                                ></td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className={styles.childSavingStatusFram_none}>적금 계좌가 없습니다.</div>
                )}
            </div>
        </>
    );
}
