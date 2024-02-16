import styles from './ChildSaving.module.css';
import React, { useState, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { getChild } from '@api/child.js';
import { getSaving, getSavingHistory, postSaving } from '@api/saving.js';
import acornImg from '@images/acorn.png';
import tuto1 from '@images/tuto1.png';
import tuto2 from '@images/tuto2.png';
import tuto3 from '@images/tuto3.png';
import tuto4 from '@images/tuto4.png';
import tuto5 from '@images/tuto5.png';
import ChildSavingTable from './ChildSavingTable.jsx';
import Modal from 'react-modal';
import { useRecoilValue } from 'recoil';
import { profileInfoState } from '../../store/profileInfoAtom.js';

export default function ChildSaving() {
    const profileInfo = useRecoilValue(profileInfoState);
    const childId = profileInfo.profileId;
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentTutorialIndex, setCurrentTutorialIndex] = useState(0);
    const [modalContents, setModalContents] = useState([
        'Tutorial 1',
        'Tutorial 2',
        'Tutorial 3',
        'Tutorial 4',
        'Tutorial 5',
    ]);
    const [child, setChild] = useState([]);
    const [saving, setSaving] = useState([]);
    const [savingHistory, setSavingHistory] = useState([]);
    const [payHistory, setPayHistory] = useState([]);
    const [countPayment, setCountPayment] = useState(0);
    const [endSavingDate, setEndSavingDate] = useState('');
    const [payment, setPayment] = useState('');
    const [postPayment, setPostPayment] = useState('');

    // 현재 날짜 객체 생성
    const currentDate = new Date();

    // 현재 날짜에 29일을 더함
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 29);

    // 날짜와 월이 한 자리일 경우 앞에 0을 추가하기 위한 함수 정의
    const addLeadingZero = (num) => (num < 10 ? '0' + num : num);

    // 날짜 정보
    const year = futureDate.getFullYear(); // 년도
    const month = addLeadingZero(futureDate.getMonth() + 1); // 월 (+1을 해야 정상적인 월을 얻을 수 있음)
    const day = addLeadingZero(futureDate.getDate()); // 일

    // 요일을 얻기 위해 배열에 요일을 저장
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    // 요일을 가져오기 위해 getDay() 사용
    const futureDayOfWeek = daysOfWeek[futureDate.getDay()];

    const handleCreateSavingAccount = () => {
        if (payment !== '') {
            // payment 값이 비어있지 않을 때만 요청을 보냄
            // postSaving 함수를 호출하여 요청을 보냄
            const savingData = {
                payment: payment,
                childId: childId,
            };

            const successCallback = () => {
                console.log('요청 성공');
            };

            const errorCallback = () => {
                console.error('요청 실패1');
                // 실패 시 실행할 작업
            };

            postSaving(savingData, successCallback, errorCallback);
        }
    };

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
                const calcCountPaymet = tmpSaving.payment * (4 - tmpSaving.count);
                const today = format(new Date(), 'yyyy-MM-dd');

                setCountPayment(calcCountPaymet);
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

    // 모달 열기
    const openModal = () => {
        setCurrentTutorialIndex(0); // 모달이 열릴 때마다 현재 페이지 초기화
        setModalIsOpen(true);
    };
    const renderPageDots = () => {
        return modalContents.map((_, index) => (
            <div
                key={index}
                className={`${styles.pageDot} ${currentTutorialIndex === index ? styles.active : ''}`}
                onClick={() => changeModalContent(index)}
            />
        ));
    };

    const changeModalContent = (index) => {
        setCurrentTutorialIndex(index);
    };

    const handleInputPaymentChange = (e) => {
        const value = e.target.value;
        setPayment(value);
    };

    return (
        <div className={styles.savingCon}>
            {payHistory.length > 0 ? (
                <div className={styles.savingContainer}>
                    <div className={styles.Container1}>
                        <div className={styles.Container1Title}>적금 납부 횟수</div>
                        <div className={styles.bars}>
                            <div className={styles.bar}>
                                <div className={styles.barWeek}>1주차</div>
                                <div
                                    className={styles.bar1}
                                    style={{
                                        backgroundColor: payHistory[0].amount > 0 ? '#90C354' : '#d3d3d3',
                                    }}
                                ></div>
                            </div>
                            <div className={styles.bar}>
                                <div className={styles.barWeek}>2주차</div>
                                <div
                                    className={styles.bar2}
                                    style={{
                                        backgroundColor: payHistory[1].amount > 0 ? '#90C354' : '#d3d3d3',
                                    }}
                                ></div>
                            </div>
                            <div className={styles.bar}>
                                <div className={styles.barWeek}>3주차</div>
                                <div
                                    className={styles.bar3}
                                    style={{
                                        backgroundColor: payHistory[2].amount > 0 ? '#90C354' : '#d3d3d3',
                                    }}
                                ></div>
                            </div>
                            <div className={styles.bar}>
                                <div className={styles.barWeek}>4주차</div>
                                <div
                                    className={styles.bar4}
                                    style={{
                                        backgroundColor: payHistory[3].amount > 0 ? '#90C354' : '#d3d3d3',
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.Container2}>
                        <div className={styles.card1}>
                            <div className={styles.card1Title}>지금까지 납부한 금액</div>
                            <div className={styles.card1Content1}>
                                <div>
                                    <img src={acornImg} style={{ width: '3vw' }} />
                                </div>
                                <div className={styles.card1Text}>{countPayment} 도토리</div>
                            </div>
                        </div>
                        <div className={styles.card2}>
                            <div className={styles.card1Title}>적금 만기 일</div>
                            <div className={styles.card2Text}>{endSavingDate}</div>
                        </div>
                    </div>

                    <div className={styles.Container3}>
                        <div className={styles.Container3Title}>나의 적금 내역</div>
                        <div className={styles.scrollContainer}>
                            <div className={styles.scrollContent}>
                                <ChildSavingTable data={savingHistory} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.savingContainer}>
                    <div className={styles.nonBox}>
                        <div className={styles.box1}>현재 적금 계좌가 없어요!</div>
                        <div className={styles.box2} onClick={openModal}>
                            적금 계좌 만들기
                        </div>
                        <Modal
                            appElement={document.getElementById('root')}
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: '999',
                                },
                                content: {
                                    backgroundColor: '#F8F3E7',
                                    borderRadius: '15px',
                                    width: '30vw',
                                    height: '70vh',
                                    margin: 'auto',
                                    padding: '30px',
                                    position: 'absolute',
                                    zIndex: '999',
                                },
                            }}
                        >
                            {currentTutorialIndex === 0 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.circleContainer}>{renderPageDots()}</div>
                                    <div className={styles.modalTitle}>4주동안 진행되는 적금</div>
                                    <div className={styles.modalIcon}>
                                        <img src={tuto1} style={{ width: '15vw' }} />
                                    </div>
                                    <div className={styles.modalContents}>
                                        적금은 4주 동안 진행되며 안정적인 수익을 제공해요
                                    </div>
                                    <div
                                        className={styles.modalOneBtn}
                                        onClick={() => changeModalContent(currentTutorialIndex + 1)}
                                    >
                                        다음 페이지
                                    </div>
                                </div>
                            )}
                            {currentTutorialIndex === 1 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.circleContainer}>{renderPageDots()}</div>
                                    <div className={styles.modalTitle}>만기시 이자율 5%</div>
                                    <div className={styles.modalIcon}>
                                        <img src={tuto2} style={{ width: '15vw' }} />
                                    </div>
                                    <div className={styles.modalContents}>
                                        <div>원금 + 추가 5%</div>
                                        <div>적금은 안정적인 수익을 제공해요</div>
                                    </div>
                                    <div className={styles.modalBtns}>
                                        <div
                                            className={styles.modalTwoBtn1}
                                            onClick={() => changeModalContent(currentTutorialIndex - 1)}
                                        >
                                            이전 페이지
                                        </div>
                                        <div
                                            className={styles.modalTwoBtn2}
                                            onClick={() => changeModalContent(currentTutorialIndex + 1)}
                                        >
                                            다음 페이지
                                        </div>
                                    </div>
                                </div>
                            )}
                            {currentTutorialIndex === 2 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.circleContainer}>{renderPageDots()}</div>
                                    <div className={styles.modalTitle}>매주 납부요일 오전 9시에 자동 납입</div>
                                    <div className={styles.modalIcon}>
                                        <img src={tuto3} style={{ width: '15vw' }} />
                                    </div>
                                    <div className={styles.modalContents}>
                                        <div>납기일은 적금시작 다음날!</div>
                                        <div>매주 해당 요일에 돈이 빠져나가요</div>
                                    </div>
                                    <div className={styles.modalBtns}>
                                        <div
                                            className={styles.modalTwoBtn1}
                                            onClick={() => changeModalContent(currentTutorialIndex - 1)}
                                        >
                                            이전 페이지
                                        </div>
                                        <div
                                            className={styles.modalTwoBtn2}
                                            onClick={() => changeModalContent(currentTutorialIndex + 1)}
                                        >
                                            다음 페이지
                                        </div>
                                    </div>
                                </div>
                            )}
                            {currentTutorialIndex === 3 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.circleContainer}>{renderPageDots()}</div>
                                    <div className={styles.modalTitle}>납부할 도토리가 없으면 미납처리</div>
                                    <div className={styles.modalIcon}>
                                        <img src={tuto4} style={{ width: '15vw' }} />
                                    </div>
                                    <div className={styles.modalContents}>납기일에 도토리가 부족하면 납부가 안돼요</div>
                                    <div className={styles.modalBtns}>
                                        <div
                                            className={styles.modalTwoBtn1}
                                            onClick={() => changeModalContent(currentTutorialIndex - 1)}
                                        >
                                            이전 페이지
                                        </div>
                                        <div
                                            className={styles.modalTwoBtn2}
                                            onClick={() => changeModalContent(currentTutorialIndex + 1)}
                                        >
                                            다음 페이지
                                        </div>
                                    </div>
                                </div>
                            )}
                            {currentTutorialIndex === 4 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.circleContainer}>{renderPageDots()}</div>
                                    <div className={styles.modalTitle}>4번 중 3번이상 납부</div>
                                    <div className={styles.modalIcon}>
                                        <img src={tuto5} style={{ width: '15vw' }} />
                                    </div>
                                    <div className={styles.modalContents}>
                                        4주동안 미납횟수가 2번이 되면 자동으로 해지돼요
                                    </div>
                                    <div className={styles.modalBtns}>
                                        <div
                                            className={styles.modalTwoBtn1}
                                            onClick={() => changeModalContent(currentTutorialIndex - 1)}
                                        >
                                            이전 페이지
                                        </div>
                                        <div
                                            className={styles.modalTwoBtn3}
                                            onClick={() => {
                                                changeModalContent(currentTutorialIndex + 1);
                                            }}
                                        >
                                            적금 계좌 생성하러 가기
                                        </div>
                                    </div>
                                </div>
                            )}
                            {currentTutorialIndex === 5 && (
                                <div className={styles.modalContainer}>
                                    <div className={styles.modalTitle1}>적금 계좌 생성하기</div>
                                    <div className={styles.modalContent5}>
                                        <div className={styles.modalContent5Line}></div>
                                        <div className={styles.modalContent5Head}>
                                            <div className={styles.modalContent5Head1}>적금 만기 예정일</div>
                                            <div className={styles.modalContent5Head1}>매주 납입할 요일</div>
                                            <div className={styles.modalContent5Head1}>매주 납입할 금액</div>
                                            <div className={styles.modalContent5Head1}>만기시 예상 환급액</div>
                                        </div>
                                        <div className={styles.modalContent5Body}>
                                            <div className={styles.modalContent5Body1}>
                                                {year}년 {month}월 {day}일
                                            </div>
                                            <div className={styles.modalContent5Body1}>매주 {futureDayOfWeek}요일</div>
                                            <div className={styles.modalContent5Body1}>
                                                <input
                                                    type="number"
                                                    placeholder="도토리 개수 입력"
                                                    value={payment}
                                                    onChange={handleInputPaymentChange}
                                                    className={styles.input}
                                                />
                                            </div>
                                            <div className={styles.modalContent5Body2}>
                                                <div className={styles.modalContent5Body2_1}>
                                                    {payment === 0 || payment === ''
                                                        ? '0 도토리'
                                                        : Math.floor(
                                                              parseInt(payment) * 4 + parseInt(payment) * 4 * 0.05
                                                          ) + ' 도토리'}
                                                </div>
                                                <img src={acornImg} style={{ width: '1.5vw', height: '1.5vw' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.modalBtns}>
                                        <div className={styles.modalTwoBtn1} onClick={() => setModalIsOpen(false)}>
                                            창 닫기
                                        </div>
                                        <div
                                            className={styles.modalTwoBtn3}
                                            onClick={() => {
                                                handleCreateSavingAccount();
                                                setModalIsOpen(false);
                                                // setIsSavingStart(true);
                                            }}
                                        >
                                            적금 계좌 생성
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </div>
                </div>
            )}
        </div>
    );
}
