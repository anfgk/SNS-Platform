import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IoCopyOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { MainTitle_18_b } from "../../styles/GlobalStyles.styles";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  width: 300px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50px;
  right: -100px;

  z-index: 30;
  & > svg {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 20px;
  }
  h3 {
    ${MainTitle_18_b}
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;

const Button = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f1f1;
  }

  img {
    width: 50px;
    height: 50px;
  }

  span {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }
`;

const Kakao = ({ shareKakao }) => {
  const [url, setUrl] = useState(""); // 현재 페이지 URL 상태
  const [isKakaoReady, setIsKakaoReady] = useState(false); // 카카오 SDK 로드 상태
  const closeModal = (e) => {
    e.stopPropagation(); // 모달 외부로 전파되지 않음
    shareKakao(e); // 공유하기 함수 호출
  };

  // 컴포넌트가 마운트되면 현재 URL 설정 및 카카오 SDK 로드
  useEffect(() => {
    setUrl(window.location.href); // 현재 페이지의 URL 설정
    const script = document.createElement("script"); // 카카오 SDK 스크립트 추가
    script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
    script.async = true;
    document.body.appendChild(script);

    // SDK 로드 후 카카오 초기화
    script.onload = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init("e0ade8708d9d362fd3988c329366a281"); // 실제 앱 키로 대체하세요
      }
      setIsKakaoReady(true); // 카카오 SDK가 준비되었음을 상태로 설정
    };

    return () => {
      document.body.removeChild(script); // 컴포넌트 언마운트 시 스크립트 제거
    };
  }, []);

  // 카카오톡 공유 함수
  const shareToKakao = () => {
    if (window.Kakao && window.Kakao.Link) {
      window.Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "Facebook", // 공유할 제목
          description:
            "Facebook을 통해 친구, 가족, 아는 사람들과 서로의 소식을 확인해 보세요.", // 공유할 설명
          imageUrl: "/img/opengraph.jpg", // 공유할 이미지 URL
          link: {
            mobileWebUrl: url, // 모바일 웹 URL
            webUrl: url, // 웹 URL
          },
        },
        buttons: [
          {
            title: "웹으로 이동", // 버튼 제목
            link: { mobileWebUrl: url, webUrl: url }, // 버튼 링크 URL
          },
        ],
      });
    } else {
      console.error("Kakao SDK가 아직 준비되지 않았거나 오류가 있습니다.");
    }
  };

  // URL을 클립보드에 복사하는 함수
  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url); // 클립보드에 URL 복사
      alert("URL이 클립보드에 복사되었습니다."); // 복사 완료 알림
    } catch (err) {
      console.error("URL 복사 실패:", err); // 복사 실패 시 에러 로그
    }
  };
  return (
    <Wrapper>
      <IoCloseOutline onClick={shareKakao} /> {/* 모달 닫기 버튼 */}
      <h3>공유하기</h3>
      <ButtonContainer>
        {/* 카카오톡 공유 버튼: 카카오 SDK 준비가 되면 클릭 가능 */}
        <Button onClick={isKakaoReady ? shareToKakao : null}>
          <img
            src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
            alt="카카오톡 공유"
          />
          <span>카카오톡</span>
        </Button>
        <Button onClick={copyUrlToClipboard}>
          <IoCopyOutline size={50} />
          <span>링크 복사</span>
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
};

export default Kakao;
