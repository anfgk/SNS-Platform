import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { HeaderBottom, HeaderTop } from "../components/common/Header";
import PostUpload from "../components/common/PostUpload";
import Mainstory from "../components/Main/Mainstory";
import MainGroup from "../components/Main/MainGroup";
import Mainpage from "../components/Main/Mainpage";
import { auth } from "../firebase";
import { DataStateContext } from "../contexts";
import LoadingScreen from "../components/common/LoadingScreen";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const PostUploadField = styled.div`
  width: var(--inner-width-02);
  background-color: ${(props) => props.theme.ContainColor};
  box-shadow: var(--box-shadow-01);
  padding: 20px;
  border-radius: var(--border-radius-30);
  @media (max-width: 768px) {
    width: 90vw;
    height: 80px;
  }
`;

const MainSection = styled.section`
  margin-bottom: 20px;
  width: 1050px;
  padding: 0 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  top: 140px;
  @media screen and (max-width: 768px) {
    width: 100%;
    top: 70px;
  }
`;

const Main = ({ placeholder }) => {
  const { currentUserData } = useContext(DataStateContext); // 현재 사용자 데이터 가져오기
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리

  useEffect(() => {
    const initialize = async () => {
      try {
        // 사용자 인증 상태 체크
        await auth.onAuthStateChanged((user) => {
          if (user) {
            // 사용자 인증 상태가 true일 때
          }
        });

        // 필요한 데이터가 로드될 때까지 대기
        if (currentUserData) {
          // 사용자 데이터가 로드되었을 때
        }

        // 모든 데이터가 준비되면 로딩 상태 해제
        setLoading(false);
      } catch (error) {
        console.error("초기화 중 오류가 발생했습니다.", error); // 오류 발생 시 로깅
      }
    };

    initialize(); // 초기화 함수 실행
  }, [currentUserData]); // currentUserData가 변경될 때마다 실행

  if (loading) {
    return <LoadingScreen />; // 로딩 중이면 로딩 화면을 보여줌
  }
  // 검색어가 존재하면 검색 중으로 간주
  const isSearching = searchTerm.trim().length > 0;

  return (
    <Wrapper>
      <HeaderTop />
      {/* 검색어 입력 및 관련 이벤트 처리 */}
      <HeaderBottom onSearch={(term) => setSearchTerm(term)} />
      <MainSection>
        {/* 검색어가 있으면 Mainpage 컴포넌트 렌더링 */}
        {isSearching ? (
          <Mainpage searchTerm={searchTerm} />
        ) : (
          <>
            <Mainstory />
            <PostUploadField style={{ padding: "10px 0" }}>
              {/* 포스트 업로드 컴포넌트 */}
              <PostUpload placeholder={"오늘 어떤일이 있으셨나요?"} />
            </PostUploadField>
            <MainGroup />
            {/* 검색어가 없을 경우 기본 Mainpage 컴포넌트 렌더링 */}
            <Mainpage searchTerm={searchTerm} />
          </>
        )}
      </MainSection>
    </Wrapper>
  );
};

export default Main;
