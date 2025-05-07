import React, { useState, useContext, useEffect } from "react";
import { DataDispatchContext } from "../../contexts";
import styled from "styled-components";
import { CiCamera } from "react-icons/ci";
import { FiX } from "react-icons/fi";
import { storage } from "../../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SubDescription_14_n } from "../../styles/GlobalStyles.styles.js";
import defaultProfile from "/img/defaultProfile.jpg";

// Styled-components
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Inner = styled.div`
  width: 820px;
  padding: 30px 20px 50px;
  border-radius: 30px;
  box-shadow: var(--box-shadow-01);
  background-color: ${(props) => props.theme.bgColor};
  @media (max-width: 768px) {
    margin: 0 20px;
  }
`;
const ModalTitle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-bottom: 15px;
  padding-bottom: 20px;
  font-size: 22px;
  color: ${(props) => props.theme.textColor};
  border-bottom: 1px solid var(--color-light-gray-01);
  @media (max-width: 768px) {
    font-size: 16px;
  }
  .title {
    font-weight: bold;
  }
  .xmark {
    width: 26px;
    height: 40px;
    display: flex;
    align-items: center;
    position: absolute;
    top: -10px;
    right: 20px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: var(--color-facebookblue);
    }
    @media (max-width: 768px) {
      top: -8px;
      font-size: 20px;
    }
  }
`;
const Posting = styled.div`
  padding: 0 60px;
  @media (max-width: 768px) {
    padding: 0 16px;
  }
  textarea {
    ${SubDescription_14_n}
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
    padding: 14px 20px;
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.textareaColor};
    color: ${(props) => props.theme.textColor};
    background: ${(props) => props.theme.textareaColor};
    resize: none;
    @media (max-width: 768px) {
      font-size: 12px;
    }
    &:focus {
      outline: none;
    }
  }
`;
const PostingImg = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    height: fit-content;
  }
  .deletIcon {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    padding: 5px 8px 4px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
    @media (max-width: 768px) {
      height: 200px;
    }
  }
`;

const PostingBtn = styled.button`
  width: 100%;
  height: 55px;
  border-radius: 8px;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: var(--color-white);
  background: var(--color-facebookblue);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
    font-size: 16px;
    height: 40px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 15px;
    .profileImg {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    .profilename {
      color: ${(props) => props.theme.textColor};
    }
  }
  .camera {
    font-size: 30px;
    border-radius: 50%;
    color: ${(props) => props.theme.iconColorB};
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      border-radius: 50%;
      color: var(--color-facebookblue);
    }
  }
`;

const UploadModal = ({
  closeModal, // 모달 닫기 함수
  postId, // 수정 시 사용할 게시물 ID
  imageSrc, // 수정 시 기존 이미지 URL
  contentDesc, // 수정 시 기존 게시물 내용
  isEditing, // 수정 모드 여부 (true: 수정, false: 새 게시물 업로드)
  currentUserData, // 현재 사용자 데이터
}) => {
  const { onUpdatePost, onCreatePost } = useContext(DataDispatchContext); // 게시물 생성/수정 함수
  const [isLoading, setIsLoading] = useState(false); // 업로드 중 로딩 상태
  const [uploadText, setUploadText] = useState(""); // 입력된 텍스트 내용
  const [uploadFile, setUploadFile] = useState(null); // 선택한 이미지 파일
  const [previewImg, setPreviewImg] = useState(imageSrc || null); // 이미지 미리보기 URL

  // 수정 모드일 경우 기존 내용을 텍스트 입력란에 설정
  useEffect(() => {
    if (isEditing) {
      setUploadText(contentDesc || "");
    }
  }, [isEditing, contentDesc]);

  // 파일이 변경될 때마다 이미지 미리보기 URL 생성
  useEffect(() => {
    if (uploadFile) {
      const imageUrl = URL.createObjectURL(uploadFile);
      setPreviewImg(imageUrl);

      // 컴포넌트 언마운트 또는 파일 변경 시 URL 메모리 해제
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  }, [uploadFile]);

  // 게시물 업로드 또는 수정 처리 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 텍스트와 이미지가 모두 없는 경우 경고
    if (!uploadFile && !uploadText && !contentDesc) {
      alert("내용을 입력해주세요");
      return;
    }

    setIsLoading(true); // 로딩 시작
    let imageUrl = imageSrc; // 기존 이미지 URL

    // 새 이미지가 있을 경우 업로드 수행
    if (uploadFile) {
      try {
        imageUrl = await uploadImage(uploadFile);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setIsLoading(false);
        return;
      }
    }

    try {
      if (isEditing) {
        // 게시물 수정 요청
        await onUpdatePost(postId, {
          content: uploadText || contentDesc || "",
          image: imageUrl || null,
          updatedAt: new Date().toISOString(),
        });
        alert("게시물이 수정되었습니다.");
      } else {
        // 게시물 새로 생성
        await onCreatePost({
          userId: "testUserId", // 여기에 실제 사용자 ID를 사용
          userName: "TestUser", // 여기에 실제 사용자 이름을 사용
          content: uploadText || "",
          image: imageUrl || null,
          createdAt: new Date().toISOString(),
        });
        alert("게시물이 성공적으로 업로드되었습니다.");
      }

      // 입력 필드 초기화
      setUploadText("");
      setUploadFile(null);
      setPreviewImg(null);

      // 모달 닫기
      closeModal();
    } catch (err) {
      console.error("게시물 처리 중 오류:", err);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 이미지 파일을 Firebase Storage에 업로드하고 URL 반환
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}-${Date.now()}`); // 파일 경로에 타임스탬프 추가
      await uploadBytes(storageRef, file); // Firebase에 업로드
      return await getDownloadURL(storageRef); // 업로드된 이미지의 접근 URL 반환
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      throw err;
    }
  };

  // 이미지 미리보기 제거 함수
  const closeImgOpen = () => {
    if (typeof previewImg === "string" && previewImg.startsWith("blob:")) {
      URL.revokeObjectURL(previewImg); // 메모리에서 blob URL 해제
    }
    setUploadFile(null);
    setPreviewImg(null);
  };

  // 이미지 선택 시 파일 유효성 검사 및 상태 설정
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 50 * 1024 * 1024) {
        // 50MB 이하 파일만 허용
        setUploadFile(file);
      } else {
        alert("업로드할 수 있는 파일의 최대 크기는 50MB입니다");
      }
    }
  };
  return (
    <Wrapper>
      <Inner>
        <ModalTitle>
          <div className="title">
            {isEditing ? "게시물 수정하기" : "게시물 올리기"}
          </div>
          <div className="xmark" onClick={closeModal}>
            <FiX />
          </div>
        </ModalTitle>
        <Posting>
          <InfoItem>
            <div className="info">
              <img
                className="profileImg"
                src={currentUserData.profileImage || defaultProfile}
                alt="profile Image"
              ></img>
              <div className="profilename">
                {currentUserData.userName.firstName}
                {currentUserData.userName.lastName}
              </div>
            </div>
            <label htmlFor="upload-image">
              <CiCamera className="camera" />
            </label>
          </InfoItem>
          <textarea
            value={uploadText}
            onChange={(e) => setUploadText(e.target.value)}
            placeholder="오늘 어떤 일이 있으셨나요?"
            required
          />
          {previewImg && (
            <PostingImg>
              <div className="deletIcon" onClick={closeImgOpen}>
                <FiX />
              </div>
              <img src={previewImg} alt="Post Image" />
            </PostingImg>
          )}
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <PostingBtn onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "게시 중..." : isEditing ? "수정하기" : "게시하기"}
          </PostingBtn>
        </Posting>
      </Inner>
    </Wrapper>
  );
};

export default UploadModal;
