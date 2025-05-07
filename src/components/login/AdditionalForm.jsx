import React, { useState } from "react";
import styled from "styled-components";
import { SubDescription_16_n } from "../../styles/GlobalStyles.styles";
import {
  Form,
  Ul,
  InputWrapperRow,
  Input,
  FormTitle,
  FormDesc,
  FormItemTitle,
  FormItemDesc,
  Pager,
  Button,
} from "./login-components";
import { useNavigate, useSearchParams } from "react-router-dom";

const Wrapper = styled.div`
  padding: 25px;
  background: var(--color-light-gray-02);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-08);
  @media screen and (max-width: 768px) {
    width: 390px;
    min-width: 390px;
    padding: 0 15px;
    background: var(--color-white);
    box-shadow: none;
  }
`;
const Label = styled.label`
  display: inline-block;
  width: 210px;
  height: 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid var(--color-gray-02);
  border-radius: var(--border-radius-08);
  background: var(--color-white);
  ${SubDescription_16_n}
  cursor: pointer;
`;
const SelectItem = styled.div`
  cursor: pointer;
  position: relative;
  .select-selected {
    padding: 10px 15px;
    border: 1px solid var(--color-gray-02);
    border-radius: var(--border-radius-08);
    background: var(--color-white);
    ${SubDescription_16_n};
  }
  .select-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    svg {
      stroke: var(--color-gray-02);
    }
  }
  .select-items {
    position: absolute;
    bottom: -5px;
    transform: translateY(100%);
    width: 100%;
    border: 1px solid var(--color-gray-02);
    border-radius: var(--border-radius-08);
    overflow: hidden;
    li {
      padding: 10px 15px;
      background: var(--color-white);
      border-bottom: 1px solid var(--color-light-gray-01);
      ${SubDescription_16_n};
      transition: background 0.3s;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        background: var(--color-light-gray-01);
      }
    }
  }
`;

const LocationWrapper = styled.ul`
  &.open {
    display: block;
  }
  &.closed {
    display: none;
  }
`;

const AdditionalForm = ({ updateUserData, mobileSize, progress }) => {
  // 지역 선택 옵션 정의
  const options = [
    { value: 1, location: "서울" },
    { value: 2, location: "경기" },
    { value: 3, location: "대구" },
    { value: 4, location: "부산" },
  ];

  // 선택된 지역 상태, 셀렉트박스 열림 여부 상태
  const [location, setLocation] = useState("지역");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  // URL 쿼리 파라미터 설정을 위한 훅
  const [searchParams, setSearchParams] = useSearchParams();

  // "다음" 버튼 클릭 시 동작
  const handleNext = (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작 방지
    // progress 값을 2로 설정하여 URL에 반영
    searchParams.set("progress", "2");
    setSearchParams(searchParams);

    // 모바일 환경일 경우 페이지 하단으로 스크롤
    if (mobileSize) {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight, // 페이지의 가장 아래로 이동
          behavior: "smooth", // 부드럽게 스크롤
        });
      }, 5);
    }
  };

  // 성별 변경 시 사용자 정보 업데이트
  const handleGenderChange = (e) => {
    updateUserData("gender", e.target.value);
  };

  // 생년월일 변경 시 사용자 정보 업데이트
  const handleBirthChange = (e) => {
    updateUserData("birthdate", e.target.value);
  };

  // 지역 변경 시 사용자 정보 업데이트 및 셀렉트박스 닫기
  const handleLocationChange = (location) => {
    setLocation(location);
    updateUserData("city", location);
  };

  // 셀렉트박스 열고 닫는 토글 함수
  const toggleOption = () => {
    setIsSelectOpen((current) => !current);
  };

  // 셀렉트 항목 클릭 시 셀렉트 닫기 및 값 설정
  const closeOption = (e) => {
    setIsSelectOpen(false);
    handleLocationChange(e.target.innerText);
  };

  return (
    <Wrapper>
      <Form height={630}>
        {/* 모바일이 아닌 경우에만 제목 출력 */}
        {mobileSize ? null : (
          <FormTitle>회원님을 위한 맞춤 홈피드를 준비할게요</FormTitle>
        )}
        <FormDesc>
          언제든지 프로필에서 회원님의 정보를 변경할 수 있습니다.
        </FormDesc>
        <Ul>
          <li>
            <FormItemTitle>성별 입력</FormItemTitle>
            <FormItemDesc>성별을 선택하세요.</FormItemDesc>
            <InputWrapperRow>
              <Label htmlFor="woman">
                여성
                <Input
                  name="gender"
                  type="radio"
                  value="female"
                  id="woman"
                  onChange={handleGenderChange}
                />
              </Label>
              <Label htmlFor="man">
                남성
                <Input
                  name="gender"
                  type="radio"
                  value="male"
                  id="man"
                  onChange={handleGenderChange}
                />
              </Label>
            </InputWrapperRow>
          </li>
          <li>
            <FormItemTitle>생년월일 입력</FormItemTitle>
            <FormItemDesc>생년월일을 선택하세요.</FormItemDesc>
            <Input
              id="birth"
              name="birth"
              type="date"
              width={430}
              onChange={handleBirthChange}
            />
          </li>
          <li>
            <FormItemTitle>지역 입력</FormItemTitle>
            <FormItemDesc>지역을 선택하세요.</FormItemDesc>
            <SelectItem>
              <div className="select-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              <div className="select-selected" onClick={toggleOption}>
                {location}
              </div>
              <LocationWrapper
                className={`select-items select-hide ${
                  isSelectOpen ? "open" : "closed"
                }`}
              >
                {options.map((option) => (
                  <li key={option.value} onClick={closeOption}>
                    {option.location}
                  </li>
                ))}
              </LocationWrapper>
            </SelectItem>
          </li>
        </Ul>
        <div>
          {mobileSize ? null : (
            <Pager>
              <span className="active"></span>
              <span></span>
            </Pager>
          )}
          <Button onClick={handleNext}>다음</Button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AdditionalForm;
