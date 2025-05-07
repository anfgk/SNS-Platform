import React, { useState, useContext, useEffect } from "react";
import { DataStateContext } from "../../contexts";
import styled from "styled-components";
import CommentSection from "./Comment.jsx";
import { db } from "../../firebase"; // 파이어베이스 DB 사용
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

import {
  MainTitle_18_n,
  SubDescription_16_n,
} from "../../styles/GlobalStyles.styles.js";

// react-icon
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import Kakao from "./kakao.jsx";

const SocialIcon = styled.div`
  ${MainTitle_18_n}
  display:flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4px;
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.ContainColor};
  color: ${(props) => props.theme.iconColorB};
  & *:hover {
    color: var(--color-facebookblue) !important;
  }
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    padding: 20px 20px 0px;
  }
  .socialIcon {
    ${SubDescription_16_n}
    color: ${(props) => props.theme.iconColorB};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    .socialIconText {
      width: 80px;
      @media (max-width: 768px) {
        display: none;
        font-size: 20px;
      }
    }
    @media (max-width: 768px) {
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      font-size: 20px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
`;

const SocialBtnIcon = ({ post, onCommentClick }) => {
  const { currentUserData } = useContext(DataStateContext);
  const [toggle, setToggle] = useState(false); // 댓글 창 열림 상태 관리
  const [like, setLike] = useState(false); // 좋아요 상태 관리
  const [share, setShare] = useState(false); // 공유 상태 관리
  const [save, setSave] = useState(false); // 저장 상태 관리
  const [likes, setLikes] = useState(0); // 좋아요 수 상태 관리

  useEffect(() => {
    // 초기 좋아요 수 설정
    if (Array.isArray(post?.likes)) {
      setLikes(post.likes.length); // 초기 좋아요 수 설정
      if (post.likes.includes(currentUserData?.userId)) {
        setLike(true); // 이미 좋아요를 누른 경우, 좋아요 상태를 true로 설정
      }
    }
    if (
      Array.isArray(currentUserData?.savedPosts) &&
      currentUserData.savedPosts.includes(post?.id)
    ) {
      setSave(true); // 이미 저장된 게시물인 경우, 저장 상태를 true로 설정
    }
  }, [post, currentUserData]);

  // 좋아요 버튼 클릭 시 좋아요 상태 토글 함수
  const handleLikeToggle = async () => {
    const postRef = doc(db, "posts", post.id);
    try {
      if (like) {
        // 이미 좋아요를 누른 경우, 좋아요 취소
        await updateDoc(postRef, {
          likes: arrayRemove(currentUserData.userId),
        });
        setLikes((prev) => prev - 1); // 좋아요 수 감소
      } else {
        // 좋아요를 누르지 않은 경우, 좋아요 추가
        await updateDoc(postRef, {
          likes: arrayUnion(currentUserData.userId),
        });
        setLikes((prev) => prev + 1); // 좋아요 수 증가
      }
      setLike((prev) => !prev); // 좋아요 상태 토글
    } catch (err) {
      console.error("Like error", err); // 에러 발생 시 콘솔에 출력
    }
  };

  // 카카오 공유 버튼 클릭 시 공유 상태 토글 함수
  const shareKakao = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 중지
    setShare((prev) => !prev); // 공유 상태 토글
  };
  // 댓글 버튼 클릭 시 댓글 창 열림 상태 토글 함수
  const handleCommentClick = () => {
    if (onCommentClick) {
      onCommentClick(); // 부모 컴포넌트에서 전달된 onCommentClick 호출
    } else {
      setToggle((prev) => !prev); // 댓글 창 열기/닫기
    }
  };

  // 저장 버튼 클릭 시 저장 상태 토글 함수
  const handleSaveToggle = async () => {
    const userRef = doc(db, "users", currentUserData.userId);
    try {
      if (save) {
        // 이미 저장된 게시물인 경우, 저장 취소
        await updateDoc(userRef, {
          savedPosts: arrayRemove(post?.id),
        });
      } else {
        // 저장되지 않은 게시물인 경우, 저장
        await updateDoc(userRef, {
          savedPosts: arrayUnion(post?.id),
        });
      }
      setSave((prev) => !prev); // 저장 상태 토글
    } catch (err) {
      console.error("Save error", err); // 에러 발생 시 콘솔에 출력
    }
  };

  if (!post) return null; // post가 없으면 아무것도 렌더링하지 않음
  return (
    <>
      <SocialIcon>
        <div
          onClick={handleLikeToggle}
          style={{
            color: like ? "var(--color-facebookblue)" : "inherit", // 좋아요 상태에 따라 색상 변경
          }}
          className="socialIcon"
        >
          <FaRegHeart />
          <div className="socialIconText">
            {like ? "좋아요" : "좋아요"} {likes > 0 ? likes : ""}
          </div>
        </div>
        <div onClick={handleCommentClick} className="socialIcon">
          <FaRegComment />
          <div className="socialIconText">댓글</div>
        </div>
        <div onClick={shareKakao} className="socialIcon">
          <FiShare />
          <div className="socialIconText">공유하기</div>
          {share ? <Kakao shareKakao={shareKakao} /> : null}{" "}
          {/* 공유 상태가 true일 때 카카오 공유 컴포넌트 렌더링 */}
        </div>
        <div
          onClick={handleSaveToggle}
          style={{
            color: save ? "var(--color-facebookblue)" : "inherit", // 저장 상태에 따라 색상 변경
          }}
          className="socialIcon"
        >
          <FaRegBookmark />
          <div className="socialIconText">저장하기</div>
        </div>
      </SocialIcon>
      {/* 댓글 창이 열려 있으면 CommentSection 렌더링 */}
      {toggle && <CommentSection post={post} currentUser={currentUserData} />}
    </>
  );
};

export default SocialBtnIcon;
