import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logo from '@images/logo.png';
import ProfileNav from './ProfileNav';
import Modal from 'react-modal';
import { createRef, useEffect, useState, useRef } from 'react';
import ParentAlarm from './ParentAlarm';
import { useRecoilState, useRecoilValue } from 'recoil';
import { profileInfoState } from '../store/profileInfoAtom.js';

import { getChildIds, childIdAtom, childNickNameAtom } from '@store/childIdsAtom.js';
import { userInfoState } from '@store/userInfoAtom.js';
import { getChildList } from '@api/profile.js';

import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { sseState, lastEventIdState, notificationsState } from '../store/alarmAtom';

import styles from './ParentNav.module.css';
import s from 'classnames'; /* 클래스네임을 여러개 쓰기 위함 */
import bell from '@images/bell.png';

function ParentNav() {
    const profileInfo = useRecoilValue(profileInfoState);

    const navigate = useNavigate();
    const location = useLocation(); // 현재 url을 확인
    const [top, setTop] = useState(0);
    const a = ['6vh', '16vh', '26vh'];

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
                    // setLastEventId(event.lastEventId);
                }
            })
        );
    };

    useEffect(() => {
        // 페이지가 로드될 때 현재 URL을 확인하여 알맞은 탭을 활성화
        const pathMap = {
            '/parent/main': 0,
            '/parent/job': 1,
            '/parent/fundsaving': 2,
        };
        const currentTop = pathMap[location.pathname] || 0;
        setTop(currentTop);
    }, [location]);

    const handleMain = (num) => {
        setTop(num);

        const pathMap = {
            0: '/parent/main',
            1: '/parent/job',
            2: '/parent/fundsaving',
        };

        const newPath = pathMap[num] || '/parent/main';
        navigate(newPath);
    };

    // 탭 전환을 위한 childId 받아오기
    const userInfo = useRecoilValue(userInfoState);
    const userId = userInfo.userId;
    //console.log(userId);
    const [childIdsData, setChildIdsData] = useRecoilState(getChildIds);
    useEffect(() => {
        getChildList(
            userId,
            (success) => {
                //console.log(success.data);
                setChildIdsData(success.data);
            },
            (fail) => {
                console.log(fail);
            }
        );
    }, []);
    //console.log(childIdsData);

    const [parentChildId, setParentChildId] = useRecoilState(childIdAtom);
    const [parentChildNickName, setParentChildNickName] = useRecoilState(childNickNameAtom);
    const childIdRefs = useRef([]);
    const handleTabClick = (childId, childNickName) => {
        console.log('Clicked childId:', childId);

        setParentChildId(childId);
        setParentChildNickName(childNickName);
        window.location.reload();
    };

    // 부모 모달 창
    const [parentAlarmOpen, setparentAlarmOpen] = useState(false);

    const parentAlarmModalIsOpen = () => setparentAlarmOpen(true);
    // console.log(typeof parentAlarmModalIsOpen);
    const parentAlarmCloseModal = () => setparentAlarmOpen(false);

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
        navigate('/parent/main');
    };

    return (
        <div className={styles.container}>
            <div className={styles.nav}>
                <div className={styles.logo}>
                    <img src={logo} className={styles.logoImg} onClick={handleLogoClick} />
                </div>
                <div className={styles.menu}>
                    <Component num={0} title={'메인'} />
                    <Component num={1} title={'직업'} />
                    <Component num={2} title={'투자/적금'} />
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
                <ProfileNav profileName={profileInfo.nickname} />
                {/* 아이 탭 */}
                <div className={styles.parentChildTab}>
                    {childIdsData.map((data, index) => {
                        const childIdRef = createRef();

                        // 배열에 각 div에 대한 ref 추가
                        childIdRefs.current[index] = childIdRef;

                        return (
                            <div
                                key={data.nickname}
                                className={styles.parentChildTabContainer}
                                name={data.childId}
                                onClick={() => handleTabClick(data.childId, data.nickname)}
                                ref={childIdRef}
                                style={{
                                    backgroundColor: parentChildId === data.childId ? '#35b356' : '#90c354',
                                }}
                            >
                                <div>{data.nickname}</div>
                            </div>
                        );
                    })}
                </div>
                <div
                    onClick={() => {
                        setparentAlarmOpen(true);
                        kafkaSub();
                    }}
                >
                    <img src={bell} className={styles.alarm} />
                </div>
                {parentAlarmOpen ? (
                    <Modal
                        appElement={document.getElementById('root')}
                        isOpen={!!parentAlarmModalIsOpen}
                        // onAfterOpen={afterOpenModal}
                        onRequestClose={parentAlarmCloseModal}
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
                        <ParentAlarm />
                    </Modal>
                ) : null}
            </div>
        </div>
    );
}

export default ParentNav;
