import { profileCreate, profileLogin, profileSelectAll, profileUpdate, profileDelete } from '/src/apis/api/profile.js';
import React, { useState, useEffect } from 'react';
import { CgProfile } from 'react-icons/cg';
import { RiLockPasswordFill } from 'react-icons/ri';
import { RiParentLine } from 'react-icons/ri';
import { FaRegImage } from 'react-icons/fa6';
import Modal from 'react-modal';
import UserProfile from '../../components/UserProfile';
import ProfileModal from '../../components/ProfileModal';
import styles from './Profile.module.css';
import profilePlus from '@images/profilePlus.png';
import child1 from '@images/child1.png';
import child2 from '@images/child2.png';
import parent1 from '@images/parent1.png';
import parent2 from '@images/parent2.png';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store/userInfoAtom';

export default function Profile() {
    /**
     * 리코일userinfo 상태 불러오기
     */
    const userInfo = useRecoilValue(userInfoState);
    console.log('userinfo : ', userInfo);

    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(''); // 이미지 경로 저장
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [createData, setCreateData] = useState([{}]); //profileCreate API데이터 받아오기
    const [createUser, setCreateUser] = useState({
        nickname: '',
        pin: 0,
        profileImage: '',
        type: true,
        userId: userInfo.userId,
    });
    const [modalCreateOpen, setModalCreateOpen] = useState(false);
    const [imageType, setImageType] = useState('parent'); // 부모/자식 선택
    const [SelectAllData, setSelectAllData] = useState([{}]); //profileSelectAll API데이터 받아오기
    const [user, setUser] = useState({
        profileId: 0,
        nickname: 'string',
        profileImage: 'string',
        type: true,
        userId: 1,
    });

    // 프로필 이미지를 클릭했을 때
    const handleImageClick = (imagePath) => {
        setSelectedImage(`${imagePath}`); // 클릭한 이미지의 경로를 저장
    };

    // 모달 열기
    const openModalCreate = () => setModalCreateOpen(true);

    // 모달 열릴때 초기화
    useEffect(() => {
        if (modalCreateOpen) {
            setNickname('');
            setPassword('');
            setConfirmPassword('');
            setSelectedImage('');
            setImageType('parent');
        }
    }, [modalCreateOpen]);

    // 프로필 닉네임
    const onChangeCreateNickname = (e) => {
        setNickname(e.target.value);
        setCreateUser({
            ...createUser,
            nickname: e.target.value,
        });
        // console.log('타켓 벨류 : ' + e.target.value);
        // console.log('바뀐 닉네임 : ' + createUser.nickname);
    };

    // 프로필 비밀번호
    const onChangeCreatePin = (e) => {
        const enteredValue = e.target.value;
        // 정규 표현식을 사용하여 4개의 숫자만 입력 가능하도록 함
        if (/^\d{0,4}$/.test(enteredValue)) {
            setPassword(enteredValue);
            setCreateUser({
                ...createUser,
                pin: enteredValue,
            });
        }
        // console.log('타켓 벨류 : ' + e.target.value);
        // console.log('바뀐 핀 : ' + createUser.pin);
    };

    // 프로필 비밀번호 확인
    const onChangeConfirmPassword = (e) => {
        const enteredValue = e.target.value;
        if (/^\d{0,4}$/.test(enteredValue)) {
            setConfirmPassword(enteredValue);
        }
    };

    // 부모/자식 선택
    const onChangeCreateType = (e) => {
        setImageType(e.target.value);
        if (e.target.value == 'parent') {
            setCreateUser({
                ...createUser,
                type: true,
            });
        } else if (e.target.value == 'child') {
            setCreateUser({
                ...createUser,
                type: false,
            });
        }
        // console.log('타켓 벨류 : ' + e.target.value);
        // console.log('바뀐 타입 : ' + createUser.type);
    };

    // 프로필 등록 버튼 클릭 함수
    const handleClick = () => {
        if (nickname === '') {
            alert('닉네임을 입력해주세요.');
        } else if (password === '') {
            alert('비밀번호를 입력해주세요.');
        } else if (confirmPassword === '') {
            alert('비밀번호를 확인해주세요.');
        } else if (selectedImage === '') {
            // 프로필 이미지를 선택하지 않았을때 알람 띄우기
            alert('프로필 이미지를 선택해주세요.');
        } else {
            setIsButtonClicked(true);
        }
    };

    useEffect(() => {
        if (isButtonClicked) {
            // console.log('Profile Create Enter');
            // console.log('createUser 닉네임은 :' + createUser.nickname);

            createUser.profileImage = selectedImage;

            profileCreate(
                createUser,
                (createData) => {
                    setCreateData(createData.data);
                    // console.log(createData.data);
                },
                (fail) => {
                    // console.log(fail);
                }
            );
        }
        return () => {
            // console.log('Profile Create return');
        };
    }, [isButtonClicked]);

    useEffect(() => {
        // console.log('Profile SelectAll Enter');
        profileSelectAll(
            userInfo.userId,
            (SelectAllData) => {
                setSelectAllData(SelectAllData.data);
                // console.log(SelectAllData.data);
            },
            (fail) => {
                // console.log(fail);
            }
        );
        return () => {
            // <div>console.log('Profile SelectAll return');</div>;
        };
    }, []);

    // profileUpdate API 데이터 받아오기 실험중 2024/02/07
    // const [updateData, setUpdateData] = useState([{}]);

    // const [updateUser, setUpdateUser] = useState({
    //   profileId: 0,
    //   nickname: "string",
    //   pin: 0,
    //   profileImage: "string"
    // });

    //   useEffect(() => {
    //   console.log('Profile Update Enter');
    //   profileUpdate(updateUser,
    //     (updateData) => {
    //       setUpdateData(updateData.data);
    //       console.log(updateData.data);
    //     },
    //     (fail) => {
    //       console.log(fail);
    //     }
    //   );
    //   return () => {
    //     <div>
    //     console.log('Profile Update return');
    //     </div>
    //   };
    // }, []);

    //실험 2024/02/07

    // profileDelete API데이터 받아오기(쓰지않는 코드)
    // const [deleteData, setDeleteData] = useState([{}]);

    // const [profile, serProfile] = useState({
    //     profileId: 1,
    //     nickname: "string",
    //     profileImage: "string",
    //     type: true,
    //     userId: 1
    //   });
    //   useEffect(() => {
    //   console.log('Profile Delete Enter');
    //   profileDelete(profile,
    //     (deleteData) => {
    //       setDeleteData(deleteData.data);
    //       console.log(deleteData.data);
    //     },
    //     (fail) => {
    //       console.log(fail);
    //     }
    //   );
    //   return () => {
    //     <div>
    //     console.log('Profile Delete return');
    //     </div>
    //   };
    // }, []);

    // 가상의 프로필 데이터 배열
    // const profiles = [
    //     { nickname: '봉미선', profile_image: parentImg },
    //     { nickname: '김철수', profile_image: kidImg },
    //     // 추가적인 프로필 데이터...
    // ];

    return (
        <>
            {SelectAllData.map}
            <div className={styles.profileContainer}>
                <div className={styles.profileBox}>
                    {SelectAllData.map((profile) => (
                        <UserProfile
                            key={profile.profileId}
                            //실험
                            profileId={profile.profileId}
                            //실험
                            nickname={profile.nickname}
                            profile_image={profile.profileImage}
                            userType={profile.type}
                        />
                    ))}
                    <div>
                        <div className={styles.addProfileImageContainer} onClick={openModalCreate}>
                            <button>
                                <img src={profilePlus} alt="프로필 이미지" />
                            </button>
                            <span>프로필 추가</span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileptag}>프로필을 선택해주세요</div>
                <Modal
                    appElement={document.getElementById('root')}
                    isOpen={modalCreateOpen}
                    onRequestClose={() => setModalCreateOpen(false)}
                    style={{
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999' },
                        content: {
                            backgroundColor: '#F8F3E7',
                            borderRadius: '15px',
                            width: '40vw',
                            height: '70vh',
                            margin: 'auto',
                            padding: '30px',
                            position: 'absolute',
                            zIndex: '999',
                        },
                    }}
                >
                    <div className={styles.profileCreateModal}>
                        <div className={styles.profileCreateTitle}>프로필 등록</div>
                        <form className={styles.profileCreateForm}>
                            <div className={styles.profileInputContainer}>
                                <div className={styles.profileInputContainerTitle}>닉네임</div>
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={onChangeCreateNickname}
                                    placeholder="닉네임을 입력해주세요"
                                />

                                <div className={styles.iconContainer}>
                                    <CgProfile />
                                </div>
                            </div>

                            <div className={styles.profileInputContainer}>
                                <div className={styles.profileInputContainerTitle}>비밀번호</div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={onChangeCreatePin}
                                    placeholder="숫자 4개 입력해주세요"
                                />
                                <div className={styles.iconContainer}>
                                    <RiLockPasswordFill />
                                </div>
                            </div>

                            <div className={styles.profileInputContainer}>
                                <div className={styles.profileInputContainerTitle}>비밀번호 확인</div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={onChangeConfirmPassword}
                                    placeholder="비밀번호 확인"
                                />
                                <div className={styles.iconContainer}>
                                    <RiLockPasswordFill />
                                </div>
                            </div>

                            {password !== confirmPassword && confirmPassword && (
                                <div className={styles.passwordCheck}>비밀번호가 일치하지 않습니다.</div>
                            )}

                            <div className={styles.profileInputContainer}>
                                <div className={styles.profileInputContainerTitle}>부모 / 아이</div>
                                <div className={styles.profileInputRadioContainer}>
                                    <label htmlFor="true" className={styles.profileInputRadioConent}>
                                        <input
                                            type="radio"
                                            id="true"
                                            name="answer"
                                            value="parent"
                                            onChange={onChangeCreateType}
                                        />
                                        부모
                                    </label>

                                    <label htmlFor="false" className={styles.profileInputRadioConent}>
                                        <input
                                            type="radio"
                                            id="false"
                                            name="answer"
                                            value="child"
                                            onChange={onChangeCreateType}
                                        />
                                        자식
                                    </label>
                                    <div className={styles.iconContainerFamily}>
                                        <RiParentLine />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.profileInputContainer}>
                                <div className={styles.profileInputContainerTitle}>프로필 이미지</div>
                                <div className={styles.profileInputImgContainer}>
                                    {imageType === 'parent' && (
                                        <div className={styles.profileInputImgContainer1}>
                                            <img
                                                src={parent1}
                                                className={`${styles.profileInputContainerImg} ${
                                                    selectedImage === parent1 ? styles.selectedImage : ''
                                                }`}
                                                alt="Parent 1"
                                                onClick={() => handleImageClick(parent1)}
                                            />
                                            <img
                                                src={parent2}
                                                className={`${styles.profileInputContainerImg} ${
                                                    selectedImage === parent2 ? styles.selectedImage : ''
                                                }`}
                                                alt="Parent 2"
                                                onClick={() => handleImageClick(parent2)}
                                            />
                                        </div>
                                    )}
                                    {imageType === 'child' && (
                                        <div className={styles.profileInputImgContainer1}>
                                            <img
                                                src={child1}
                                                className={`${styles.profileInputContainerImg} ${
                                                    selectedImage === child1 ? styles.selectedImage : ''
                                                }`}
                                                alt="Child 1"
                                                onClick={() => handleImageClick(child1)}
                                            />
                                            <img
                                                src={child2}
                                                className={`${styles.profileInputContainerImg} ${
                                                    selectedImage === child2 ? styles.selectedImage : ''
                                                }`}
                                                alt="Child 2"
                                                onClick={() => handleImageClick(child2)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* <div className={styles.profileInputContainer}>
                                    <label htmlFor={styles.fileButton}>
                                        <div className={styles.profileDiv}>프로필 이미지</div>
                                    </label>
                                    <input type="file" id={styles.fileButton} />
                                    <div className={styles.iconContainer}>
                                        <FaRegImage />
                                    </div>
                                </div> */}

                            <button onClick={handleClick}>프로필 등록</button>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
