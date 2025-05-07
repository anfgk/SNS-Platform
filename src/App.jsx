import React, { useEffect, useReducer, useState } from "react";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import router from "./routers/router";
import {
  DataStateContext,
  DataDispatchContext,
  DarkThemeContext,
} from "./contexts";
import dataReducer from "./reducers/dataReducer.js";
import GlobalStyles from "./styles/GlobalStyles.styles.js";
import LoadingScreen from "./components/common/LoadingScreen.jsx";
import { darkTheme, lightTheme } from "./styles/theme.js";
import { canAddPoints } from "./utils/util.js";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  const [isDark, setIsDark] = useState(false); // 다크모드 상태
  const [authLoading, setAuthLoading] = useState(true); // 인증 로딩 상태
  const [dataLoading, setDataLoading] = useState(true); // 데이터 로딩 상태

  // 상태 초기값
  const initialState = {
    users: [],
    posts: [],
    stories: [],
    groups: [],
    liveCommerce: [],
    likeCategory: [],
    category: [],
    currentUserData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  // 앱 초기화 함수 (인증, 데이터 로딩)
  useEffect(() => {
    const init = async () => {
      await auth.authStateReady(); // 인증 상태가 준비된 후 호출
      await fetchData(); // 데이터를 불러오는 함수 호출
      setIsLoading(false); // 데이터가 모두 준비된 후 로딩 상태 해제
    };
    init();
  }, []);

  // 다크 모드 저장과 로드
  useEffect(() => {
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme) {
      setIsDark(JSON.parse(savedTheme)); // 저장된 다크모드 상태 가져오기
    }
  }, []);

  // 다크 모드 상태가 변경되면 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  // 로딩 상태 (인증, 데이터)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user); // 인증된 사용자 데이터 가져오기
      }
      setAuthLoading(false); // 인증 로딩 해제
    });
    return () => unsubscribe(); // 리스너 해제
  }, []);

  // 데이터 불러오기 함수
  const fetchData = async () => {
    try {
      // Firestore에서 데이터를 가져옴
      const usersSnapshot = await getDocs(collection(db, "users"));
      const postsSnapshot = await getDocs(collection(db, "posts"));
      const categorySnapshot = await getDocs(collection(db, "category"));
      const users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        posts: [],
        ...doc.data(),
      }));

      // 사용자, 게시물, 카테고리 데이터를 상태에 저장
      const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const categories = categorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const response = await fetch("/mockData/mockData.json");
      const mockData = await response.json();

      dispatch({
        type: "INIT",
        data: { users, posts, mockData, category: categories },
      });
      setDataLoading(false); // 데이터 로딩 상태 해제
    } catch (error) {
      console.error("데이터를 불러오지 못했습니다.", error);
    }
  };

  // 인증된 사용자 데이터 불러오기
  const fetchUserData = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        dispatch({
          type: "SET_CURRENT_USER_DATA",
          data: {
            ...data,
            profileImage: data.profileImage || "", // 기본값 설정
          },
        });
      } else {
        dispatch({ type: "SET_CURRENT_USER_DATA", data: null });
      }
    } catch (error) {
      console.error("사용자 데이터 가져오기 오류:", error);
    }
  };

  // 사용자 로그인 상태에 따라 데이터 가져오기
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user); // 사용자 데이터 가져오기
        setIsLoading(false); // 로딩 완료 후 false 설정
      } else {
        dispatch({ type: "SET_CURRENT_USER_DATA", data: null });
        setIsLoading(false); // 로딩 완료 후 false 설정
      }
    });
    return () => unsubscribe(); // 클린업 함수로 리스너 해제
  }, []);

  // 포스트 생성 함수
  const onCreatePost = async (userId, userName, content, image = null) => {
    const { currentUserData } = state;
    const newPost = {
      userId,
      userName,
      profileImage: currentUserData.profileImage || "",
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    // 이미지가 존재하면 image 필드 추가
    if (image) {
      newPost.image = [image];
    }
    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      // Firestore에 추가된 데이터로 상태를 업데이트
      dispatch({
        type: "ADD_POST",
        newPost: { ...newPost, id: docRef.id },
      });

      dispatch({
        type: "UPDATE_USER_POSTS",
        userId,
        newPostId: docRef.id,
      });
    } catch (error) {
      console.error("Firestore에 포스트 추가 중 오류 발생:", error);
    }
  };

  // 포스트 업데이트 함수
  const onUpdatePost = async (postId, updatedData) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, updatedData);
    } catch (error) {
      console.error("게시물 수정 중 오류:", error);
    }
  };

  // 유저 추가 함수
  const onAddUser = async (
    userId,
    firstName,
    lastName,
    email,
    point = 0,
    won = 0,
    gender = null,
    birthdate = null,
    city = null,
    likeCategory = [],
    profileImage = "",
    backgroundImage = "",
    introduction = ""
  ) => {
    try {
      const userDoc = {
        userId,
        userName: {
          firstName,
          lastName,
        },
        email,
        gender,
        birthdate,
        city,
        likeCategory,
        profileImage,
        backgroundImage,
        introduction,
        wallet: {
          point,
          won,
        },
      };
      await setDoc(doc(db, "users", userId), userDoc);

      dispatch({
        type: "ADD_USER",
        newUser: {
          ...userDoc,
          posts: [],
        },
      });
      // 포인트 적립 로직 추가
      const pageName = window.location.pathname; // 현재 페이지 경로 가져오기
      const interval = setInterval(() => {
        if (canAddPoints(pageName)) {
          dispatch({ type: "ADD_POINTS", value: 500, userId }); // userId별로 포인트 추가
        }
      }, 7000);

      return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
    } catch (error) {
      console.error("Firestore에 유저 추가 중 오류 발생:", error);
    }
  };

  // 좋아요 토글 함수
  const onToggleLike = async (postId, isLiked) => {
    dispatch({
      type: "LIKE_POST",
      postId: postId, // 좋아요가 눌린 포스트 ID
      isLiked: isLiked, // 현재 사용자가 이 포스트에 좋아요를 눌렀는지 여부
    });
  };

  const onCreateComment = async (postId, userId, userName, content) => {
    if (!userId || !content) {
      console.error("userId나 content가 누락되었습니다.");
      return;
    }

    const newComment = {
      id: Date.now().toString(), // 고유한 ID
      userId: userId || "guest", // 기본값 설정
      userName: userName || "Anonymous", // 기본값 설정
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    try {
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (!postDoc.exists()) {
        console.error("해당 포스트가 존재하지 않습니다:", postId);
        return;
      }

      await updateDoc(postDocRef, {
        comments: arrayUnion(newComment),
      });

      dispatch({
        type: "ADD_COMMENT",
        postId,
        newComment,
      });
    } catch (error) {
      console.error("댓글 추가 중 오류 발생:", error);
    }
  };

  const onDeleteComment = async (postId, commentId) => {
    try {
      // Firestore에서 해당 포스트 참조
      const postDocRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postDocRef);

      if (postDoc.exists()) {
        const postData = postDoc.data();

        // 해당 댓글을 제외한 새로운 댓글 배열 생성
        const updatedComments = postData.comments.filter(
          (comment) => comment.id !== commentId
        );

        // Firestore에 업데이트된 댓글 배열 저장
        await updateDoc(postDocRef, { comments: updatedComments });

        // 상태 업데이트
        dispatch({
          type: "DELETE_COMMENT",
          postId,
          commentId,
        });
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
    }
  };

  // 포스트 삭제 함수
  const onDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      dispatch({ type: "DELETE_POST", targetId: postId });
    } catch (error) {
      console.error("Firestore에서 포스트 삭제 중 오류 발생:", error);
    }
  };

  // 로딩 중이면 로딩 화면 표시
  if (authLoading || dataLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <DarkThemeContext.Provider value={{ isDark, setIsDark }}>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <GlobalStyles />
          <DataStateContext.Provider value={state}>
            <DataDispatchContext.Provider
              value={{
                onCreatePost,
                onUpdatePost,
                onAddUser,
                onCreateComment,
                onToggleLike,
                onDeletePost,
                ...state,
                dispatch,
              }}
            >
              {isLoading ? (
                <LoadingScreen />
              ) : (
                <RouterProvider router={router} />
              )}
            </DataDispatchContext.Provider>
          </DataStateContext.Provider>
        </ThemeProvider>
      </DarkThemeContext.Provider>
    </>
  );
};

export default App;
