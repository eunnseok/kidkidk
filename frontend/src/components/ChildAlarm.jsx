import styles from './ChildAlarm.module.css';
import alarmCheck from '@images/alarmCheck.png';
import alarmCheckRead from '@images/alarmCheckRead.png'
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { notificationsState} from '../store/alarmAtom';
import { uniqBy } from 'lodash';

function ChildAlarm() {
    const [notifications, setNotifications] = useRecoilState(notificationsState);
    

    const handleClickRead = (key) => {
        setNotifications(notifications.map(noti => noti.key === key ? {...noti, read: !noti.read} : noti ));
    }

    const deleteReadNotifications = () => {
        setNotifications(notifications.filter(noti => !noti.read));
    }


    const Contents = ({ alarmData }) => {
        return (
            <>
                {alarmData.map((item) => (
                    <>
                    { !item.read ? (
                        <div key={item.key} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div>{item.title}</div>
                                <div style={{ fontSize: '12px' }}>{item.content}</div>
                            </div>
                            <img src={alarmCheck} onClick={() => handleClickRead(item.key)} style={{ width: '2vw', height: '2vw', cursor: 'pointer' }} />
                        </div>
                    ) :
                    ( 
                        <div key={item.key} className={styles.cardRead}>
                        <div className={styles.cardContent}>
                            <div>{item.title}</div>
                            <div style={{ fontSize: '12px' }}>{item.content}</div>
                        </div>
                        <img src={alarmCheckRead} style={{ width: '2vw', height: '2vw'}} />
                    </div>

                    )}
                    </>
                    
                ))}
            </>
        );
    };

    return (
        <div className={styles.alarmContainer}>
            <div className={styles.title}>알림 현황</div>
            <div className={styles.content}>
                <div className={styles.cardHead}>
                    <div>미확인 알림 : {uniqBy(notifications, 'key').filter(noti => !noti.read).length}개</div>
                    <div className={styles.alarmDel} onClick={deleteReadNotifications}>모든 읽은 알림 삭제</div>
                </div>
                <div className={styles.cards}>
                    <Contents alarmData={uniqBy(notifications, 'key')} />
                </div>
            </div>
        </div>
    );
}

export default ChildAlarm;
