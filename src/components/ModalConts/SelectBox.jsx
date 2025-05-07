import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 180px;
  /* height: 38px; */
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;

  cursor: pointer;
  .label {
    display: flex;
    justify-content: end;
    width: inherit;
    border: 0 none;
    outline: 0 none;
    padding: 5px 27px;
    background: transparent;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .optionList {
    position: absolute;
    top: -13px;
    width: 100%;
    background: #fff;
    box-shadow: 4px 6px 14px rgba(182, 182, 182, 0.8);
    color: var(--color-gray-01);
    list-style-type: none;
    padding: 12px 16px;
    border-radius: 8px;
    max-height: 0;
    opacity: 0.2;
    visibility: hidden;
    overflow: hidden;
    transition:
      max-height 0.3s ease,
      opacity 0.1s ease,
      visibility 0.1s;
    *:hover {
      background: var(--color-facebookblue);
      color: #fff;
      box-shadow: 3px 4px 8px rgba(170, 170, 170, 0.7);
    }
  }

  &.active .optionList {
    max-height: 200px;
    opacity: 1;
    visibility: visible;
  }

  .optionItem {
    padding: 6px 11px;
    transition: 0.1s;
    margin-bottom: 8px;
    border-radius: 8px;
    transition: all 0.1s;
    &:last-child {
      border-bottom: 0 none;
    }
  }
`;

const SelectBox = ({ Title, desc1, desc2, desc3 }) => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 메뉴 열림/닫힘 상태를 관리하는 state
  // const [selectedOption, setSelectedOption] = useState("최신순"); // (사용 안 함) 선택된 옵션을 저장하는 state
  const dropdownRef = useRef(null); // 드롭다운 DOM 요소를 참조하기 위한 ref

  // 컴포넌트가 마운트되었을 때 외부 클릭을 감지하여 드롭다운을 닫도록 이벤트 리스너 등록
  useEffect(() => {
    // 클릭한 요소가 드롭다운 외부일 경우
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // 드롭다운을 닫음
      }
    };

    document.addEventListener("mousedown", handleClickOutside); // 외부 클릭 감지
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, [dropdownRef]);

  // 드롭다운 버튼 클릭 시 열림/닫힘 상태를 토글
  const toggleDropdown = () => {
    setIsOpen(!isOpen); // 드롭다운 열림/닫힘 상태 토글
  };

  // 드롭다운 항목 클릭 시 동작 처리 (현재 선택된 옵션을 설정하고 드롭다운을 닫음)
  const handleOptionClick = (option) => {
    setSelectedOption(option); // 선택된 옵션을 상태에 저장 (주석 처리되어 있어 동작하지 않음)
    setIsOpen(false); // 옵션 선택 후 드롭다운 닫기
  };

  return (
    <Wrapper className={isOpen ? "active" : ""} ref={dropdownRef}>
      <button className="label" onClick={toggleDropdown}>
        {Title || "최신순"}
      </button>
      <ul className="optionList">
        <li className="optionItem" onClick={() => handleOptionClick("최신순")}>
          {desc1 || "최신순"}
        </li>
        <li
          className="optionItem"
          onClick={() => handleOptionClick("좋아요 많은 순")}
        >
          {desc2 || "좋아요 많은 순"}
        </li>
        <li
          className="optionItem"
          onClick={() => handleOptionClick("관련성 높은 순")}
        >
          {desc3 || "관련성 높은 순"}
        </li>
      </ul>
    </Wrapper>
  );
};

export default SelectBox;
