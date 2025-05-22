// Firebase 쿼리 관련 유틸리티 함수들을 모아둔 파일입니다.
import {
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { handleError } from "./errorUtils";

// 페이지네이션을 위한 유틸리티 함수들
export const paginationUtils = {
  // 페이지 단위로 게시물 가져오기
  fetchPostsByPage: async (pageSize = 10, lastDoc = null) => {
    try {
      let postsQuery;

      if (lastDoc) {
        // 다음 페이지 데이터 가져오기
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(pageSize)
        );
      } else {
        // 첫 페이지 데이터 가져오기
        postsQuery = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(postsQuery);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 마지막 문서 반환 (다음 페이지 호출시 사용)
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];

      return {
        posts,
        lastVisible,
        hasMore: snapshot.docs.length === pageSize,
      };
    } catch (error) {
      throw handleError(error);
    }
  },

  // 무한 스크롤을 위한 데이터 가져오기
  fetchInfiniteScrollData: async (lastDoc = null, limit = 5) => {
    try {
      const result = await paginationUtils.fetchPostsByPage(limit, lastDoc);
      return {
        items: result.posts,
        nextPageParam: result.lastVisible,
        hasNextPage: result.hasMore,
      };
    } catch (error) {
      throw handleError(error);
    }
  },
};
