import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ParentFundAccountGraph from './ParentFundAccountGraph';
import ParentFundProfitGraph from './ParentFundProfitGraph';
import {
    createFund,
    createFundReservation,
    updateFundReservation,
    deleteFund,
    deleteFundReservation,
    getFund,
    getFundReservation,
    getFundNews,
    createFundNews,
    createFundAnswer,
    getStatus,
} from '@api/fund.js';
import { useRecoilValue } from 'recoil';
import { childIdAtom, childNickNameAtom } from '@store/childIdsAtom.js';
import { format } from 'date-fns';

import styles from './ParentFund.module.css';

export default function ParentFund() {
    const childId = useRecoilValue(childIdAtom);
    //console.log('ParentFund childId', childId);
    const childNickName = useRecoilValue(childNickNameAtom);
    //console.log('ParentMain childNickName', childNickName);

    const [selectFund, setSelectedFund] = useState(false);
    const [selectReservationFund, setSelectReservationFund] = useState(false);
    const [fundCreateModalOpen, setFundCreateModalOpen] = useState(false);
    const [reservationFundCreateModalOpen, setReservationFundCreateModalOpen] = useState(false);
    const [fundNewsCreateModalOpen, setFundNewsCreateModalOpen] = useState(false);
    const [fundUpdateModalOpen, setFundUpdateModalOpen] = useState(false);
    const [reservationFundUpdateModalOpen, setReservationFundUpdateModalOpen] = useState(false);
    const [fund, setFund] = useState([]);
    const [fundReservation, setFundReservation] = useState([]);
    const [fundContent, setFundContent] = useState('');

    const [fundNews, setFundNews] = useState();
    const [fundAnswer, setFundAnswer] = useState();
    const [fundSubmitAnswer, setFundSubmitAnswer] = useState();

    // 투자 상태 조회
    useEffect(() => {
        getStatus(
            childId,
            (success) => {
                // console.log(success.data.FundStatus);
                setFundAnswer(success.data.FundStatus.answer);
            },
            (fail) => {
                console.log(fail);
            }
        );
    });
    //console.log('새로 렌더링 된 이후', fundAnswer);

    // 투자 항목 조회
    useEffect(() => {
        getFund(
            childId,
            (success) => {
                setFund(success.data.Fund);
                if (success.data.Fund) {
                    setSelectedFund(true);
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

    // 예약 투자 항목 조회
    useEffect(() => {
        getFundReservation(
            childId,
            (success) => {
                setFundReservation(success.data.FundReservation);
                if (success.data.FundReservation) {
                    setSelectReservationFund(true);
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

    // 투자 뉴스 조회
    useEffect(() => {
        getFundNews(
            childId,
            (success) => {
                if (success.status === 200) {
                    let fundNewsList = success.data.FundNews;
                    let size = fundNewsList.length;
                    if (size > 0) {
                        let lastestFundNews = fundNewsList[size - 1];
                        const lastestDataLog = format(new Date(lastestFundNews.dataLog), 'yyyy.MM.dd');
                        const today = format(new Date(), 'yyyy.MM.dd');
                        if (lastestDataLog === today) {
                            setFundNews(lastestFundNews.content);
                        }
                    }
                }
            },
            (fail) => {
                console.log(fail);
            }
        );
    }, []);

    // 투자 등록
    const handleFundRegist = () => {
        createFund(
            {
                content: fundContent,
                childId: childId,
            },
            (success) => {
                console.log(success.data.Fund);
                setFundReservation(success.data.Fund);
                setSelectReservationFund(true);
            },
            (fail) => {
                console.log(fail);
            }
        );
    };

    // 예약 투자 등록
    const handleFundReservationRegist = () => {
        createFundReservation(
            {
                content: fundContent,
                childId: childId,
            },
            (success) => {
                setFundReservation(success.data.Fund);
                setSelectReservationFund(true);
            },
            (fail) => {
                console.log(fail);
            }
        );
    };

    // 예약 투자 수정
    const handleFundReservationUpdate = () => {
        updateFundReservation(
            {
                state: true,
                content: fundContent,
                childId: childId,
            },
            (success) => {
                setFundReservation(success.data.Fund);
                setSelectReservationFund(true);
            },
            (fail) => {
                console.log(fail);
            }
        );
    };

    // 예약 투자 삭제
    const handleFundReservationDelete = () => {
        const beforeDelete = confirm('정말 예약 투자를 종료하시겠습니까?');
        if (beforeDelete) {
            deleteFundReservation(
                childId,
                () => {
                    setSelectReservationFund(false);
                },
                (fail) => {
                    console.log(fail);
                }
            );
        }
    };

    // 투자 삭제
    const handleFundDelete = () => {
        const beforeDelete = confirm('정말 투자를 종료하시겠습니까?');
        if (beforeDelete) {
            deleteFund(
                childId,
                () => {
                    alert('예약 투자 내역에 삭제 예약 되었습니다');
                    setSelectReservationFund(true);
                    setFundReservation({ ...fund, state: 0 });
                },
                (fail) => {
                    console.log(fail);
                }
            );
        }
    };

    const handelInputFundContent = (e) => {
        setFundContent(e.target.value);
    };

    const handleFundNewsChange = (event) => {
        setFundContent(event.target.value);
    };

    const handleFundAnswerChange = (event) => {
        console.log('투자 정답 변화 확인', event.target.value);
        setFundSubmitAnswer(event.target.value);
    };

    const handleFundNewsCreate = (event) => {
        event.preventDefault();

        if (fundContent != null && fundContent != '' && fundContent.trim() != '') {
            createFundNews(
                { content: fundContent, childId: childId },
                (success) => {
                    console.log('투자 뉴스 등록 성공', success.data);
                    setFundNews(success.data.FundNews.content);
                },
                (fail) => {
                    console.log('투자 뉴스 등록 실패', fail);
                }
            );
        }

        createFundAnswer(
            { answer: fundSubmitAnswer, childId: childId },
            (success) => {
                console.log('투자 정답 등록 성공', success);
                setFundAnswer(fundAnswer);
            },
            (fail) => {
                console.log('투자 정답 등록 실패', fail);
            }
        );
        setFundNewsCreateModalOpen(false);
        window.location.reload();
    };

    return (
        <>
            <div className={styles.parentFundContainer}>
                <div className={styles.fundAccountGraph}>
                    <ParentFundAccountGraph />
                </div>
                <div className={styles.fundBenefitGraph}>
                    <ParentFundProfitGraph />
                </div>
                <div className={styles.childFundStatus}>
                    <p>{childNickName} 어린이의 투자 내역</p>
                    {selectFund ? (
                        <div className={styles.childFundStatusFrame}>
                            <p>투자 종목 : {fund.content}</p>
                            <div style={{ textAlign: 'center' }}>
                                {!selectReservationFund ? (
                                    <button onClick={() => setFundUpdateModalOpen(true)}>투자종목 수정하기</button>
                                ) : (
                                    <></>
                                )}
                                &nbsp;&nbsp;
                                {!selectReservationFund || (fundReservation && fundReservation.state) ? (
                                    <button onClick={handleFundDelete}>투자종목 종료하기</button>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <Modal
                                appElement={document.getElementById('root')}
                                isOpen={fundUpdateModalOpen}
                                onRequestClose={() => setFundUpdateModalOpen(false)}
                                style={{
                                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                                    content: {
                                        backgroundColor: '#F7F5F1',
                                        borderRadius: '15px',
                                        width: '30vw',
                                        height: '90vh',
                                        margin: 'auto',
                                        padding: '30px',
                                        position: 'absolute',
                                        left: '65vw',
                                        zIndex: '999',
                                    },
                                }}
                            >
                                <div className={styles.fundModal}>
                                    <p>투자 수정</p>
                                    <form className={styles.fundForm}>
                                        <div className={styles.fundInputContainer}>
                                            <input
                                                type="text"
                                                value={fundContent}
                                                onChange={handelInputFundContent}
                                                placeholder="투자 항목을 입력하세요"
                                            />
                                        </div>

                                        <button onClick={handleFundReservationRegist}>투자 수정하기</button>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    ) : (
                        <div className={styles.childNoFundStatusFrame}>
                            <p style={{ color: 'red' }}>현재 등록된 투자항목이 없습니다.</p>
                            {selectReservationFund ? (
                                <></>
                            ) : (
                                <div>
                                    <button onClick={() => setFundCreateModalOpen(true)}>투자 등록하기</button>
                                </div>
                            )}
                            <Modal
                                appElement={document.getElementById('root')}
                                isOpen={fundCreateModalOpen}
                                onRequestClose={() => setFundCreateModalOpen(false)}
                                style={{
                                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                                    content: {
                                        backgroundColor: '#F7F5F1',
                                        borderRadius: '15px',
                                        width: '30vw',
                                        height: '90vh',
                                        margin: 'auto',
                                        padding: '30px',
                                        position: 'absolute',
                                        left: '65vw',
                                        zIndex: '999',
                                    },
                                }}
                            >
                                <div className={styles.fundModal}>
                                    <p>투자 등록</p>
                                    <form className={styles.fundForm}>
                                        <div className={styles.fundInputContainer}>
                                            <input
                                                type="text"
                                                value={fundContent}
                                                onChange={handelInputFundContent}
                                                placeholder="투자 항목을 입력하세요"
                                            />
                                        </div>
                                        <button onClick={handleFundRegist}>투자 등록하기</button>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    )}
                </div>
                <div className={styles.childReservationFundStatus}>
                    <p>{childNickName} 어린이의 예약 투자 내역</p>
                    {selectReservationFund ? (
                        <div className={styles.childReservationFundStatusFrame}>
                            <p>투자 종목 : {fundReservation.content}</p>
                            <div style={{ textAlign: 'center' }}>
                                {fundReservation.state == 0 ? (
                                    <span style={{ color: 'red' }}>삭제 예정&nbsp;&nbsp;</span>
                                ) : null}
                                <button onClick={() => setReservationFundUpdateModalOpen(true)}>
                                    예약 투자종목 수정하기
                                </button>
                                &nbsp;&nbsp;
                                <button onClick={handleFundReservationDelete}>예약 투자종목 종료하기</button>
                            </div>
                            <Modal
                                appElement={document.getElementById('root')}
                                isOpen={reservationFundUpdateModalOpen}
                                onRequestClose={() => setReservationFundUpdateModalOpen(false)}
                                style={{
                                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                                    content: {
                                        backgroundColor: '#F7F5F1',
                                        borderRadius: '15px',
                                        width: '30vw',
                                        height: '90vh',
                                        margin: 'auto',
                                        padding: '30px',
                                        position: 'absolute',
                                        left: '65vw',
                                        zIndex: '999',
                                    },
                                }}
                            >
                                <div className={styles.fundModal}>
                                    <p>예약 투자 수정</p>
                                    <form className={styles.fundForm}>
                                        <div className={styles.fundInputContainer}>
                                            <input
                                                type="text"
                                                value={fundContent}
                                                onChange={handelInputFundContent}
                                                placeholder={fundReservation.content}
                                            />
                                        </div>
                                        <button onClick={handleFundReservationUpdate}>예약 투자 수정하기</button>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    ) : (
                        <div className={styles.childNoReservationFundStatusFrame}>
                            <p style={{ color: 'red' }}>현재 예약된 투자항목이 없습니다.</p>
                            {selectFund ? (
                                <div>
                                    <button onClick={() => setReservationFundCreateModalOpen(true)}>
                                        예약 투자 등록하기
                                    </button>
                                </div>
                            ) : (
                                <></>
                            )}
                            <Modal
                                appElement={document.getElementById('root')}
                                isOpen={reservationFundCreateModalOpen}
                                onRequestClose={() => setReservationFundCreateModalOpen(false)}
                                style={{
                                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                                    content: {
                                        backgroundColor: '#F7F5F1',
                                        borderRadius: '15px',
                                        width: '30vw',
                                        height: '90vh',
                                        margin: 'auto',
                                        padding: '30px',
                                        position: 'absolute',
                                        left: '65vw',
                                        zIndex: '999',
                                    },
                                }}
                            >
                                <div className={styles.fundModal}>
                                    <p>예약 투자 등록</p>
                                    <form className={styles.fundForm}>
                                        <div className={styles.fundInputContainer}>
                                            <input
                                                type="text"
                                                value={fundContent}
                                                onChange={handelInputFundContent}
                                                placeholder="예약 투자 항목을 입력하세요"
                                            />
                                        </div>

                                        <button onClick={handleFundReservationRegist}>예약 투자 등록하기</button>
                                    </form>
                                </div>
                            </Modal>
                        </div>
                    )}
                </div>
                <div className={styles.todayFundNews}>
                    <p>오늘의 투자 뉴스</p>

                    <div className={styles.todayFundNewsFrame}>
                        <div>
                            {fundAnswer !== undefined ? (
                                <p>
                                    오늘의 투자 정답 :
                                    {fundAnswer ? (
                                        <span style={{ color: 'blue' }}>&nbsp;성공</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>&nbsp;실패</span>
                                    )}
                                </p>
                            ) : (
                                <>
                                    <p>오늘의 투자 정답이 아직 없습니다</p>
                                </>
                            )}
                        </div>
                        <br />
                        <div className={styles.todayFundNewsFrameNews}>
                            {fundNews !== undefined && fundNews !== null && fundNews !== '' ? (
                                <p>오늘의 투자 뉴스 : {fundNews}</p>
                            ) : (
                                <>
                                    <p>오늘의 투자 뉴스가 없습니다</p>
                                </>
                            )}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button onClick={() => setFundNewsCreateModalOpen(true)}>투자 뉴스 등록하기</button>
                        </div>
                    </div>
                    <Modal
                        appElement={document.getElementById('root')}
                        isOpen={fundNewsCreateModalOpen}
                        onRequestClose={() => setFundNewsCreateModalOpen(false)}
                        style={{
                            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                            content: {
                                backgroundColor: '#F7F5F1',
                                borderRadius: '15px',
                                width: '30vw',
                                height: '90vh',
                                margin: 'auto',
                                padding: '30px',
                                position: 'absolute',
                                left: '65vw',
                                zIndex: '999',
                            },
                        }}
                    >
                        <div className={styles.fundModal}>
                            <p>투자 뉴스 등록</p>
                            <form className={styles.fundForm} onSubmit={handleFundNewsCreate}>
                                <div className={styles.fundInputContainer}>
                                    <input
                                        type="text"
                                        name="content"
                                        value={fundContent}
                                        onChange={handleFundNewsChange}
                                        placeholder="오늘의 투자 뉴스를 입력해주세요."
                                    />
                                </div>
                                <div className={styles.fundInputRadioContainer}>
                                    <label htmlFor="true">
                                        성공&nbsp;
                                        <input
                                            type="radio"
                                            name="answer"
                                            value="true"
                                            onChange={handleFundAnswerChange}
                                            placeholder="오늘의 투자 뉴스 정답(베팅 정답)"
                                        />
                                    </label>
                                    &nbsp;&nbsp;
                                    <label htmlFor="false">
                                        실패&nbsp;
                                        <input
                                            type="radio"
                                            name="answer"
                                            value="false"
                                            onChange={handleFundAnswerChange}
                                            placeholder="오늘의 투자 뉴스 정답(베팅 정답)"
                                        />
                                    </label>
                                </div>

                                <button type="submit">투자 뉴스 등록하기</button>
                            </form>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
}
