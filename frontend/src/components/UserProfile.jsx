//실험
import { profileCreate, profileLogin, profileSelectAll, profileUpdate, profileDelete } from '/src/apis/api/profile.js';
//실험
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoMdSettings } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { RiLockPasswordFill } from 'react-icons/ri';
import ProfileModal from '../../src/components/ProfileModal.jsx';
import Modal from 'react-modal';

import styles from './UserProfile.module.css';
import kidImg from '@images/kidImg.jpg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { profileInfoState } from '../store/profileInfoAtom';
import { getChild } from '../apis/api/profile.js';

export default function UserProfile({ profileId, nickname, profile_image, userType }) {
    const navigate = useNavigate();
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalLoginOpen, setModalLoginOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);

    const openModalLogin = () => setModalLoginOpen(true);
    const openModalUpdate = () => setModalUpdateOpen(true);

    //onChange
    //업데이트 API에 쓰이는 onChange
    const onChangeUpdateNickname = (e) => {
        setNick(e.target.value);
        setUpdateUser({
            ...updateUser,
            nickname: e.target.value,
        });
        console.log('타켓 벨류 : ' + e.target.value);
        console.log('바뀐 닉네임 : ' + updateUser.nickname);
    };

    // 프로필 수정 비밀번호
    const onChangeUpdatePin = (e) => {
        const enteredValue = e.target.value;
        // 정규 표현식을 사용하여 4개의 숫자만 입력 가능하도록 함
        if (/^\d{0,4}$/.test(enteredValue)) {
            setPassword(enteredValue);
            setUpdateUser({
                ...updateUser,
                pin: e.target.value,
            });
        }
        // console.log('타켓 벨류 : ' + e.target.value)
        // console.log('바뀐 핀 : ' + updateUser.pin)
    };

    // 프로필 수정 비밀번호 확인
    const onChangeConfirmPassword = (e) => {
        const enteredValue = e.target.value;
        if (/^\d{0,4}$/.test(enteredValue)) {
            setConfirmPassword(enteredValue);
        }
    };

    //삭제 실험
    //버튼누르면 프로필 삭제
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleClick = (e) => {
        // e.preventDefault();
        setIsButtonClicked(true);
    };
    //버튼누르면 프로필 삭제

    const [deleteData, setDeleteData] = useState([{}]);

    const [profile, serProfile] = useState({
        profileId: profileId, //오른쪽은 유저 각각의 프로필 아이디
        nickname: 'string',
        profileImage: profile_image,
        type: true,
        userId: 1,
    });

    useEffect(() => {
        if (isButtonClicked) {
            //   console.log('Profile Delete Enter');
            profileDelete(
                profile,
                (deleteData) => {
                    setDeleteData(deleteData.data);
                    //   console.log(deleteData.data);
                },
                (fail) => {
                    console.log(fail);
                }
            );
        }
        return () => {
            <div>{/* console.log('Profile Delete return'); */}</div>;
        };
    }, [isButtonClicked]);
    //삭제 실험

    // 수정 실험 2024/02/07
    const [updateButtonClicked, setUpdateButtonClicked] = useState(false);

    // 프로필 수정 버튼
    const updateClick = () => {
        if (nick === '') {
            alert('닉네임을 입력해주세요.');
        } else if (password === '') {
            alert('비밀번호를 입력해주세요.');
        } else if (confirmPassword === '') {
            alert('비밀번호를 확인해주세요.');
        } else {
            setUpdateButtonClicked(true);
        }
    };

    const [updateData, setUpdateData] = useState([{}]);

    const [updateUser, setUpdateUser] = useState({
        profileId: profileId, //오른쪽은 유저 각각의 프로필 아이디
        nickname: '',
        pin: 0,
        profileImage: profile_image,
    });

    //  console.log(updateUser.profileId);
    //  console.log(updateUser.nickname);
    useEffect(() => {
        if (updateButtonClicked) {
            // console.log('Profile Update Enter');
            // console.log(updateUser.profileId);
            profileUpdate(
                updateUser,
                (updateData) => {
                    // console.log(updateData.data);
                    setUpdateData(updateData.data);
                    //    console.log(updateUser.profileId);
                },
                (fail) => {
                    console.log(fail);
                }
            );
            //    console.log('Profile Update mid');
        }
        return () => {
            //  console.log('Profile Update return');
        };
    }, [updateButtonClicked]);

    //수정 실험 2024/02/07

    // 로그인처리
    const [profileInfo, setProfileInfo] = useRecoilState(profileInfoState);

    const [loginUser, setLoginUser] = useState({
        profileId: profileId, //오른쪽은 유저 각각의 프로필 아이디
        nickname: nickname,
        pin: '',
        type: userType,
        profileImage: profile_image,
    });

    const onChangeLoginPin = (e) => {
        const enteredValue = e.target.value;
        if (/^\d{0,4}$/.test(enteredValue)) {
            setPassword(enteredValue);
            setLoginUser({
                ...loginUser,
                pin: e.target.value,
            });
        }
        // console.log('타켓 벨류 : ' + e.target.value);
        // console.log('바뀐 핀 : ' + loginUser.pin);
    };

    const loginClick = (e) => {
        e.preventDefault();
        profileLogin(
            loginUser,
            async (Data) => {
                // console.log('로그인 성공', Data.data);
                await setProfileInfo(Data.data);
                if (Data.data.type) {
                    navigate('/parent');
                } else {
                    getChild(
                        loginUser,
                        (val) => {
                            setProfileInfo((prevProfileInfo) => ({ ...prevProfileInfo, ...val.data }));
                            navigate('/child');
                        },
                        (fail) => {
                            console.log(fail);
                        }
                    );
                }
            },
            (fail) => {
                alert('비밀번호를 잘못입력하였습니다.');
                setPassword('');
                // console.log('오류오류 : ', fail);
            }
        );
    };

    return (
        <>
            <div className={styles.userProfileContainer}>
                <div className={styles.userProfileImageContainer}>
                    <button onClick={openModalLogin}>
                        <img src={profile_image} alt="프로필 이미지" />
                    </button>
                </div>
                <div className={styles.userProfileNameContainer}>
                    <div>{nickname}</div>

                    <div className={styles.userProfileNameContainerBtn} onClick={openModalUpdate}>
                        <IoMdSettings />
                    </div>
                </div>
            </div>

            <Modal
                appElement={document.getElementById('root')}
                isOpen={modalLoginOpen}
                onRequestClose={() => setModalLoginOpen(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                    content: {
                        backgroundColor: '#F8F3E7',
                        borderRadius: '15px',
                        width: '35vw',
                        height: '35vh',
                        margin: 'auto',
                        padding: '30px',
                        position: 'absolute',
                        zIndex: '999',
                    },
                }}
            >
                <div className={styles.profileLoginModal}>
                    <div className={styles.profileLoginModalTitle}>프로필 로그인</div>
                    <form onSubmit={loginClick} className={styles.profileLoginForm}>
                        <div className={styles.profileInputContainer}>
                            <input
                                type="password"
                                value={password}
                                placeholder="비밀번호를 입력해주세요"
                                onChange={onChangeLoginPin}
                            />

                            <div className={styles.iconContainer}>
                                <RiLockPasswordFill />
                            </div>
                        </div>

                        <button>로그인</button>
                    </form>
                </div>
            </Modal>

            <Modal
                appElement={document.getElementById('root')}
                isOpen={modalUpdateOpen}
                onRequestClose={() => setModalUpdateOpen(false)}
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                    content: {
                        backgroundColor: '#F8F3E7',
                        borderRadius: '15px',
                        width: '40vw',
                        height: '50vh',
                        margin: 'auto',
                        padding: '30px',
                        position: 'absolute',
                        zIndex: '999',
                    },
                }}
            >
                <div className={styles.profileUpdateModal}>
                    <div className={styles.profileLoginModalTitle}>프로필 수정</div>
                    <form className={styles.profileUpdateForm}>
                        <div>
                            <ul className={styles.profileUpdateUl}>
                                <li>
                                    <div className={styles.profileUpdateFormInputContainer}>
                                        <div className={styles.profileUpdateContainerTitle}>닉네임</div>
                                        <input
                                            type="text"
                                            value={nick}
                                            className={styles.profileUpdateContainerInput}
                                            onChange={onChangeUpdateNickname}
                                            placeholder="닉네임을 입력해주세요"
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.profileUpdateFormInputContainer}>
                                        <div className={styles.profileUpdateContainerTitle}>비밀번호</div>
                                        <input
                                            type="password"
                                            value={password}
                                            className={styles.profileUpdateContainerInput}
                                            onChange={onChangeUpdatePin}
                                            placeholder="숫자 4개 입력해주세요"
                                        />
                                    </div>
                                </li>
                                <li>
                                    <div className={styles.profileUpdateFormInputContainer}>
                                        <div className={styles.profileUpdateContainerTitle}>비밀번호 확인</div>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            className={styles.profileUpdateContainerInput}
                                            onChange={onChangeConfirmPassword}
                                            placeholder="비밀번호 확인"
                                        />
                                    </div>
                                </li>
                            </ul>
                            {password !== confirmPassword && confirmPassword && (
                                <div className={styles.passwordCheck}>비밀번호가 일치하지 않습니다.</div>
                            )}
                        </div>
                        <div className={styles.profileUpdateFormButtonContainer}>
                            <button className={styles.profileUpdateBtn1} onClick={updateClick}>
                                프로필 수정
                            </button>
                            <button className={styles.profileUpdateBtn2} onClick={handleClick}>
                                프로필 삭제
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
