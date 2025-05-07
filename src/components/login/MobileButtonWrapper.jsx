import React from "react";
import {
  createSearchParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import { SubDescription_14_n } from "../../styles/GlobalStyles.styles";
import { Button } from "./login-components";

const Wrapper = styled.div`
  width: 100%;
  /* position: fixed;
  bottom: 0; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  button {
    width: 360px;
    max-width: 360px;
    &.mobileNextButton {
      border: 1px solid transparent;
      background: var(--color-facebookblue);
      color: var(--color-white);
      &:active {
        background: var(--color-hoverblue);
      }
    }
  }
  span {
    ${SubDescription_14_n}
    color: var(--color-gray-01);
    cursor: pointer;
  }
`;

// 모바일에서 사용되는 버튼 컴포넌트
const MobileButtonWrapper = ({ skipBtn }) => {
  const navigate = useNavigate();

  // "다음" 버튼 클릭 시 회원가입 진행 단계 이동 (progress=2)
  const handleSignupNextStep = () => {
    navigate({
      pathname: "/signup",
      search: `?${createSearchParams({
        progress: 2, // 쿼리 파라미터로 progress 전달
      })}`,
    });
  };

  return (
    <Wrapper>
      <Button onClick={handleSignupNextStep} className="mobileNextButton">
        다음
      </Button>
      {skipBtn ? <Button>건너뛰기</Button> : null}
      <Link to={"/login"}>
        <span>이미 계정이 있습니다</span>
      </Link>
    </Wrapper>
  );
};

export default MobileButtonWrapper;
