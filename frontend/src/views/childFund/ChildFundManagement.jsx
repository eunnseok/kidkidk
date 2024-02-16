import styles from './ChildFundManagement.module.css';
import acornImg from '@images/acorn.png';
import { Bar } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getFund, getFundHistory, getRoi, getStatus, createSubmit, getFundNews } from '@api/fund.js';
import { getChild, updateChild } from '@api/child.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { differenceInDays, format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { profileInfoState } from '../../store/profileInfoAtom.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChildFundManagement() {
    const profileInfo = useRecoilValue(profileInfoState);
    const childId = profileInfo.profileId;
    const [isFundStart, setIsFundStart] = useState(true); // 부모가 투자 시작안했으면 false
    const [isFundItem, setIsFundItem] = useState(false); // 투자항목이 있으면 true
    const [currentIndex, setCurrentIndex] = useState(0); // 모달 페이지
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [success, setSuccess] = useState(0); // 성공 베팅 코인
    const [fail, setFail] = useState(0); // 실패 베팅 코인
    const [labels, setLabels] = useState([]); // 그래프 라벨
    const [rates, setRates] = useState([]); // 이익률
    const [roi, setRoi] = useState([]); // 투자 성공률 테이블
    const [successRate, setSuccessRate] = useState(0);
    const [avgFundMoney, setAvgFundMoney] = useState(0); // 평균 투자 금액
    const [choice, setChoice] = useState(''); // 아이의 베팅 선택
    const [pnlRate, setPnlRate] = useState(0); // 이익률
    const [isSuccessBtnActive, setIsSuccessBtnActive] = useState(false); // 성공 투자 버튼 활성화
    const [isFailBtnActive, setIsFailBtnActive] = useState(false); // 실패 투자 버튼 활성화
    const [myChoice, setMyChoice] = useState(0); // 오늘 나의 선택
    const [showDiv, setShowDiv] = useState(false); // 거래할 수 있는 시간이면 true
    const [fundNewsList, setFundNewsList] = useState([]); // 투자 뉴스 리스트
    const [child, setChild] = useState([]); // 자식 테이블(코인, 투자자산)
    const [fund, setFund] = useState([
        {
            name: null,
            content: null,
            yield: 0,
        },
    ]); // 투자 항목 테이블
    const [fundStatus, setFundStatus] = useState([
        {
            amount: 0,
            submit: null,
            answer: null,
        },
    ]); // 투자 상태 테이블
    const [fundHistory, setFundHistory] = useState([
        {
            dataLog: null,
            seedMoney: 0,
            yield: 0,
            pnl: 0,
        },
    ]); // 투자 내역 테이블

    // 투자항목 아이선택(ChildStatus, Child 수정)
    const handleCreateSubmit = async () => {
        // amount는 success와 fail 중에서 값이 입력된 것을 사용
        // submit은 currentIndex가 0이면 true를, 1이면 false
        const amount = success || fail;
        const submit = currentIndex === 0;
        const fundSubmit = {
            amount: amount,
            submit: submit,
            childId: childId,
        };

        const fundMoney =
            currentIndex === 0
                ? child.fundMoney + fundStatus.amount - parseInt(success)
                : child.fundMoney + fundStatus.amount - parseInt(fail);
        const updateChildMoney = {
            coin: child.coin,
            fundMoney: fundMoney,
            childId: childId,
        };

        try {
            // 첫 번째 API 요청 보내기
            await createSubmit(fundSubmit);

            // 첫 번째 API 요청 성공 후 두 번째 API 요청 보내기
            await updateChild(updateChildMoney);

            // 모든 요청이 성공했을 때 실행할 코드
            console.log('투자 및 Child 업데이트가 성공적으로 완료되었습니다.');

            // 투자 상태 테이블 새로 렌더링
            setFundStatus(fundSubmit);
            // 모달을 닫고 데이터를 다시 가져오기
            // setModalIsOpen(false);
            // 강제로 화면 새로고침
            window.location.reload();
        } catch (error) {
            // 요청 중에 오류가 발생했을 때 실행할 코드
            console.error('투자 제출 또는 Child 업데이트 중 오류가 발생했습니다:', error);
        }
    };

    // 투자를 거래할 수 있는 시간인지 확인
    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        // 현재 시간이 9시에서 17시 사이인지 확인
        // const isBetween9to5 = currentHour >= 9 && currentHour <= 16;
        const isBetween9to5 = true;
        // 현재 시간이 9시에서 17시 사이이면 showDiv 상태를 true로 설정
        setShowDiv(isBetween9to5);
    }, []);

    useEffect(() => {
        // 투자항목 테이블 조회
        getFund(
            childId,
            (success) => {
                if (success.data.Fund) {
                    setFund(success.data.Fund);
                    setIsFundItem(true);
                } else {
                    // console.log('No fund data available.');
                }
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    useEffect(() => {
        // 자식 테이블 조회
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
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    useEffect(() => {
        // 투자 내역 테이블 조회
        // 최근 일주일 투자 현황의 라벨과 데이터를 뽑아냄
        getFundHistory(
            childId,
            (success) => {
                if (success.data.FundHistory) {
                    setFundHistory(success.data.FundHistory);
                    labels.length = 0;
                    rates.length = 0;
                    let dateTime = format(new Date(), 'yyyy.MM.dd');
                    let labelList = [];
                    let rateList = [];
                    success.data.FundHistory.map((row) => {
                        let dataLog = new Date(row.dataLog);
                        let fDataLog = format(dataLog, 'yyyy.MM.dd');
                        if (differenceInDays(new Date(dateTime), new Date(fDataLog)) <= 7) {
                            labelList.push(fDataLog);
                            rateList.push((row.pnl < row.seedMoney ? -1 : 1) * row.yield);
                        }
                    });
                    setLabels(labelList);
                    setRates(rateList);
                } else {
                    // console.log('No fund history data available.');
                }
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    useEffect(() => {
        // 투자 성공률 조회
        getRoi(
            childId,
            (success) => {
                setRoi(success.data.roi);
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    useEffect(() => {
        // 투자 상태 조회
        getStatus(
            childId,
            (success) => {
                if (success.data.FundStatus) {
                    setFundStatus(success.data.FundStatus);
                } else {
                    // console.log('No fund status data available.');
                }
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    // 투자 뉴스 조회
    useEffect(() => {
        getFundNews(
            childId,
            (success) => {
                if (success.status === 200) {
                    let getList = success.data.FundNews;
                    let size = getList.length;
                    let list = [];
                    if (size > 0) {
                        getList.map((row) => {
                            list.push(row);
                        });
                    }
                    setFundNewsList(list);
                }
            },
            (fail) => {
                console.log(fail);
            }
        );
    }, []);

    const handleReset = () => {
        // buyCoin 상태 초기화
        setSuccess('');
        setFail('');
    };

    const handleInputSuccessChange = (e) => {
        const value = e.target.value;
        setSuccess(value);
        setIsSuccessBtnActive(value > 0 && value <= child.fundMoney);
    };

    const handleInputFailChange = (e) => {
        const value = e.target.value;
        setFail(value);
        setIsFailBtnActive(value > 0 && value <= child.fundMoney);
    };

    // 모달 열기
    const openModal = () => {
        setSuccess('');
        setFail('');
        setCurrentIndex(0); // 모달이 열릴 때마다 현재 페이지 초기화
        setModalIsOpen(true);
    };

    const changeModalContent = (index) => {
        setCurrentIndex(index);
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // 세로선 숨김
                },
            },
            y: {
                grid: {
                    drawBorder: false, // 기본 그리드 라인 숨김
                },
                ticks: {
                    callback: function (value, index, values) {
                        return value; // 다른 눈금에는 라벨 표시
                    },
                    afterBuildTicks: function (scale) {
                        // 특정 위치에 0 값을 포함한 눈금 생성
                        if (!scale.ticks.includes(0)) {
                            scale.ticks.push(0);
                        }
                    },
                },
            },
        },
    };

    // 최근 일주일 투자현황 data
    const data = {
        labels,
        datasets: [
            {
                data: rates,
                backgroundColor: function (context) {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 0 ? '#F1554C' : '#4285F4';
                },
            },
        ],
    };

    // 아이의 투자 상태를 setChoice에 저장
    // fundStatus 객체가 변경될 때마다 useEffect 콜백 함수를 실행
    // setChoice 함수를 호출하여 choice 상태를 업데이트
    useEffect(() => {
        if (fundStatus && typeof fundStatus.amount !== 'undefined' && fundStatus.amount != 0) {
            setChoice(fundStatus.submit ? '성공' : '실패');
        } else {
            setChoice('선택 안함');
        }
    }, [fundStatus]);

    // 투자 성공률 변동을 setSuccessRate에 저장
    // 투자 성공률 roi 객체가 변경될 때마다 콜백 함수 실행
    useEffect(() => {
        if (roi && roi.count !== undefined && roi.success !== undefined) {
            let isZero = roi.count; // 투자 횟수
            let count = isZero === 0 ? 1 : isZero;
            let rate = (roi.success / count) * 100;
            setSuccessRate(rate);
        }
    }, [roi]);

    // 평균 투자금액, 이익률을 저장
    // fundHistory 객체가 변경될 때마다 콜백 함수 실행
    useEffect(() => {
        if (fundHistory) {
            let count = 0;
            let sumSeedMoney = 0;
            let sumPnl = 0;
            fundHistory.map((row) => {
                sumSeedMoney += row.seedMoney;
                sumPnl += row.pnl;
                count += 1;
            });

            count = count == 0 ? 1 : count;
            sumSeedMoney = sumSeedMoney == 0 ? 0 : sumSeedMoney;
            let avg = sumSeedMoney / count; // 평균 투자금액

            sumSeedMoney = sumSeedMoney == 0 ? 1 : sumSeedMoney;
            let pRate = (sumPnl / sumSeedMoney) * 100; // 이익률

            avg = avg.toFixed(0);
            pRate = pRate.toFixed(0);

            setAvgFundMoney(avg);
            setPnlRate(pRate);
        }
    }, [fundHistory]);

    return (
        <div>
            {!isFundStart ? (
                <div className={styles.manageContainer}>
                    <div className={styles.fundNot}>투자를 통해 도토리를 모아봐요!</div>
                </div>
            ) : (
                <div className={styles.manageContainer}>
                    <div className={styles.content1}>
                        <div className={styles.card1}>
                            <div className={styles.title1}>
                                투자 항목
                                {isFundItem && showDiv ? (
                                    <div className={styles.startFund} onClick={openModal}>
                                        거래하러 가기
                                    </div>
                                ) : null}
                            </div>
                            <div className={styles.card1_text1}>
                                {isFundItem ? (
                                    <> {fund.content} </>
                                ) : (
                                    <span style={{ color: '#C1B8AD' }}>오늘은 투자 항목이 없어요 ㅠㅠ </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.card2}>
                            <div className={styles.title1}>오늘 나의 선택</div>
                            <div className={styles.card2_text1}>
                                {choice === '선택 안함' || choice === '' ? (
                                    <span style={{ color: '#C1B8AD' }}>오늘은 쉴래</span>
                                ) : (
                                    <>
                                        {choice === '실패' ? (
                                            <span style={{ color: '#5E82CD' }}>{choice}</span>
                                        ) : (
                                            <span style={{ color: '#E26459' }}>{choice}</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <Modal
                        appElement={document.getElementById('root')}
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        className={`${styles.modal} ${
                            currentIndex === 0
                                ? styles.modalBuy
                                : currentIndex === 1
                                ? styles.modalSell
                                : currentIndex === 2
                                ? styles.modalBet
                                : ''
                        }`}
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                zIndex: '999',
                            },
                            content: {
                                borderRadius: '15px',
                                width: '30vw',
                                height: '55vh',
                                margin: 'auto',
                                padding: '1vw',
                                position: 'absolute',
                                top: '35vh',
                                left: '65vw',
                                zIndex: '999',
                            },
                        }}
                    >
                        <div className={styles.modalContainer}>
                            <div className={styles.modalHead}>
                                <div
                                    className={`${styles.modalHead1} ${
                                        currentIndex === 0 ? styles.redColor : styles.grayColor
                                    }`}
                                    onClick={() => changeModalContent(0)}
                                >
                                    성공
                                </div>
                                <div
                                    className={`${styles.modalHead2} ${
                                        currentIndex === 1 ? styles.blueColor : styles.grayColor
                                    }`}
                                    onClick={() => changeModalContent(1)}
                                >
                                    실패
                                </div>
                            </div>
                            {currentIndex === 0 && (
                                <div className={styles.modalBody}>
                                    <div className={styles.modalBodyContainer}>
                                        <div className={styles.modalBody1}>
                                            <div className={styles.successBody1Title}>성공에 투자하기</div>
                                        </div>

                                        <div className={styles.modalBody2}>
                                            <input
                                                type="number"
                                                placeholder="도토리 개수 입력"
                                                value={success}
                                                onChange={handleInputSuccessChange}
                                                className={styles.input}
                                            />
                                            <div className={styles.modalMax}>개 도토리 구매하기</div>
                                        </div>

                                        <div className={styles.modalBody3}>
                                            <div className={styles.modalBody3Line} />
                                            <div className={styles.Body3Title}>
                                                <div>이익률</div>
                                                <div>투자 성공 시</div>
                                                <div>최대 투자 가능</div>
                                            </div>
                                            <div className={styles.Body3Contents}>
                                                <div>{fund.yield}%</div>
                                                <div>
                                                    {success > child.fundMoney ? (
                                                        <div>투자할 수 없습니다.</div>
                                                    ) : (
                                                        <div>
                                                            +{Math.floor(fund.yield * 0.01 * success)} 도토리
                                                            <img src={acornImg} style={{ width: '1.5vw' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    {child.fundMoney} 도토리
                                                    <img src={acornImg} style={{ width: '1.5vw' }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.modalBodyBtns}>
                                            <div className={styles.modalReset} onClick={handleReset}>
                                                초기화
                                            </div>
                                            <div
                                                className={`${styles.modalChoBtn} ${
                                                    isSuccessBtnActive && currentIndex === 0
                                                        ? styles.modalBuy
                                                        : !isSuccessBtnActive && currentIndex === 0
                                                        ? styles.modalBeforeBuy
                                                        : ''
                                                }`}
                                                onClick={handleCreateSubmit}
                                            >
                                                투자하기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentIndex === 1 && (
                                <div className={styles.modalBody}>
                                    <div className={styles.modalBodyContainer}>
                                        <div className={styles.modalBody1}>
                                            <div className={styles.failBody1Title}>실패에 투자하기</div>
                                        </div>

                                        <div className={styles.modalBody2}>
                                            <input
                                                type="number"
                                                placeholder="도토리 개수 입력"
                                                value={fail}
                                                onChange={handleInputFailChange}
                                                className={styles.input}
                                            />
                                            <div className={styles.modalMax}>개 도토리 구매하기</div>
                                        </div>

                                        <div className={styles.modalBody3}>
                                            <div className={styles.modalBody3Line} />
                                            <div className={styles.Body3Title}>
                                                <div>이익률</div>
                                                <div>투자 성공 시</div>
                                                <div>최대 투자 가능</div>
                                            </div>
                                            <div className={styles.Body3Contents}>
                                                <div>{fund.yield}%</div>
                                                <div>
                                                    {fail > child.fundMoney ? (
                                                        <div>투자할 수 없습니다.</div>
                                                    ) : (
                                                        <div>
                                                            +{Math.floor(fund.yield * 0.01 * fail)} 도토리
                                                            <img src={acornImg} style={{ width: '1.5vw' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    {child.fundMoney} 도토리
                                                    <img src={acornImg} style={{ width: '1.5vw' }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.modalBodyBtns}>
                                            <div className={styles.modalReset} onClick={handleReset}>
                                                초기화
                                            </div>
                                            <div
                                                className={`${styles.modalChoBtn} ${
                                                    isFailBtnActive && currentIndex === 1
                                                        ? styles.modalSell
                                                        : !isFailBtnActive && currentIndex === 1
                                                        ? styles.modalBeforeSell
                                                        : ''
                                                }`}
                                                onClick={handleCreateSubmit}
                                            >
                                                투자하기
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Modal>

                    <div className={styles.content2}>
                        <div className={styles.content2Title}>나의 투자 통계</div>
                        <div className={styles.content2Contents}>
                            <div className={styles.card3}>
                                <div className={styles.title2}>현재 투자금</div>
                                <div className={styles.card3Content1}>
                                    <div>
                                        <img src={acornImg} style={{ width: '2vw' }} />
                                    </div>
                                    <div className={styles.card3Text1}>
                                        {typeof fundStatus.amount === 'undefined' ? (
                                            <>0 도토리</>
                                        ) : (
                                            <>{fundStatus.amount} 도토리</>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.card3}>
                                <div className={styles.title2}>평균 투자 금액</div>
                                <div className={styles.card3Content1}>
                                    <div>
                                        <img src={acornImg} style={{ width: '2vw' }} />
                                    </div>
                                    <div className={styles.card3Text1}>{avgFundMoney} 도토리</div>
                                </div>
                            </div>
                            <div className={styles.card3}>
                                <div className={styles.title2}>투자 성공률</div>
                                <div className={styles.card3Text2}>{Math.floor(successRate)}%</div>
                            </div>
                            <div className={styles.card3}>
                                <div className={styles.title2}>이익률</div>
                                <div className={styles.card3Text2}>{Math.floor(pnlRate)}%</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content3}>
                        <div className={styles.card7}>
                            <div className={styles.content2Title}>최근 일주일 투자 현황</div>
                            <div className={styles.graph}>
                                {typeof data.datasets[0].data[0] === 'undefined' ? (
                                    <div className={styles.noBarChart}>최근 일주일 투자 현황이 없습니다.</div>
                                ) : (
                                    <Bar style={{ width: '460px', height: '60px' }} options={options} data={data} />
                                )}
                            </div>
                        </div>
                        <div className={styles.card8}></div>
                        <div className={styles.card9}>
                            <div className={styles.content2Title}>투자뉴스</div>
                            <div className={styles.content3News}>
                                {fundNewsList.length !== 0 ? (
                                    fundNewsList.map((row, index) => {
                                        return <div key={index}>{row.content}</div>;
                                    })
                                ) : (
                                    <div>투자뉴스가 없습니다.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
