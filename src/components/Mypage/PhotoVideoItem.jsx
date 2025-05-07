import React, { useContext } from "react";
import styled from "styled-components";
import { DataStateContext } from "../../contexts";

//font
import {
  SubTitle_16_b,
  SubDescription_14_n,
  SubDescription_12_m,
} from "../../styles/GlobalStyles.styles.js";

const Inner = styled.article`
  display: flex;
  width: 230px;
  height: 310px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.albumBorder};
  border-radius: var(--border-radius-08);
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    width: 160px;
    height: 200px;
  }
`;
const Contents = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.albumBorder};
  border-radius: var(--border-radius-08);
  box-shadow: var(--box-shadow-01);
  @media (max-width: 768px) {
    width: 160px;
    height: 200px;
  }
`;
const ContImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  @media (max-width: 768px) {
    width: 160px;
    height: 140px;
  }
`;
const ContText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 26px 30px 30px;
  @media (max-width: 768px) {
    gap: 4px;
  }
  .contTitle {
    ${SubTitle_16_b}
    width: 100%;
    height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.iconColorB};
    @media (max-width: 768px) {
      ${SubDescription_12_m}
      width:160px;
      padding-top: 10px;
      padding-left: 10px;
    }
  }
  .createdAt {
    ${SubDescription_14_n}
    color:var(--color-gray-02);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    @media (max-width: 768px) {
      ${SubDescription_12_m}
      padding-left: 10px;
    }
  }
  @media (max-width: 768px) {
    width: 80%;
    padding: 0;
  }
`;

const PhotoVideoItem = ({
  userId, // 게시물 작성자의 사용자 ID
  imageSrc, // 게시물 이미지 URL
  contentDesc, // 게시물 설명 텍스트
  createdAt, // 게시물 작성일 (ISO 문자열)
  ModalOpen, // 모달 열기 함수
  ModalClose, // 모달 닫기 함수 (사용되지 않는다면 제거 가능)
}) => {
  const isLiked = false; // 기본적으로 좋아요는 눌리지 않은 상태
  const { currentUserData } = useContext(DataStateContext); // 현재 로그인된 사용자 정보 가져오기

  // 날짜 포맷 함수: ISO 형식의 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환
  const formatDate = (isoString) => {
    const date = new Date(isoString); // 문자열을 Date 객체로 변환
    const year = date.getFullYear(); // 연도 추출
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1) → 두 자리로 포맷
    const day = String(date.getDate()).padStart(2, "0"); // 일 → 두 자리로 포맷
    return `${year}.${month}.${day}`; // 최종 포맷된 날짜 반환
  };
  const isAuthor = currentUserData?.uid === userId; // 현재 로그인된 사용자의 UID와 게시물 작성자의 UID가 일치하는지 확인
  return (
    <Inner>
      <Contents>
        <div>
          {imageSrc && (
            <ContImg
              onClick={() => ModalOpen()}
              src={imageSrc}
              alt="contentImage"
              style={{ display: imageSrc ? "block" : "none" }}
            />
          )}
        </div>
        <ContText>
          <div className="contTitle">{contentDesc}</div>
          <div className="createdAt">{formatDate(createdAt)} </div>
        </ContText>
      </Contents>
    </Inner>
  );
};

export default PhotoVideoItem;
