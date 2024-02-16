import alarmDoneStamp from '@images/alarmDoneStamp.png';
import alarmAcceptExchange from '@images/alarmAcceptExchange.png';
import alarmCheckRead from '@images/alarmCheckRead.png';

import styles from './ParentAlarm.module.css';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { lastEventIdState, notificationsState, sseState } from '../store/alarmAtom';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { getChildIds } from '@store/childIdsAtom.js';
import { sendAlarm, jobDone, acceptExchange } from '../apis/api/alarm';
import { uniqBy } from 'lodash';

export default function ParentAlarm() {
    const [notifications, setNotifications] = useRecoilState(notificationsState);

    const [childIdsData, setChildIdsData] = useRecoilState(getChildIds);

    const [selected, setSelected] = useState('전체');

    const handleClickJobDone = (key, childId) => {
        jobDone(
            childId,
            (success) => {
                sendAlarm(childId.toString(), '', '업무 완료 요청이 처리되었습니다!', '', '', 0, 0);
            },
            (fail) => {
                console.log(fail);
            }
        );
        setNotifications(notifications.map((noti) => (noti.key === key ? { ...noti, read: !noti.read } : noti)));
    };

    const handleClickAcceptExchange = (key, childId, amount) => {
        // acceptExchange(childId, amount,
        //     (success) => {
        //         sendAlarm(childId.toString(), "", "환전 요청이 처리되었습니다!", `${amount}도토리 출금`, "", 0, 0);
        //     },
        //     (fail) => {
        //         console.log(fail);
        //     })
        sendAlarm(childId.toString(), '', '환전 요청이 처리되었습니다!', `${amount}도토리 출금`, '', 0, 0);
        setNotifications(notifications.map((noti) => (noti.key === key ? { ...noti, read: !noti.read } : noti)));
    };

    const deleteReadNotifications = () => {
        setNotifications(notifications.filter((noti) => !noti.read));
    };

    const handleClickChild = (e) => {
        setSelected(e.target.value);
    };

    const AlarmContents = ({ parentAlarmData }) => {
        return (
            <>
                {parentAlarmData &&
                    parentAlarmData.map((item) => (
                        <>
                            {!item.read ? (
                                <div
                                    key={item.key}
                                    className={styles.card}
                                    style={{
                                        color: item.require === 'job' ? '#80759E' : '#8e4865',
                                        borderColor: item.require === 'job' ? '#80759E' : '#8e4865',
                                    }}
                                >
                                    <div className={styles.cardContent}>
                                        <div>{item.title}</div>
                                        <div style={{ fontSize: '12px' }}>{item.content}</div>
                                    </div>
                                    {item.require === 'job' ? (
                                        <img
                                            src={alarmDoneStamp}
                                            onClick={() => handleClickJobDone(item.key, item.childId)}
                                            style={{ width: '100px', height: '30px', cursor: 'pointer' }}
                                        />
                                    ) : (
                                        <img
                                            src={alarmAcceptExchange}
                                            onClick={() =>
                                                handleClickAcceptExchange(item.key, item.childId, item.amount)
                                            }
                                            style={{ width: '100px', height: '30px', cursor: 'pointer' }}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div
                                    key={item.key}
                                    className={styles.card}
                                    style={{
                                        color: '#C1B8AD',
                                        borderColor: '#C1B8AD',
                                    }}
                                >
                                    <div className={styles.cardContent}>
                                        <div>{item.title}</div>
                                        <div style={{ fontSize: '12px' }}>{item.content}</div>
                                    </div>
                                    <img
                                        src={alarmCheckRead}
                                        style={{ width: '2vw', height: '2vw', cursor: 'pointer' }}
                                    />
                                </div>
                            )}
                        </>
                    ))}
            </>
        );
    };
    return (
        <>
            <div className={styles.parentAlarmContainer}>
                <div className={styles.parentAlarmTitle}>
                    <p>알림 현황</p>
                </div>
                <div className={styles.parentAlarmButtons}>
                    <button value="전체" onClick={handleClickChild}>
                        전체
                    </button>
                    {childIdsData.map((child) => (
                        <button key={child.childId} value={child.nickname} onClick={handleClickChild}>
                            {child.nickname}
                        </button>
                    ))}
                </div>
                <div className={styles.parentAlarmInfo}>
                    {selected === '전체' ? (
                        <span>미확인 알림 : {uniqBy(notifications, 'key').filter((noti) => !noti.read).length}개</span>
                    ) : (
                        <span>
                            미확인 알림 :{' '}
                            {
                                uniqBy(notifications, 'key').filter((noti) => noti.pubName === selected && !noti.read)
                                    .length
                            }
                            개
                        </span>
                    )}
                    <button onClick={deleteReadNotifications} className={styles.parentAlarmContainer}>
                        모든 읽은 알림 삭제
                    </button>
                </div>
                <div className={styles.parentAlarmContents}>
                    {selected === '전체' ? (
                        <AlarmContents parentAlarmData={uniqBy(notifications, 'key')} />
                    ) : (
                        <AlarmContents
                            parentAlarmData={uniqBy(notifications, 'key').filter((noti) => noti.pubName === selected)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
