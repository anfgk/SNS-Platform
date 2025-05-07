import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SocialBtnIcon from "../common/SocialBtnIcon.jsx";
import { DataDispatchContext, DataStateContext } from "../../contexts";
import Mainlive from "./Mainlive.jsx";
import ModalCont from "../Modal/ModalCont.jsx";
import UploadModal from "../ModalConts/UploadModal.jsx";
import defaultProfile from "/img/defaultProfile.jpg";
import { IoCloseOutline } from "react-icons/io5";
import { FaEarthAmericas } from "react-icons/fa6";

//font
import {
  MainTitle_22_b,
  SubTitle_16_b,
  SubDescription_16_n,
  SubDescription_14_n,
} from "../../styles/GlobalStyles.styles.js";

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: fit-content;
  /* margin: 0 auto; */
  padding-top: 20px;
  border-radius: var(--border-radius-30);
  background-color: ${(props) => props.theme.ContainColor};
  box-shadow: var(--box-shadow-01);
  @media screen and (max-width: 1050px) {
    width: 100%;
  }
  @media (max-width: 768px) {
    width: 90vw;
    min-width: 360px;
    padding-top: 10px;
    left: 0;
  }
`;
const Inner = styled.article`
  width: var(--inner-width-02);
  height: 100%;
  padding: 20px 36px 30px;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  @media (max-width: 768px) {
    border-radius: var(--border-radius-08);
    padding: 20px 30px;
    min-width: 360px;
    height: 80%;
    /* margin: 0 auto; */
  }
`;
const Profile = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
  }
`;
const ProfileContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) {
    gap: 16px;
  }
  .profileImg {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border-radius: 100px;
    @media (max-width: 768px) {
      width: 48px;
      height: 48px;
    }
  }
  .profileName {
    ${MainTitle_22_b}
    color: ${(props) => props.theme.textColor};
    @media (max-width: 768px) {
      ${SubTitle_16_b}
    }
  }
  .createdAt {
    ${SubDescription_14_n}
    color: ${(props) => props.theme.textColor};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    * {
      color: ${(props) => props.theme.textColor};
    }
    @media (max-width: 768px) {
      ${SubDescription_14_n}
    }
  }
`;
const ControlsIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 24px;
  cursor: pointer;
  transition: opacity 0.5s;
  *:hover {
    color: var(--color-facebookblue);
  }
`;

const DeletIcon = styled.div`
  color: ${(props) => props.theme.textColor};
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
const Contents = styled.div`
  position: relative;
  padding: 20px 0;
  @media (max-width: 768px) {
    padding: 0;
    max-width: 100%;
  }
  .contentDesc {
    ${SubDescription_16_n};
    color: ${(props) => props.theme.textColor};
    font-weight: normal;
    word-break: break-all;
    min-height: 50px;
    @media (max-width: 768px) {
      ${SubDescription_14_n}
      padding:0 4px;
      min-height: 30px;
    }
  }
  .contentImgs {
    display: flex;
    justify-content: space-between;
    padding: 30px 0;
  }
  .Buttons {
    color: ${(props) => props.theme.textColor};
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 55%;
    .btnLeft,
    .btnRight {
      padding: 20px 23px;
      font-size: 20px;
      background: var(--color-light-gray-02);
      border-radius: 50%;
      transition: opacity 0.5s;
      cursor: pointer;
      &:hover {
        opacity: 0.5;
      }
    }
    .btnLeft {
      transform: translateX(-30px);
    }
    .btnRight {
      transform: translateX(30px);
    }
  }
`;
const ContImg = styled.img`
  width: 100%;
  height: 350px;
  background: var(--color-light-gray-01);
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  @media (max-width: 768px) {
    padding: 0;
    max-width: 100%;
    height: 200px;
  }
`;

// Mainpage 컴포넌트 정의
const Mainpage = ({ searchTerm }) => {
  const [isContOpen, setIsContOpen] = useState(false); // 게시글 클릭 시 상세 모달 열림 여부
  const [postedCont, setPostedCont] = useState(null); // 모달에 표시할 게시글 정보

  const [profileImg, setProfileImg] = useState(defaultProfile); // 기본 프로필 이미지
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [imageSrc, setImageSrc] = useState(""); // 이미지 소스 (수정용)
  const [contentDesc, setContentDesc] = useState(""); // 게시글 내용 (수정용)
  const [posts, setPosts] = useState([]); // 화면에 표시할 게시글 리스트

  const [editingPostId, setEditingPostId] = useState(null); // 수정 중인 게시글 ID
  const { onDeletePost } = useContext(DataDispatchContext); // 게시글 삭제 함수
  const data = useContext(DataStateContext); // 전역 상태
  const { currentUserData } = data; // 현재 로그인한 사용자 정보

  const postData = data.posts || []; // 전체 게시글
  const lastPostRef = useRef(null); // 마지막 게시글에 스크롤 맞추기 위한 ref

  // 게시글 최신순 정렬
  useEffect(() => {
    const sortedPosts = [...postData].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA; // 최신순 정렬
    });
    setPosts(sortedPosts);
  }, [postData]);

  // 검색어 공백 제거 및 소문자로 변환해 포함 여부 판단
  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // 검색 필터링 적용된 게시글
  const filteredPosts = posts.filter(
    (post) =>
      normalizeString(post.content).includes(normalizeString(searchTerm)) ||
      normalizeString(post.userName).includes(normalizeString(searchTerm))
  );

  // 검색 결과가 하나일 경우 해당 게시글로 스크롤
  useEffect(() => {
    if (filteredPosts.length === 1 && lastPostRef.current) {
      lastPostRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [filteredPosts]);

  // 날짜 포맷 변환 (yyyy.mm.dd)
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 게시글 삭제
  const postDeleteBtn = async (e, postId) => {
    e.preventDefault();
    const isConfirmed = confirm("게시물을 삭제하시겠습니까?");
    if (isConfirmed) {
      try {
        await onDeletePost(postId);
      } catch (err) {
        console.error("게시물 삭제 중 오류:", err);
      }
    }
  };

  // 모달 닫기 및 편집 상태 초기화
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingPostId(null);
    setImageSrc("");
    setContentDesc("");
  };

  // 게시글 이미지 클릭 시 상세 모달 열기
  const handleImageClick = (post) => {
    setPostedCont(post); // 클릭한 게시물의 정보를 저장
    setIsContOpen(true); // 모달 열기
  };

  // 상세 모달 닫기
  const handleModalContClose = () => {
    setPostedCont(null);
    setIsContOpen(false);
  };

  const isSearching = searchTerm.trim().length > 0;
  return (
    <>
      {/* 검색 결과가 있을 경우 게시글 렌더링 */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((item, i) => {
          const isAuthor = currentUserData?.userId === item.userId;
          return (
            <React.Fragment key={i}>
              <Wrapper>
                <Inner>
                  <Profile>
                    <ProfileContent>
                      <img
                        className="profileImg"
                        src={item.profileImage || defaultProfile}
                        alt="Profile"
                      />
                      <div className="profileText">
                        <h1 className="profileName">{item.userName}</h1>
                        <p className="createdAt">
                          {formatDate(item.createdAt)}
                          <FaEarthAmericas
                            style={{
                              fontSize: "14px",
                              color: "black",
                              marginTop: "2px",
                            }}
                          />
                        </p>
                      </div>
                    </ProfileContent>
                    {isAuthor && (
                      <ControlsIcon>
                        <DeletIcon>
                          <IoCloseOutline
                            onClick={(e) => postDeleteBtn(e, item.id)}
                          />
                        </DeletIcon>
                      </ControlsIcon>
                    )}
                  </Profile>
                  <Contents>
                    {item.content ? (
                      <div className="contentDesc">{item.content}</div>
                    ) : null}
                    {item.image && (
                      <ContImg
                        onClick={() => handleImageClick(item)}
                        src={item.image}
                        alt="Post content"
                      />
                    )}
                  </Contents>
                  <SocialBtnIcon post={item} />
                </Inner>
              </Wrapper>
              {!isSearching && (i + 1) % 3 === 0 && <Mainlive />}
            </React.Fragment>
          );
        })
      ) : (
        <p>검색된 게시물이 없습니다.</p>
      )}
      {/* 업로드/수정 모달 */}
      {isModalOpen && (
        <UploadModal
          closeModal={closeModal}
          postId={editingPostId}
          imageSrc={imageSrc}
          contentDesc={contentDesc}
          isEditing={isEditing}
          currentUserData={currentUserData}
        />
      )}
      {/* 게시글 상세 모달 */}
      {isContOpen && (
        <ModalCont post={postedCont} closeModal={handleModalContClose} />
      )}
    </>
  );
};

export default Mainpage;
