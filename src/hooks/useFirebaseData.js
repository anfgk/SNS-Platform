// Firebase 데이터 관리를 위한 커스텀 훅입니다.
import { useState, useEffect, useCallback, useRef } from "react";
import { auth } from "../firebase";
import { userService, postService } from "../services/firebaseService";
import { paginationUtils } from "../utils/firebaseUtils";
import { handleError } from "../utils/errorUtils";
import { getCacheData, setCacheData } from "../utils/cacheUtils";

const POSTS_CACHE_KEY = "posts";
const USER_DATA_CACHE_KEY = "userData";

export const useFirebaseData = (pageSize = 10) => {
  // 상태 관리
  const [userData, setUserData] = useState(
    () => getCacheData(USER_DATA_CACHE_KEY) || null
  );
  const [posts, setPosts] = useState(() => getCacheData(POSTS_CACHE_KEY) || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // 마운트 상태 추적
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 에러 처리 함수
  const handleFirebaseError = useCallback((error, action) => {
    const processedError = handleError(error);
    if (isMounted.current) {
      setError(processedError);
      console.error(`Error during ${action}:`, processedError);
    }
    return processedError;
  }, []);

  // 사용자 데이터 가져오기
  const fetchUserData = useCallback(
    async (userId) => {
      try {
        const data = await userService.fetchUserData(userId);
        if (isMounted.current) {
          setUserData(data);
          setCacheData(USER_DATA_CACHE_KEY, data);
        }
      } catch (err) {
        handleFirebaseError(err, "fetching user data");
      }
    },
    [handleFirebaseError]
  );

  // 초기 게시물 로드
  const loadInitialPosts = useCallback(async () => {
    try {
      setLoading(true);
      const {
        posts: newPosts,
        lastVisible,
        hasMore: more,
      } = await paginationUtils.fetchPostsByPage(pageSize);

      if (isMounted.current) {
        setPosts(newPosts);
        setCacheData(POSTS_CACHE_KEY, newPosts);
        setLastDoc(lastVisible);
        setHasMore(more);
        setError(null);
      }
    } catch (err) {
      handleFirebaseError(err, "loading initial posts");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [pageSize, handleFirebaseError]);

  // 추가 게시물 로드 (무한 스크롤)
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const {
        posts: newPosts,
        lastVisible,
        hasMore: more,
      } = await paginationUtils.fetchPostsByPage(pageSize, lastDoc);

      if (isMounted.current) {
        setPosts((prev) => {
          const updatedPosts = [...prev, ...newPosts];
          setCacheData(POSTS_CACHE_KEY, updatedPosts);
          return updatedPosts;
        });
        setLastDoc(lastVisible);
        setHasMore(more);
        setError(null);
      }
    } catch (err) {
      handleFirebaseError(err, "loading more posts");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [hasMore, loading, lastDoc, pageSize, handleFirebaseError]);

  // 게시물 생성
  const createPost = useCallback(
    async (postData) => {
      try {
        const newPost = await postService.createPost(postData);
        if (isMounted.current) {
          setPosts((prev) => {
            const updatedPosts = [newPost, ...prev];
            setCacheData(POSTS_CACHE_KEY, updatedPosts);
            return updatedPosts;
          });
          setError(null);
        }
        return newPost;
      } catch (err) {
        const processedError = handleFirebaseError(err, "creating post");
        throw processedError;
      }
    },
    [handleFirebaseError]
  );

  // 게시물 수정
  const updatePost = useCallback(
    async (postId, updatedData) => {
      try {
        const updated = await postService.updatePost(postId, updatedData);
        if (isMounted.current) {
          setPosts((prev) => {
            const updatedPosts = prev.map((post) =>
              post.id === postId ? { ...post, ...updatedData } : post
            );
            setCacheData(POSTS_CACHE_KEY, updatedPosts);
            return updatedPosts;
          });
          setError(null);
        }
        return updated;
      } catch (err) {
        const processedError = handleFirebaseError(err, "updating post");
        throw processedError;
      }
    },
    [handleFirebaseError]
  );

  // 게시물 삭제
  const deletePost = useCallback(
    async (postId) => {
      try {
        await postService.deletePost(postId);
        if (isMounted.current) {
          setPosts((prev) => {
            const updatedPosts = prev.filter((post) => post.id !== postId);
            setCacheData(POSTS_CACHE_KEY, updatedPosts);
            return updatedPosts;
          });
          setError(null);
        }
      } catch (err) {
        const processedError = handleFirebaseError(err, "deleting post");
        throw processedError;
      }
    },
    [handleFirebaseError]
  );

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user && isMounted.current) {
          await fetchUserData(user.uid);
        } else if (isMounted.current) {
          setUserData(null);
        }
      } catch (err) {
        handleFirebaseError(err, "auth state change");
      }
    });

    return () => {
      unsubscribe();
      isMounted.current = false;
    };
  }, [fetchUserData, handleFirebaseError]);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialPosts();
  }, [loadInitialPosts]);

  return {
    userData,
    posts,
    loading,
    error,
    hasMore,
    loadMorePosts,
    createPost,
    updatePost,
    deletePost,
  };
};
