import React, { useState, useContext } from "react";
import styled from "styled-components";
import { BsArrowReturnLeft } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { DataStateContext } from "../../contexts";

const WrapperForm = styled.form`
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
`;
const CommentCont = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  @media (max-width: 768px) {
    padding: 0;
  }
  .commentUpLoadprofile {
    width: 100%;
    display: flex;
    align-items: center;
    .profileImg {
      width: 45px;
      height: 45px;
      border-radius: 100px;
    }
    .profileuploadText {
      width: 100%;
      height: 40px;
      margin: 0 15px;
      padding: 0 20px;
      border: 1px solid #ccc;
      border-radius: 20px;
      &:focus {
        outline: none;
      }
    }
    .submitBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50px;
      cursor: pointer;
    }
    .submitBtn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

// 댓글 업로드 컴포넌트
const CommentUpload = ({ postId, onCreateComment }) => {
  const { currentUserData } = useContext(DataStateContext); // 현재 사용자 데이터 가져오기

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [content, setContent] = useState(""); // 댓글 내용 상태

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지
    if (!content.trim()) return; // 공백 입력 방지
    try {
      setIsLoading(true); // 로딩 시작
      await onCreateComment(content); // 상위 컴포넌트에서 제공된 댓글 생성 함수 호출
      setContent(""); // 댓글 입력란 초기화
    } catch (error) {
      console.error("댓글 업로드 실패:", error); // 오류 처리
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };
  return (
    <WrapperForm onSubmit={handleSubmit}>
      {/* 폼 제출 시 handleSubmit 호출 */}
      <CommentCont>
        <div className="commentUpLoadprofile">
          <img
            className="profileImg"
            src={currentUserData?.profileImage || "/img/defaultProfile.jpg"}
            alt="Profile"
          />
          <input
            className="profileuploadText"
            onChange={(e) => setContent(e.target.value)} // 댓글 내용 업데이트
            type="text"
            placeholder="댓글을 입력하세요"
            value={content}
            required
          />
          <button disabled={isLoading} type="submit" className="submitBtn">
            {isLoading ? <FaSpinner /> : <BsArrowReturnLeft />}{" "}
            {/* 로딩 중일 때 스피너, 아니면 제출 아이콘 */}
          </button>
        </div>
      </CommentCont>
    </WrapperForm>
  );
};
export default CommentUpload;
