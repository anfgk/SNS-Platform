import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataDispatchContext } from "../contexts"; // 사용자 데이터 처리 컨텍스트
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"; // Firebase 인증 기능
import { auth } from "../firebase"; // Firebase 인증 객체
import SignupForm from "../components/login/SignupForm";
import AdditionalForm from "../components/login/AdditionalForm";
import MobileHeader from "../components/login/MobileHeader";
import SignupCategory from "../components/login/SignupCategory";
import letterLogoImg from "/img/HeaderLogo.svg";
import {
  Wrapper,
  Inner,
  Logo,
  FormContainer,
} from "../components/login/login-components";

const Signup = () => {
  const { onAddUser } = useContext(DataDispatchContext); // 사용자 추가 함수
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: null,
    birthdate: null,
    city: null,
    likeCategory: [null],
    profileImage: "", // 기본값으로 빈 문자열 설정
    backgroundImage: "", // 기본값으로 빈 문자열 설정
    introduction: "",
  });

  // 모바일 화면 크기 체크 및 처리
  const navigate = useNavigate();
  const [mobileSize, setMobileSize] = useState(false); // 모바일 크기 여부 상태
  const [searchParams] = useSearchParams(); // URL에서 파라미터 추출
  const progress = searchParams.get("progress") || "1"; // 기본값 "1"
  const updateSize = (e) => {
    if (e.target.innerWidth <= 768)
      setMobileSize(true); // 화면 크기가 768 이하이면 모바일 크기로 설정
    else setMobileSize(false); // 그 외에는 데스크탑 크기로 설정
  };

  const signupProcess = () => {}; // 회원가입 프로세스 함수 (구현 예정)

  // 화면 크기 변경 시마다 모바일 크기 상태 업데이트
  useEffect(() => {
    window.innerWidth <= 768 ? setMobileSize(true) : setMobileSize(false); // 초기 화면 크기 체크
    window.addEventListener("resize", updateSize); // 리사이즈 이벤트 리스너 추가
    return () => {
      window.removeEventListener("resize", updateSize); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  // 사용자 데이터를 업데이트하는 함수 (하위 컴포넌트에서 호출됨)
  const updateUserData = (key, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: value, // 특정 키에 해당하는 값만 업데이트
    }));
  };

  // 회원가입 완료 시 호출되는 함수
  const handleSignup = async (data) => {
    try {
      // Firebase를 통해 사용자 이메일과 비밀번호로 회원가입
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password1
      );
      const user = userCredential.user;

      // 이메일 인증 요청
      await sendEmailVerification(user);
      alert("인증 이메일이 전송되었습니다. 이메일을 확인해주세요.");

      // 사용자 정보를 데이터베이스에 추가
      await onAddUser(
        user.uid,
        data.firstName,
        data.lastName,
        data.email,
        0, // 기본값
        0, // 기본값
        data.gender, // 사용자가 입력한 데이터
        data.birthdate, // 사용자가 입력한 데이터
        data.city, // 사용자가 입력한 데이터
        data.likeCategory || [], // 사용자가 입력한 데이터
        data.profileImage || "", // 기본값
        data.backgroundImage || "", // 기본값
        data.introduction || "" // 기본값
      );

      navigate("/login"); // 회원가입 완료 후 로그인 페이지로 리디렉션
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      // 오류 발생 시 메시지 출력
      if (error.code === "auth/email-already-in-use") {
        alert("이미 가입된 이메일입니다.");
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 로그인 페이지로 돌아가기 위한 함수
  const goLogin = () => {
    confirm("로그인 페이지로 돌아가시겠습니까?"); // 확인창 표시
    navigate("/"); // 로그인 페이지로 리디렉션
  };
  return (
    <Wrapper
      style={{
        height: `auto`,
        minHeight: `100vh`,
        flexDirection: `column`,
        gap: `20px`,
        padding: mobileSize ? `20px 0` : `30px 0`, // 모바일일 때와 아닐 때 패딩 다르게 설정
      }}
    >
      {/* 모바일 사이즈일 경우 모바일 헤더 표시 */}
      {mobileSize ? (
        <MobileHeader
          title={
            signupProcess === "2" ? "추가정보 입력하기" : "Facebook에 가입하기"
          }
        ></MobileHeader>
      ) : null}
      <Inner>
        {/* 모바일 사이즈가 아닐 때 로고를 클릭하면 로그인 페이지로 이동 */}
        {mobileSize ? null : (
          <Logo>
            <img onClick={goLogin} src={letterLogoImg} alt="Logo" />
          </Logo>
        )}

        <FormContainer>
          <SignupForm
            updateUserData={updateUserData}
            userData={userData}
            mobileSize={mobileSize}
            handleSignup={handleSignup}
          />
          {progress === "1" && (
            <AdditionalForm
              updateUserData={updateUserData}
              userData={userData}
              progress={progress}
              mobileSize={mobileSize}
            />
          )}
          {progress === "2" && (
            <SignupCategory
              updateUserData={updateUserData}
              userData={userData}
              progress={progress}
              mobileSize={mobileSize}
            />
          )}
        </FormContainer>
        {/* {mobileSize ? <MobileButtonWrapper></MobileButtonWrapper> : null} */}
      </Inner>
    </Wrapper>
  );
};

export default Signup;
