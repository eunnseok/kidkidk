import styles from './ChildMain.module.css';
import ChildMainManagement from './ChildMainManagement.jsx';
import ChildMainStatement from './ChildMainStateMent.jsx';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { profileInfoState } from '../../store/profileInfoAtom.js';

function ChildMain() {
    const profileInfo = useRecoilValue(profileInfoState);
    console.log('프로필정보', profileInfo);
    const [left, setLeft] = useState(0);
    const [selectedToggle, setSelectedToggle] = useState(0);

    function Toggle({ num, title }) {
        const isSelected = selectedToggle === num;

        const handleToggleClick = (num) => {
            setSelectedToggle(num);

            if (num === 0) {
                setLeft(0);
            } else if (num === 1) {
                setLeft(190);
            }
        };

        const textClass = isSelected ? styles.textselected : styles.textunselected;
        const lineClass = isSelected ? styles.lineselected : styles.lineunselected;

        return (
            <div className={`${textClass}`} onClick={() => handleToggleClick(num)}>
                {title}
                <div className={`${lineClass}`} />
            </div>
        );
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.main}>
                <div className={styles.toggle}>
                    <Toggle num={0} title={'관리'} />
                    <Toggle num={1} title={'내역'} />
                </div>
                <div className={styles.content}>
                    {selectedToggle === 0 && <ChildMainManagement />}
                    {selectedToggle === 1 && <ChildMainStatement />}
                </div>
            </div>
        </div>
    );
}

export default ChildMain;
