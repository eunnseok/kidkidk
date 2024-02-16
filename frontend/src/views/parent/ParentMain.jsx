import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import styles from './ParentMain.module.css';
import successStamp from '../../assets/images/successStamp.PNG';
import failStamp from '../../assets/images/failStamp.PNG';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { getFund, getFundHistory, deleteFund } from '@api/fund.js';
import { getSaving } from '@api/saving.js';
import { getChild } from '@api/child.js';
import { useRecoilValue } from 'recoil';

import { profileInfoState } from '../../store/profileInfoAtom.js';
import { childIdAtom, childNickNameAtom } from '@store/childIdsAtom.js';

export default function ParentMain() {
    const childId = useRecoilValue(childIdAtom);
    //console.log('ParentMain childId', childId);
    const childNickName = useRecoilValue(childNickNameAtom);
    console.log('ParentMain childNickName', childNickName);

    const profileInfo = useRecoilValue(profileInfoState);
    console.log('프로필정보', profileInfo);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fund, setFund] = useState([]);
    const [savingMoney, setSavingMoney] = useState(0);
    const [child, setChild] = useState([]);
    const [ratioPercentage, setRatioPercentage] = useState([]);
    const [statementdata, setStatementdata] = useState([]);
    const [thisWeekInvestments, setThisWeekInvestments] = useState([]);

    useEffect(() => {
        getFund(
            childId,
            (success) => {
                setFund(success.data.Fund);
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
        getSaving(
            childId,
            (success) => {
                if (success.status == 200) {
                    let saving = success.data.Saving;
                    setSavingMoney((4 - saving.count) * saving.payment);
                }
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
        let isZero = child.coin + child.fundMoney + savingMoney;
        let sum = isZero == 0 ? 1 : isZero;
        let coinRate = Math.floor((child.coin / sum) * 1000) / 10;
        let fundMoneyRate = Math.floor((child.fundMoney / sum) * 1000) / 10;
        let savingMoneyRate = Math.floor((savingMoney / sum) * 1000) / 10;
        setRatioPercentage([coinRate, fundMoneyRate, savingMoneyRate]);
    }, [child, savingMoney]);

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

            setThisWeekInvestments(thisWeekData);
        }
    }, [statementdata]);

    const handleFundClose = () => {
        const beforeDelete = confirm('정말 투자를 종료하시겠습니까?');
        if (beforeDelete) {
            deleteFund(
                childId,
                () => {
                    setIsModalOpen(true);
                },
                (fail) => {
                    console.log(fail);
                }
            );
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={styles.parentMainContainer}>
                <div className={styles.parentMainContainerStart}>
                    <div className={styles.childAssetProgress}>
                        <p>{childNickName} 어린이의 자산 현황</p>
                        <div className={styles.circularProgressContainer}>
                            <div className={styles.circularProgressBox}>
                                <div
                                    className={styles.circularProgress}
                                    style={{
                                        background: `conic-gradient(
                                            #5FB776 ${360 * (ratioPercentage[0] / 100)}deg,
                                            #D4CFC8 ${0}deg
                                        )`,
                                    }}
                                >
                                    <span>
                                        주머니
                                        <br />
                                        {ratioPercentage[0]}%
                                    </span>
                                </div>
                            </div>
                            <div className={styles.circularProgressBox}>
                                <div
                                    className={styles.circularProgress}
                                    style={{
                                        background: `conic-gradient(
                                        #F1554C ${360 * (ratioPercentage[1] / 100)}deg,
                                        #D4CFC8 ${0}deg
                                    )`,
                                    }}
                                >
                                    <span>
                                        투자
                                        <br />
                                        {ratioPercentage[1]}%
                                    </span>
                                </div>
                            </div>
                            <div className={styles.circularProgressBox}>
                                <div
                                    className={styles.circularProgress}
                                    style={{
                                        background: `conic-gradient(
                                        #FFD000 ${360 * (ratioPercentage[2] / 100)}deg,
                                        #D4CFC8 ${0}deg
                                    )`,
                                    }}
                                >
                                    <span>
                                        적금
                                        <br />
                                        {ratioPercentage[2]}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.childInvestProgress}>
                        <p>{childNickName} 어린이의 투자 현황</p>
                        <div className={styles.childInvestProgressFrame}>
                            <div className={styles.childInvestProgressInfo}>
                                <ul>
                                    <li>
                                        <p>
                                            <strong>투자 항목 :</strong>
                                            {fund ? (
                                                <> {fund.content} </>
                                            ) : (
                                                <span style={{ color: '#C1B8AD' }}> 투자 항목이 없습니다.</span>
                                            )}
                                        </p>
                                    </li>
                                    &nbsp;&nbsp;&nbsp;
                                    <li>
                                        {fund ? (
                                            <button className={styles.investQuitButton} onClick={handleFundClose}>
                                                투자 종료하기
                                            </button>
                                        ) : (
                                            <></>
                                        )}
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.childInvestProgressWeekTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>월</th>
                                            <th>화</th>
                                            <th>수</th>
                                            <th>목</th>
                                            <th>금</th>
                                            <th>토</th>
                                            <th>일</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {/* <td>
                                                <img src={successStamp} alt="successStamp" width={100} />
                                            </td>
                                            <td>2</td>
                                            <td>3</td>
                                            <td>4</td>
                                            <td>5</td>
                                            <td>6</td>
                                            <td>7</td> */}
                                            {thisWeekInvestments &&
                                                thisWeekInvestments.map((row, index) => {
                                                    return (
                                                        <td key={index}>
                                                            {row.seedMoney == 0 ? (
                                                                <></>
                                                            ) : (
                                                                <>
                                                                    {row.pnl < row.seedMoney ? (
                                                                        <img
                                                                            src={failStamp}
                                                                            alt="failStamp"
                                                                            width={100}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={successStamp}
                                                                            alt="successStamp"
                                                                            width={100}
                                                                        />
                                                                    )}
                                                                </>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal */}
                <Modal
                    appElement={document.getElementById('root')}
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    contentLabel="Result Modal"
                    style={{
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                        content: {
                            backgroundColor: '#F7F5F1',
                            borderRadius: '15px',
                            width: '40vw',
                            height: '15vw',
                            margin: 'auto',
                            padding: '30px',
                            position: 'absolute',
                            // left: "65vw",
                            zIndex: '999',
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    }}
                >
                    <div className={styles.modalComponent}>
                        <div className={styles.modalContents}>투자 종료가 예약되었습니다.</div>
                        <button className={styles.modalClose} onClick={handleCloseModal}>
                            닫기
                        </button>
                    </div>
                </Modal>
            </div>
        </>
    );
}
