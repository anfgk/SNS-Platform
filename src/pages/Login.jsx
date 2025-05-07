import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountLogin from "../components/login/AccountLogin"; // 계정 로그인 컴포넌트
import OtherLogin from "../components/login/OtherLogin"; // 다른 로그인 방법 컴포넌트
import LoginForm from "../components/login/LoginForm"; // 기본 로그인 폼 컴포넌트
import SNSLogin from "../components/login/SNSLogin"; // SNS 로그인 컴포넌트
import NavigateSignup from "../components/login/NavigateSignup"; // 회원가입 페이지로 이동하는 링크 컴포넌트
import {
  Wrapper,
  Inner,
  Logo,
  FormContainer,
} from "../components/login/login-components";
import styled from "styled-components";
import letterLogoImg from "/img/HeaderLogo.svg";
import circleLogoImg from "/img/Logo.svg";

const DividingLine = styled.div`
  width: 1px;
  height: 430px;
  background: var(--color-gray-02);
`;

const Login = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  // responsive
  const [mobileSize, setMobileSize] = useState(false); // 모바일 화면 여부를 판단하는 상태

  // 화면 크기 변경 시 mobileSize 상태를 업데이트하는 함수
  const updateSize = (e) => {
    if (e.target.innerWidth <= 768)
      setMobileSize(true); // 화면 크기가 768px 이하일 때 모바일 크기로 설정
    else setMobileSize(false); // 그 외 화면 크기일 경우 모바일 크기 해제
  };

  useEffect(() => {
    // 최초 로딩 시 화면 크기를 확인하여 모바일 사이즈 여부 설정
    window.innerWidth <= 768 ? setMobileSize(true) : setMobileSize(false);
    window.addEventListener("resize", updateSize); // 화면 크기 변화 시 updateSize 함수 실행
    return () => {
      window.removeEventListener("resize", updateSize); // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    };
  }, []);

  // 로그인 페이지로 이동하는 함수
  const goLogin = () => {
    navigate("/login");
  };

  return (
    <Wrapper>
      <Inner>
        {/* 로고 클릭 시 로그인 페이지로 이동 */}
        <Logo>
          <img
            onClick={goLogin}
            src={mobileSize ? circleLogoImg : letterLogoImg} // 화면 크기에 맞는 로고 선택
            alt="Logo"
          />
        </Logo>
        {/* 로그인 폼 스타일 및 모바일 사이즈에 따라 다르게 렌더링 */}
        <FormContainer
          style={{ gap: `30px`, padding: mobileSize ? 0 : `60px` }} // 모바일 크기에 따라 패딩 조정
        >
          {mobileSize ? (
            // 모바일 사이즈일 때 렌더링할 컴포넌트들
            <>
              <LoginForm
                mobileSize={mobileSize}
                setMobileSize={setMobileSize}
              />
              <SNSLogin />
              <NavigateSignup />
            </>
          ) : (
            // 데스크탑 사이즈일 때 렌더링할 컴포넌트들
            <>
              <AccountLogin />
              <DividingLine />
              <OtherLogin />
            </>
          )}
        </FormContainer>
      </Inner>
    </Wrapper>
  );
};

export default Login;
