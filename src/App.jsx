import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import {
  DataStateContext,
  DataDispatchContext,
  DarkThemeContext,
  AuthContext,
} from "./contexts";
import GlobalStyles from "./styles/GlobalStyles.styles.js";
import LoadingScreen from "./components/common/LoadingScreen.jsx";
import { darkTheme, lightTheme } from "./styles/theme.js";
import { useFirebaseData } from "./hooks/useFirebaseData";
import { useAuth } from "./hooks/useAuth";
import { getCacheData, setCacheData } from "./utils/cacheUtils";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MOCK_DATA_CACHE_KEY = "mockData";

const App = () => {
  // 다크모드 상태 관리
  const [isDark, setIsDark] = useState(false);
  const [mockData, setMockData] = useState(() => {
    // 초기값을 캐시에서 가져오기
    return getCacheData(MOCK_DATA_CACHE_KEY) || null;
  });

  // 인증 상태 관리
  const { user, loading: authLoading, error: authError } = useAuth();

  // Firebase 데이터 관리 훅 사용
  const {
    userData,
    posts,
    loading: dataLoading,
    error: dataError,
    hasMore,
    loadMorePosts,
    createPost,
    updatePost,
    deletePost,
  } = useFirebaseData();

  // mockData 로드
  useEffect(() => {
    const loadMockData = async () => {
      // 캐시된 데이터가 있으면 새로 불러오지 않음
      if (mockData) return;

      try {
        const response = await fetch("/mockData/mockData.json");
        const data = await response.json();
        setMockData(data);
        setCacheData(MOCK_DATA_CACHE_KEY, data);
      } catch (err) {
        console.error("Mock 데이터 로드 중 오류:", err);
      }
    };
    loadMockData();
  }, [mockData]);

  // 상태 객체를 useMemo로 최적화
  const state = useMemo(
    () => ({
      users: [],
      posts: posts || [],
      stories: [],
      groups: [],
      liveCommerce: mockData?.liveCommerce || [],
      likeCategory: userData?.likeCategory || [],
      category: mockData?.category || [],
      currentUserData: userData || null,
      mockData: mockData || {},
    }),
    [posts, mockData, userData]
  );

  // dispatch 객체를 useMemo로 최적화
  const dispatch = useMemo(
    () => ({
      createPost,
      updatePost,
      deletePost,
      loadMorePosts,
    }),
    [createPost, updatePost, deletePost, loadMorePosts]
  );

  // 다크 모드 저장과 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme) {
      setIsDark(JSON.parse(savedTheme));
    }
  }, []);

  // 다크 모드 상태가 변경되면 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  // 전체 로딩 상태 확인
  const isLoading = authLoading || (dataLoading && !posts?.length) || !mockData;

  // 에러 상태 확인
  useEffect(() => {
    if (authError) {
      console.error("인증 오류:", authError);
    }
    if (dataError) {
      console.error("데이터 로딩 오류:", dataError);
    }
  }, [authError, dataError]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <DarkThemeContext.Provider value={{ isDark, setIsDark }}>
        <AuthContext.Provider value={{ user }}>
          <DataStateContext.Provider value={state}>
            <DataDispatchContext.Provider value={dispatch}>
              <GlobalStyles />
              <RouterProvider router={router} />
            </DataDispatchContext.Provider>
          </DataStateContext.Provider>
        </AuthContext.Provider>
      </DarkThemeContext.Provider>
    </ThemeProvider>
  );
};

export default React.memo(App);
