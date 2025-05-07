import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion"; // 애니메이션을 위한 라이브러리
import Logoimg from "/img/Logo.svg"; // 중앙 로고 이미지

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CircleContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
const Circle = styled(motion.span)`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #1877f2;
  box-shadow: 3px 8px 10px 0px rgba(15, 22, 30, 0.11);
`;
const CircleLogo = styled(motion.span)`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: url(${Logoimg}) center/cover no-repeat;
  box-shadow: 3px 8px 10px 0px rgba(15, 22, 30, 0.11);
`;

// 자식 애니메이션을 순차적으로 시작하도록 설정하는 부모 컨테이너의 variants
const containerVariants = {
  start: {
    transition: {
      staggerChildren: 0.1, // 자식 요소들이 0.1초 간격으로 애니메이션 시작
    },
  },
  end: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 원 요소들의 애니메이션 설정
const circleVariants = {
  start: {
    scale: 0.9, // 시작 시 살짝 작게
    y: 0,
  },
  end: {
    scale: 1,
    y: -20,
    transition: {
      ease: "easeInOut",
      duration: 0.5,
      repeat: Infinity, // 무한 반복
      repeatType: "reverse", // 반대로 되돌아가는 애니메이션
    },
  },
};

// 로딩 스크린 컴포넌트 정의
const LoadingScreen = () => {
  return (
    <Wrapper>
      <CircleContainer
        variants={containerVariants} // 컨테이너에 애니메이션 적용
        initial={"start"} // 초기 상태
        animate={"end"} // 애니메이션 실행 상태
      >
        <Circle variants={circleVariants} /> {/* 왼쪽 원 */}
        <CircleLogo variants={circleVariants} /> {/* 중앙 로고 원 */}
        <Circle variants={circleVariants} /> {/* 오른쪽 원 */}
      </CircleContainer>
    </Wrapper>
  );
};

export default LoadingScreen;
