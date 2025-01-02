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
  const [userPosts, setUserPosts] = useState([]);
  const [isContOpen, setIsContOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postedCont, setPostedCont] = useState(null);
  const { onDeletePost } = useContext(DataDispatchContext);
  const { posts, currentUserData } = useContext(DataStateContext);

  useEffect(() => {
    if (currentUserData && posts) {
      const filteredPosts = posts.filter(
        (post) => post.userId === currentUserData.userId
      );
      setUserPosts(filteredPosts);
    }
  }, [posts, currentUserData]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalContClose = () => {
    setIsContOpen(false);
  };

  const handleModalContOpen = (post) => {
    setPostedCont(post);
    setIsContOpen(true);
  };

  const sortedPosts = userPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
