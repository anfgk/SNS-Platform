import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth 불러오기
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ProfileCard from "./ProfileCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import background from "/img/background.jpg";

const Wrapper = styled.section`
  width: 100%;
  /* => CoverImg height와 같이 수정해야함 */
  height: 475px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 140px;
  height: 475px;
  @media (max-width: 768px) {
    max-width: 100%;
    height: 400px;
    margin-bottom: 0;
  }
`;
const Inner = styled.article`
  width: var(--inner-width-02);
  height: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;
const CoverImg = styled.img`
  position: relative;
  background: var(--color-gray-01);
  width: 100%;
  /*Wrapper height와 같이 수정해야함  */
  height: 475px;
  border-radius: 30px 30px 0 0;
  object-fit: cover;

  @media (max-width: 768px) {
    border-radius: 0;
    width: 100%;
    height: 300px;
  }
`;
const EditIcon = styled.div`
  position: relative;
  .editIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: 130px;
    right: 20px;
    padding: 8px;
    background: var(--color-white);
    border-radius: 50%;
    box-shadow: var(--box-shadow-01);
    color: var(--color-black);
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      opacity: 0.6;
    }
    @media (max-width: 768px) {
      bottom: 50px;
    }
  }
`;
const TopCover = () => {
  const [coverImg, setCoverImg] = useState(background); // 배경 이미지 초기값 설정
  const [user, setUser] = useState(null); // Firebase에서 가져온 사용자 정보

  const fileRef = useRef(null); // 파일 입력을 위한 참조
  const auth = getAuth(); // Firebase 인증 객체
  const storage = getStorage(); // Firebase Storage 객체
  const firestore = getFirestore(); // Firebase Firestore 객체

  // Firebase에서 로그인한 사용자 가져오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // 로그인한 사용자 정보를 상태에 저장
        fetchCoverImage(user); // 로그인한 사용자의 coverImage를 가져옴
      } else {
        setUser(null); // 로그아웃 상태일 경우 사용자 정보 초기화
      }
    });
    return () => unsubscribe(); // 컴포넌트가 언마운트될 때 Firebase 구독 해제
  }, [auth]); // auth 상태가 변경될 때마다 실행

  // Firestore에서 coverImage 가져오기
  const fetchCoverImage = async (user) => {
    const userDocRef = doc(firestore, "users", user.uid); // Firestore에서 사용자 문서 참조
    const userDocSnap = await getDoc(userDocRef); // 문서 스냅샷 가져오기

    if (userDocSnap.exists()) {
      const data = userDocSnap.data(); // 문서 데이터 가져오기
      setCoverImg(data.coverImage || background); // Firestore에서 coverImage를 가져와 상태 업데이트
    }
  };

  // 이미지 파일 변경 처리
  const handleImgChange = async (e) => {
    const file = e.target.files[0]; // 파일 선택
    if (file && user) {
      const fileRef = ref(storage, `covers/${user.uid}/coverImage`);
      try {
        await uploadBytes(fileRef, file); // 파일을 Firebase Storage에 업로드
        const fileURL = await getDownloadURL(fileRef); // 업로드된 파일의 URL 가져오기
        setCoverImg(fileURL); // 상태에 새 이미지 URL 업데이트

        // Firestore에 새로운 coverImage URL 저장
        const userDocRef = doc(firestore, "users", user.uid);
        await updateDoc(userDocRef, {
          coverImage: fileURL, // Firestore의 coverImage 필드에 URL 저장
        });
      } catch (error) {
        console.error("Error uploading image: ", error); // 업로드 중 오류 발생 시 처리
      }
    }
  };

  // 아이콘 클릭 시 파일 선택 창 열기
  const handleIconClick = () => {
    fileRef.current.click(); // 파일 입력을 위한 input 클릭
  };

  return (
    <Wrapper>
      <Inner>
        <CoverImg src={coverImg} alt="Test Cat" />
        <input
          ref={fileRef}
          onChange={handleImgChange}
          id="fileInput"
          type="file"
          style={{ display: "none" }}
        ></input>
        <EditIcon>
          <FontAwesomeIcon
            onClick={handleIconClick}
            className="editIcon"
            icon={faCamera}
          />
        </EditIcon>
        <ProfileCard />
      </Inner>
    </Wrapper>
  );
};

export default TopCover;
