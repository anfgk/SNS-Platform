import React, { useState, useEffect, useContext } from "react";
import CommentUpload from "./CommentUpload";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Comment.css";
import { DataStateContext } from "../../contexts";
import { styled } from "styled-components";

const LikeButton = styled.div`
  margin-left: 10px;
  font-size: 10px;
  padding: 5px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  color: ${(props) => props.theme.iconColorB};
  @media (max-width: 768px) {
    padding: 0px 5px 3px;
    font-size: 12px;
  }
`;

// 개별 댓글 컴포넌트
const Comment = ({ comment, onDelete, currentUserId }) => {
  const { users } = useContext(DataStateContext); // DataStateContext에서 사용자 정보 불러오기
  const state = useContext(DataStateContext); // 전체 상태에 접근
  const [likes, setLikes] = useState(0); // 좋아요 수 상태
  const [liked, setLiked] = useState(false); // 좋아요 상태

  useEffect(() => {
    const savedLikeStatus = localStorage.getItem(`liked-comment-${comment.id}`); // 로컬스토리지에서 좋아요 상태 가져오기
    const savedLikesCount = localStorage.getItem(`likes-comment-${comment.id}`); // 로컬스토리지에서 좋아요 수 가져오기

    if (savedLikeStatus === "true") {
      setLiked(true); // 좋아요 상태 반영
    }
    if (savedLikesCount) {
      setLikes(parseInt(savedLikesCount, 10)); // 좋아요 수 반영
    }
  }, [comment.id]);

  const authorDats = users?.find((user) => user.userId === comment.userId); // 댓글 작성자 정보 찾기

  const handleToggleLike = () => {
    setLiked((prev) => {
      const newLikedStatus = !prev; // 좋아요 상태 반전
      localStorage.setItem(`liked-comment-${comment.id}`, newLikedStatus); // 로컬스토리지에 상태 저장

      const newLikesCount = newLikedStatus ? likes + 1 : likes - 1; // 좋아요 수 계산
      setLikes(newLikesCount); // 좋아요 수 업데이트

      localStorage.setItem(`likes-comment-${comment.id}`, newLikesCount); // 로컬스토리지에 좋아요 수 저장

      return newLikedStatus;
    });
  };

  return (
    <div className="comment">
      <img
        className="profileImg"
        src={authorDats?.profileImage || "/img/defaultProfile.jpg"}
        alt="Profile"
      />
      <div className="commentContentWrapper">
        <div className="comment-content">
          <h4>{comment.formattedUserName}</h4>
          <p>{comment.content}</p>
        </div>
        <div className="actions">
          <LikeButton
            className={liked ? "liked" : ""}
            onClick={handleToggleLike}
          >
            {liked ? "좋아요 취소" : "좋아요"} {likes}
          </LikeButton>
          {comment.userId === currentUserId ? (
            <button className="deleteBtn" onClick={onDelete}>
              삭제
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

const Wrapper = styled.div`
  height: 100%;
  padding: 30px 0;
  border-top: 1px solid #ccc;
  @media (max-width: 768px) {
    padding: 10px 0 10px;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  max-height: ${(props) =>
    props.$isModal ? "400px" : "250px"}; // 모달일 때는 높이 제한을 없앰
  /* height: 400px; */
  overflow-y: auto;
  .profileImg {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-bottom: 28px;
    margin-right: 14px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
`;

const CommentSection = ({
  className,
  post,
  showCommentUpload = true,
  $isModal,
}) => {
  const { currentUserData } = useContext(DataStateContext); // 현재 사용자 정보 불러오기
  const [comments, setComments] = useState([]); // 댓글 목록 상태

  useEffect(() => {
    if (!post?.id) return;

    const commentsRef = collection(db, "posts", post.id, "comments"); // Firestore에서 댓글 컬렉션 참조

    const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 댓글을 최신순으로 정렬
      const sortedComments = fetchedComments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments); // 댓글 상태 업데이트
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, [post?.id]);

  const handleCreateComment = async (postId, content) => {
    if (!content.trim()) return; // 내용이 비어있으면 생성하지 않음
    const formattedUserName = currentUserData?.userName
      ? `${currentUserData.userName.firstName}${currentUserData.userName.lastName}`
      : "Anonymous"; // 사용자 이름 포맷
    const newComment = {
      content,
      formattedUserName,
      userId: currentUserData?.userId || "guest", // 사용자 ID (guest로 기본 설정)
      createdAt: new Date().toISOString(), // 댓글 생성 시간
    };

    try {
      await addDoc(collection(db, `posts/${postId}/comments`), newComment); // Firestore에 댓글 추가
    } catch (error) {
      console.error("댓글 생성 중 오류 발생:", error); // 오류 처리
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", post.id, "comments", id)); // Firestore에서 댓글 삭제
      setComments(
        (prevComments) => prevComments.filter((comment) => comment.id !== id) // 삭제된 댓글 필터링
      );
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error); // 오류 처리
    }
  };

  return (
    <Wrapper>
      <CommentList className={className} $isModal={$isModal}>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUserId={currentUserData?.userId}
            onDelete={() => handleDeleteComment(comment.id)} // 댓글 삭제 핸들러
          />
        ))}
      </CommentList>
      {showCommentUpload && (
        <CommentUpload
          postId={post.id}
          onCreateComment={(content) => handleCreateComment(post.id, content)} // 댓글 업로드 핸들러
        />
      )}
    </Wrapper>
  );
};

export default CommentSection;
