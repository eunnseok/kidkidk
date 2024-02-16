import styles from './ProfileNav.module.css';
import parentImg from '@images/parentImg.jpg';
import { profileInfoState } from '../store/profileInfoAtom.js';
import { useRecoilValue, useRecoilState } from 'recoil';

export default function ProfileNav({ profileName }) {
    const profileInfo = useRecoilValue(profileInfoState);
    return (
        <>
            <div className={styles.profileNavContainer}>
                <div className={styles.profileNavContainerStart}>
                    <div className={styles.profileImageContainer}>
                        <img src={profileInfo.profileImage} alt="부모 프로필" />
                    </div>
                    <span>{profileName}</span>
                </div>
            </div>
        </>
    );
}
