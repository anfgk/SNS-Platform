import { DarkThemeContext, DataStateContext } from "../../contexts";

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";

import SideBarMenu from "./SideBarMenu";
import SideBarGroup from "./SideBarGroup";
import SideBarWallet from "./SideBarWallet";

import styled from "styled-components";

import mobileLogo from "/img/Logo.png";
import HeaderlogoImg from "/img/HeaderLogo.svg";
import defaultProfile from "/img/defaultProfile.jpg";

import { AiOutlineShop } from "react-icons/ai";
import { BsCollectionPlay } from "react-icons/bs";
import { FaBell, FaMoon } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { TbGridDots } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";

const Header = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  z-index: 100;
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    height: 26px;
  }
  z-index: 5;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const HeaderSticky = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  z-index: 100;
  padding: 0 15px;
  width: 100%;
  height: 88px;
  display: flex;
  align-items: center;
  top: 0;
  left: 0;
  position: ${(props) => (props.$sticky ? "fixed" : "relative")};
  -webkit-box-shadow: 0 4px 6px -6px #222;
  -moz-box-shadow: 0 4px 6px -6px #222;
  box-shadow: 0 4px 6px -6px #222;
  margin-bottom: 20px;
  @media screen and (max-width: 1050px) {
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    position: fixed;
    height: 60px;
  }
`;

const Left = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  img {
    height: 40px;
  }
  div {
    position: relative;
    svg {
      color: ${(props) => props.theme.textColor};
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    input {
      width: 254px;
      height: 48px;
      border-radius: 140px;
      border: none;
      color: ${(props) => props.theme.iconColorB};
      background-color: ${(props) => props.theme.inputColor};
      padding-left: 50px;
      font-size: 16px;
      &::placeholder {
        transition: all 0.3s;
        color: ${(props) => props.theme.placeholderColor};
      }
      &:focus {
        outline: none;
        &::placeholder {
          color: transparent;
        }
      }
    }
  }
  .mobileLogo {
    display: none;
  }
  @media screen and (max-width: 1050px) {
    div {
      input {
        width: 220px;
      }
    }
  }
  @media screen and (max-width: 768px) {
    div {
      display: none;
    }
    .mobileLogo {
      display: block;
    }
  }
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  gap: 10px;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  div {
    cursor: pointer;
    width: 80px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 2.5px solid var(--color-facebookblue);
    svg {
      color: ${(props) => props.theme.textColor};
      font-size: 24px;
    }
  }
  @media screen and (max-width: 1050px) {
    div {
      width: 50px;
    }
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Right = styled.div`
  width: 500px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  @media screen and (max-width: 1050px) {
    justify-content: flex-end;
  }
`;
const RightFirst = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  span {
    cursor: pointer;
    font-size: 14px;
    color: var(--color-facebookblue);
  }
  @media screen and (max-width: 1050px) {
    width: 20px;
    h3 {
      display: none;
    }
    span {
      display: none;
    }
  }
`;
const ProfileWrap = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  div {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      object-fit: cover;
      object-position: center;
      width: 100%;
      height: 100%;
    }
  }
  h3 {
    color: ${(props) => props.theme.textColor};
    font-size: var(--font-size-subtitle);
    font-weight: normal;
  }
  .Potint {
    color: var(--color-facebookblue);
  }
  @media screen and (max-width: 1050px) {
    width: 100px;
    justify-content: flex-end;
    div {
    }
  }
`;

const RightSecond = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  svg {
    font-size: 18px;
  }
  & > div:nth-child(1) {
    display: none;
  }
  @media screen and (max-width: 1050px) {
    & > div:nth-child(3) {
      display: none;
    }
  }
  @media screen and (max-width: 768px) {
    & > div:nth-child(1) {
      display: flex;
    }
    & > div:nth-child(2) {
    }
    & > div:nth-child(3) {
      display: none;
    }
    & > div:nth-child(4) {
    }
    & > div:nth-child(5) {
      display: none;
    }
  }
`;
const IconWrap = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-light-gray-01);
  display: flex;
  justify-content: center;
  align-items: center;
`;

// HeaderTop 컴포넌트: 페이지 상단에 고정되는 헤더, 로고와 링크 제공
export const HeaderTop = () => {
  return (
    <Header>
      <Link to="/">
        <img src={HeaderlogoImg} alt="haederLogo" />
      </Link>
    </Header>
  );
};

// HeaderBottom 컴포넌트: 페이지 상단에 위치한 동적인 헤더, 검색, 프로필, 알림 기능 포함
export const HeaderBottom = ({ onSearch }) => {
  const navigate = useNavigate();
  const data = useContext(DataStateContext);
  const currentUser = data.currentUserData; // 현재 사용자 데이터
  const { currentUserData } = useContext(DataStateContext);
  const [sideMenuOpen, setSideMenuOpen] = useState(false); // 사이드 메뉴 열림 상태
  const { isDark, setIsDark } = useContext(DarkThemeContext); // 다크모드 상태
  const [sideBarGroupOpen, setSideBarGroupOpen] = useState(false); // 사이드 그룹 메뉴 열림 상태
  const [sideWalletOpen, setSideWalletOpen] = useState(false); // 사이드 월렛 열림 상태
  const [issticky, setissticky] = useState(false); // 스크롤에 따라 헤더 고정 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 검색어가 바뀔 때마다 호출되는 함수
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    if (onSearch) {
      onSearch(searchTerm); // 함수가 있으면 호출
    } else {
      console.warn("onSearch 함수가 전달되지 않았습니다.");
    }
  };

  // 스크롤 위치 감지 및 상태 업데이트
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // 스크롤 위치가 50px 이상일 때 헤더 고정
        setissticky(true);
      } else {
        // 스크롤 위치가 50px 이하일 때 원래 상태로
        setissticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가
    return () => {
      window.removeEventListener("scroll", handleScroll); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  // currentUserData가 업데이트 되면 로딩 상태를 false로 설정
  useEffect(() => {
    if (currentUserData) {
      setLoading(false); // 데이터가 로드된 후 로딩 해제
    }
  }, [currentUserData]);

  // 사이드 메뉴 열기/닫기
  const sideMenu = (e) => {
    e.stopPropagation();
    setSideMenuOpen((prev) => !prev); // 사이드 메뉴 상태 토글
    setSideBarGroupOpen(false); // 사이드 그룹 메뉴 닫기
    setSideWalletOpen(false); // 사이드 월렛 메뉴 닫기
  };

  // 사이드 그룹 메뉴 열기/닫기
  const sideGroup = (e) => {
    e.stopPropagation();
    setSideBarGroupOpen((prev) => !prev); // 사이드 그룹 메뉴 상태 토글
    setSideMenuOpen(false); // 사이드 메뉴 닫기
    setSideWalletOpen(false); // 사이드 월렛 메뉴 닫기
  };

  // 사이드 월렛 메뉴 열기/닫기
  const sideWallet = (e) => {
    e.stopPropagation();
    setSideWalletOpen((prev) => !prev); // 사이드 월렛 메뉴 상태 토글
    setSideMenuOpen(false); // 사이드 메뉴 닫기
    setSideBarGroupOpen(false); // 사이드 그룹 메뉴 닫기
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setSideMenuOpen(false);
    setSideBarGroupOpen(false);
    setSideWalletOpen(false);
  };

  // 마이페이지로 이동
  const goMypage = () => {
    const userConfirm = confirm("마이페이지로 이동하시겠습니까?");
    if (userConfirm) {
      navigate("/mypage"); // 마이페이지로 이동
      return;
    }
  };

  // 로그아웃 처리
  const onLogOut = async () => {
    const confirmation = confirm("페이스북에서 로그아웃 하시겠습니까?");
    if (confirmation) {
      await auth.signOut(); // Firebase 로그아웃
      navigate("/login"); // 로그인 페이지로 이동
    }
  };

  if (loading) {
    return <div>Loading...</div>; // 데이터 로딩 중일 때 표시
  }
  return (
    <HeaderSticky $sticky={issticky ? "true" : null}>
      {/* 스크롤 상태에 따른 헤더 고정 여부 */}
      <Left>
        <img
          className="mobileLogo"
          onClick={() => navigate("/")}
          src={mobileLogo}
          alt="mobileLogo"
        />
        <div>
          <FaMagnifyingGlass />
          <input
            type="text"
            placeholder="Search Facebook"
            onChange={handleSearchChange} // 검색어 변경 시 핸들러
          />
        </div>
      </Left>
      <Center>
        <div onClick={() => navigate("/")}>
          <AiFillHome />
        </div>
        <div onClick={() => alert("서비스 준비중 입니다")}>
          <BsCollectionPlay />
        </div>
        <div onClick={() => alert("서비스 준비중 입니다")}>
          <AiOutlineShop />
        </div>
        <div onClick={() => alert("서비스 준비중 입니다")}>
          <IoPeopleOutline />
        </div>
      </Center>
      <Right>
        <RightFirst>
          <ProfileWrap>
            <div>
              <img
                onClick={goMypage} // 클릭 시 마이페이지로 이동
                src={
                  currentUserData.profileImage
                    ? currentUserData.profileImage
                    : defaultProfile
                }
                alt="User Profile"
              />
            </div>
            <h3 onClick={sideWallet}>
              {currentUserData.userName.firstName}
              {currentUserData.userName.lastName}
            </h3>
            <h3 onClick={sideWallet} className="Potint">
              {currentUserData.wallet.point}p
            </h3>
          </ProfileWrap>
        </RightFirst>
        <RightSecond>
          <IconWrap>
            <FaSearch />
          </IconWrap>
          <IconWrap onClick={sideMenu}>
            <TbGridDots />
          </IconWrap>
          <IconWrap onClick={() => alert("서비스 준비중 입니다")}>
            <FaBell />
          </IconWrap>
          <IconWrap onClick={() => setIsDark((prev) => !prev)}>
            {isDark ? <FiSun /> : <FaMoon />}
          </IconWrap>
          <IconWrap>
            <MdOutlineLogout onClick={onLogOut} />
          </IconWrap>
        </RightSecond>
      </Right>
      {/* 사이드 메뉴, 그룹, 월렛 관련 컴포넌트 렌더링 */}
      {sideMenuOpen && (
        <SideBarMenu
          sideMenuOpen={sideMenuOpen}
          openGroup={() => setSideBarGroupOpen((prev) => !prev)}
          closeModal={() => {
            setSideMenuOpen(false);
            setSideBarGroupOpen(false);
            setSideWalletOpen(false);
          }}
        />
      )}
      {sideBarGroupOpen && (
        <SideBarGroup
          openGroup={() => setSideBarGroupOpen((prev) => !prev)}
          closeModal={() => {
            setSideMenuOpen(false);
            setSideBarGroupOpen(false);
            setSideWalletOpen(false);
          }}
        />
      )}
      {sideWalletOpen && (
        <SideBarWallet
          onClick={() => setSideWalletOpen((prev) => !prev)}
          closeModal={() => {
            setSideMenuOpen(false);
            setSideBarGroupOpen(false);
            setSideWalletOpen(false);
          }}
        />
      )}
    </HeaderSticky>
  );
};
