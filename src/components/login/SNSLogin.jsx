import React from "react";
import { useNavigate } from "react-router-dom";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase"; // Firebase 인증 초기화 모듈
import styled from "styled-components";
import { FormDesc } from "./login-components";
import googleIcon from "/img/google-icon.svg";
import appleIcon from "/img/apple-icon.svg";
import githubIcon from "/img/github-icon.svg";

const Wrapper = styled.div`
  width: 100%;
  padding: 30px 0;
  p {
    color: inherit;
  }
  ul {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    li {
      width: 45px;
      height: 45px;
      background: var(--color-gray-02);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      img {
        width: 23px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    padding: 20px 0;
  }
`;

const SNSLogin = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  // GitHub 로그인 버튼 클릭 시 실행되는 함수
  const onClick = async () => {
    try {
      const providerGithub = new GithubAuthProvider(); // GitHub 인증 제공자 생성
      await signInWithPopup(auth, providerGithub); // 팝업을 통해 GitHub 로그인
      navigate("/"); // 로그인 후 홈 페이지로 이동
    } catch (e) {
      console.log(e); // 오류 발생 시 콘솔에 출력
    }
  };

  return (
    <Wrapper>
      <FormDesc>다른 방법으로 로그인</FormDesc>
      <ul>
        <li>
          <a href="https://github.com/login">
            <img src={githubIcon} />
          </a>
        </li>
        <li>
          <a href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fwww.google.co.kr%2F%3Fclient%3Dsafari%26channel%3Diphone_bm&ec=GAZAmgQ&hl=ko&ifkv=ARpgrqcJqAo9GBBw8riYeYl4aoXateqwAIPtZdHf5SXGbIqnGtmep8VNYlB83G1ZjfmE2jNMW3X5-g&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1209034674%3A1729184524753367&ddm=0">
            <img src={googleIcon} />
          </a>
        </li>
        <li>
          <a href="https://account.apple.com/sign-in">
            <img src={appleIcon} />
          </a>
        </li>
      </ul>
    </Wrapper>
  );
};

export default SNSLogin;
