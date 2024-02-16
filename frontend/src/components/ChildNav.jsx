import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '@images/logo.png';
import bell from '@images/bell.png';
import acornImg from '@images/acorn.png';
import styles from './ChildNav.module.css';
import s from 'classnames'; /* 클래스네임을 여러개 쓰기 위함 */
import { useState, useEffect } from 'react';
import { transferToFundMoney } from '@api/profile.js';
import { transferToCoin } from '@api/fund.js';
import Modal from 'react-modal';
import ChildAlarm from './ChildAlarm.jsx';
import { getChild, updateChild } from '@api/child.js';
import { profileSelectAll } from '@api/profile.js';
import { getJob } from '@api/job.js';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userInfoState } from '../store/userInfoAtom.js';
import { profileInfoState, parentProfileState } from '../store/profileInfoAtom.js';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { sseState, lastEventIdState, notificationsState } from '../store/alarmAtom';

function ChildNav() {
    const userInfo = useRecoilValue(userInfoState);
    const profileInfo = useRecoilValue(profileInfoState);

    const userId = userInfo.userId;
    const childId = profileInfo.profileId;
    const navigate = useNavigate();
    const location = useLocation(); // 현재 url을 확인
    const [top, setTop] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [chargeModalIsOpen, setChargeModalIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 입/출금 모달 페이지
    const [chargeCoinIn, setChargeCoinIn] = useState(''); // 입금 input 모달 페이지
    const [chargeCoinOut, setChargeCoinOut] = useState(''); // 출금 input 모달 페이지
    const [child, setChild] = useState([]); // 자식 테이블(코인, 투자자산)
    const [childProfile, setChildProfile] = useState([]); // 아이 프로필
    const [parentProfile, setParentProfile] = useRecoilState(parentProfileState); // 부모 프로필
    const [childJob, setChildJob] = useState([]); // 아이 직업

    const a = ['6vh', '16vh', '26vh', '41.5%'];
    // const [child, setChild] = useState([{
    //     coin : 0,
    //     fundMoney : 0
    // }]);

    const EventSource = EventSourcePolyfill || NativeEventSource;
    const [sse, setSse] = useRecoilState(sseState);
    const [lastEventId, setLastEventId] = useRecoilState(lastEventIdState);
    const [notifications, setNotifications] = useRecoilState(notificationsState);

    const kafkaSub = () => {
        setSse(
            (new EventSource(`https://notification.silvstone.xyz/subscribe/${profileInfo.profileId}`, {
                // headers: {
                //     'Last-Event-ID': lastEventId,
                // },
                heartbeatTimeout: 5 * 60 * 1000,
            }).onmessage = (event) => {
                if (event) {
                    if (event.data !== 'connected!') {
                        setNotifications((prev) => [...prev, JSON.parse(event.data)]);
                    }
                }
            })
        );
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

    // 아이 직업 테이블 조회
    useEffect(() => {
        getJob(
            childId,
            (success) => {
                setChildJob(success.data.Job);
                console.log(childJob.length);
            },
            (fail) => {
                console.log(fail);
            }
        );
        return () => {
            // console.log('ChildManagement userEffect return');
        };
    }, []);

    // 프로필 모두 가져오기
    useEffect(() => {
        profileSelectAll(
            userId,
            (success) => {
                // console.log(success.data);
                const matchingProfile = success.data.find((profile) => profile.profileId === childId);
                // 일치하는 객체가 있으면 해당 객체를 setProfile에 저장
                if (matchingProfile) {
                    setChildProfile(matchingProfile);
                }

                const matchingProfile1 = success.data.find((profile) => profile.type === true);
                // 일치하는 객체가 있으면 해당 객체를 setProfile에 저장
                if (matchingProfile1) {
                    setParentProfile(matchingProfile1);
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

    // child 테이블 수정
    const handleUpdateChild = () => {
        // coin은 currentIndex가 0이면 투자 주머니로 입금
        const coin = currentIndex === 0 ? child.coin - chargeCoinIn : child.coin + parseInt(chargeCoinOut);

        // fundMoney
        const fundMoney =
            currentIndex === 0 ? child.fundMoney + parseInt(chargeCoinIn) : child.fundMoney - chargeCoinOut;

        const updateChildMoney = {
            coin: coin,
            fundMoney: fundMoney,
            childId: childId,
        };

        // 성공 콜백 함수
        const successCallback = () => {
            // 성공 시 실행할 코드
            // console.log('아이테이블이 성공적으로 수정되었습니다.');
            // 업데이트 된 값으로 변경
            setChild(updateChildMoney);
            // 모달을 닫고 데이터를 다시 가져오기
            setChargeModalIsOpen(false);
        };

        // 실패 콜백 함수
        const errorCallback = (error) => {
            // 실패 시 실행할 코드
            console.error('수정 중 오류가 발생했습니다:', error);
        };

        updateChild(updateChildMoney, successCallback, errorCallback);
    };

    useEffect(() => {
        // 자식 테이블 조회
        getChild(
            childId,
            (success) => {
                // console.log(success.data);
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
        // 페이지가 로드될 때 현재 URL을 확인하여 알맞은 탭을 활성화
        const pathMap = {
            '/child/main': 0,
            '/child/fund': 1,
            '/child/saving': 2,
            '/child/edu': 3,
        };
        const currentTop = pathMap[location.pathname] || 0;
        setTop(currentTop);
    }, [location]);

    // 입금 및 출금 모달 열기
    const openChargeModal = () => {
        setChargeCoinIn('');
        setChargeCoinOut('');
        setCurrentIndex(0);
        setChargeModalIsOpen(true);
    };

    // 입금 input 태그에 적은 금액
    const handleInputChargeIn = (e) => {
        const value = e.target.value;
        setChargeCoinIn(value);
    };

    // 출금 input 태그에 적은 금액
    const handleInputChargeOut = (e) => {
        const value = e.target.value;
        setChargeCoinOut(value);
    };

    const handleCoinIn = () => {
        const coinInValue = parseInt(chargeCoinIn, 10);
        transferToFundMoney(
            {
                coin: coinInValue,
                childId: childId,
            },
            () => {
                setChild((prevChild) => ({
                    ...prevChild,
                    coin: prevChild.coin - coinInValue,
                    fundMoney: prevChild.fundMoney + coinInValue,
                }));
            },
            (fail) => {
                console.log(fail);
            }
        );
    };

    const handleCoinOut = () => {
        const coinOutValue = parseInt(chargeCoinOut, 10);
        transferToCoin(
            {
                fundMoney: coinOutValue,
                childId: childId,
            },
            () => {
                setChild((prevChild) => ({
                    ...prevChild,
                    coin: prevChild.coin + coinOutValue,
                    fundMoney: prevChild.fundMoney - coinOutValue,
                }));
            },
            (fail) => {
                console.log(fail);
            }
        );
    };

    const changeModalContent = (index) => {
        setCurrentIndex(index);
    };

    const handleMain = (num) => {
        setTop(num);

        const pathMap = {
            0: '/child/main',
            1: '/child/fund',
            2: '/child/saving',
            3: '/child/edu',
        };

        const newPath = pathMap[num] || '/child/main';
        navigate(newPath);
    };

    function Component({ num, title }) {
        return (
            <div className={s(styles.btn, top === num && styles.select)} onClick={() => handleMain(num)}>
                {title}
            </div>
        );
    }

    const handleLogout = () => {
        console.log('Enter handleLogout');
        console.log(document.cookie);
        const confirmLogout = confirm('프로필 전환 하시겠습니까?');
        if (confirmLogout) {
            navigate('/profile');
        }
    };

    const handleLogoClick = () => {
        navigate('/child/main');
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <div className={styles.logo}>
                    <img src={logo} className={styles.logoImg} onClick={handleLogoClick} />
                </div>

                <div className={styles.menu}>
                    <Component num={0} title={'메인'} />
                    <Component num={1} title={'투자'} />
                    <Component num={2} title={'적금'} />
                </div>
                <div className={styles.light} style={{ top: a[top] }}>
                    <div className={styles.rectangleRow}></div>
                    <div className={styles.rectangleCol}>
                        <div className={styles.rectangleMin1}></div>
                        <div className={styles.rectangleMin2}></div>
                    </div>
                </div>
                <div className={styles.logout} onClick={handleLogout}>
                    프로필 전환
                </div>
            </div>
            <div className={styles.contents}>
                <Outlet />
            </div>
            <div className={styles.profile}>
                <div className={styles.imgContainer}>
                    <img src={profileInfo.profileImage} />
                </div>
                <div>{childProfile.nickname}</div>
                {childJob !== undefined && <div>직업 : {childJob.name}</div>}
                <div>부모 : {parentProfile.nickname}</div>
            </div>
            <div className={styles.pocket1}>
                <div className={styles.pocketTitle}>나의 주머니</div>
                <div className={styles.pocketContainer}>
                    <div className={styles.pocketCoin}>
                        {child.coin !== undefined ? <>{child.coin} 도토리</> : <>0 도토리</>}
                        <img src={acornImg} style={{ width: '1.5vw' }} />
                    </div>
                    <div className={styles.refundBtn} onClick={() => navigate('/child/refund')}>
                        환전하기
                    </div>
                </div>
            </div>
            <div className={styles.pocket2}>
                <div className={styles.pocketTitle}>투자 주머니</div>
                <div className={styles.pocketContainer}>
                    <div className={styles.pocketCoin}>
                        {child.fundMoney !== undefined ? <>{child.fundMoney} 도토리</> : <>0 도토리</>}
                        <img src={acornImg} style={{ width: '1.5vw' }} />
                    </div>
                    <div className={styles.refundBtn} onClick={openChargeModal}>
                        입금 및 출금하기
                    </div>
                </div>
            </div>
            <Modal
                appElement={document.getElementById('root')}
                isOpen={chargeModalIsOpen}
                onRequestClose={() => setChargeModalIsOpen(false)}
                className={`${styles.modal} ${
                    currentIndex === 0 ? styles.modalDeepGreen : currentIndex === 1 ? styles.modalLightGreen : ''
                }`}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                    content: {
                        // backgroundColor: '#F7F5F1',
                        borderRadius: '15px',
                        width: '30vw',
                        height: '50vh',
                        padding: '1vw',
                        top: '20%',
                        left: '35%',
                        position: 'absolute',
                        zIndex: '999',
                    },
                }}
            >
                <div className={styles.modalContainer}>
                    <div className={styles.modalHead}>
                        <div
                            className={`${styles.modalHead1} ${
                                currentIndex === 0 ? styles.deepGreenColor : styles.grayColor
                            }`}
                            onClick={() => changeModalContent(0)}
                        >
                            입금
                        </div>
                        <div
                            className={`${styles.modalHead2} ${
                                currentIndex === 1 ? styles.lightGreenColor : styles.grayColor
                            }`}
                            onClick={() => changeModalContent(1)}
                        >
                            출금
                        </div>
                    </div>
                    <div className={styles.modalBody}>
                        {currentIndex === 0 && (
                            <div className={styles.modalBody}>
                                <div className={styles.chargeModalTitle1}>투자 주머니에 입금하기</div>
                                <div className={styles.chargeModalContent}>
                                    <div className={styles.chargeModalText}>최대 입금 가능</div>
                                    <div className={styles.chargeModalContent2}>
                                        <div className={styles.chargeModalText}>{child.coin} 도토리</div>
                                        <img src={acornImg} style={{ width: '1.5vw' }} />
                                    </div>
                                </div>
                                <div className={styles.chargeModalContent1}>
                                    <input
                                        type="number"
                                        placeholder="도토리 개수 입력"
                                        value={chargeCoinIn}
                                        onChange={handleInputChargeIn}
                                        className={styles.input}
                                    />
                                    <div className={styles.modalMax}>개 도토리 입금하기</div>
                                </div>
                                <div
                                    className={styles.chargeModalBtn1}
                                    onClick={() => {
                                        if (chargeCoinIn > child.coin) {
                                            alert('입금할 도토리 개수가 최대 입금 가능 도토리 개수보다 많습니다.');
                                            return; // 입금할 수 없으므로 함수 종료
                                        }
                                        handleUpdateChild();
                                    }}
                                >
                                    입금하기
                                </div>
                            </div>
                        )}
                        {currentIndex === 1 && (
                            <div className={styles.modalBody}>
                                <div className={styles.chargeModalTitle2}>나의 주머니로 출금하기</div>
                                <div className={styles.chargeModalContent}>
                                    <div className={styles.chargeModalText}>최대 출금 가능</div>
                                    <div className={styles.chargeModalContent2}>
                                        <div className={styles.chargeModalText}>{child.fundMoney} 도토리</div>
                                        <img src={acornImg} style={{ width: '1.5vw' }} />
                                    </div>
                                </div>
                                <div className={styles.chargeModalContent1}>
                                    <input
                                        type="number"
                                        placeholder="도토리 개수 입력"
                                        value={chargeCoinOut}
                                        onChange={handleInputChargeOut}
                                        className={styles.input}
                                    />
                                    <div className={styles.modalMax}>개 도토리 출금하기</div>
                                </div>
                                <div
                                    className={styles.chargeModalBtn2}
                                    onClick={() => {
                                        if (chargeCoinOut > child.fundMoney) {
                                            alert('출금할 도토리 개수가 최대 출금 가능 도토리 개수보다 많습니다.');
                                            return;
                                        }
                                        handleUpdateChild();
                                    }}
                                >
                                    출금하기
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            <div
                onClick={() => {
                    setModalIsOpen(true);
                    kafkaSub();
                }}
            >
                <img src={bell} className={styles.alarm} />
            </div>
            <Modal
                appElement={document.getElementById('root')}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
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
                <ChildAlarm />
            </Modal>
        </div>
    );
}

export default ChildNav;
