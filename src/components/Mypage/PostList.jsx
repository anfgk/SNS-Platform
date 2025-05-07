import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import PostItem from "../Mypage/PostItem";
import ModalCont from "../Modal/ModalCont";
import { DataDispatchContext, DataStateContext } from "../../contexts";

const Wrapper = styled.div`
  height: fit-content;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-bottom: 60px;
  @media (max-width: 768px) {
    gap: 30px;
    padding-bottom: 0;
  }
`;

const PostList = () => {
  const [userPosts, setUserPosts] = useState([]); // 사용자의 게시물을 저장할 상태
  const [isContOpen, setIsContOpen] = useState(false); // 게시물 상세보기 모달 열림/닫힘 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 게시물 추가/편집 모달 열림/닫힘 상태 관리
  const [postedCont, setPostedCont] = useState(null); // 선택된 게시물의 내용을 저장할 상태
  const { onDeletePost } = useContext(DataDispatchContext); // 게시물 삭제 함수
  const { posts, currentUserData } = useContext(DataStateContext); // 전체 게시물과 현재 사용자 데이터 가져오기

  useEffect(() => {
    if (currentUserData && posts) {
      // currentUserData와 posts가 있을 때만 실행
      const filteredPosts = posts.filter(
        (post) => post.userId === currentUserData.userId // 현재 사용자에 해당하는 게시물만 필터링
      );
      setUserPosts(filteredPosts); // 필터링된 게시물을 상태에 저장
    }
  }, [posts, currentUserData]); // posts나 currentUserData가 변경될 때마다 실행

  // 모달을 열 때 호출되는 함수
  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달을 열기 위한 상태 변경
  };

  // 게시물 내용 모달을 닫을 때 호출되는 함수
  const handleModalContClose = () => {
    setIsContOpen(false); // 상세보기 모달을 닫기 위한 상태 변경
  };

  // 게시물 내용 모달을 열 때 호출되는 함수
  const handleModalContOpen = (post) => {
    setPostedCont(post); // 선택한 게시물의 데이터를 상태에 저장
    setIsContOpen(true); // 상세보기 모달 열기
  };

  // 게시물을 생성일 기준으로 내림차순 정렬
  const sortedPosts = userPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // 최신 게시물이 위에 오도록 정렬
  );
  return (
    <>
      <Wrapper>
        {sortedPosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onDeletePost={onDeletePost}
            handleModalOpen={handleModalOpen}
            handleModalContOpen={() => handleModalContOpen(post)}
          />
        ))}
      </Wrapper>
      {isContOpen && (
        <ModalCont post={postedCont} closeModal={handleModalContClose} />
      )}
    </>
  );
};
export default PostList;
