import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../firebase";

// 인증된 사용자만 접근할 수 있는 보호 라우트 컴포넌트
const ProtectedRoute = ({ children }) => {
  // 현재 로그인된 사용자 정보를 가져옴
  const user = auth.currentUser;

  // 사용자가 로그인하지 않은 경우, 로그인 페이지로 리다이렉트
  if (user === null) return <Navigate to={"/login"} />;

  // 로그인된 사용자가 있는 경우, 자식 컴포넌트를 렌더링
  return children;
};

export default ProtectedRoute;
