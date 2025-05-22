// Firebase 서비스 관련 함수들을 모아둔 파일입니다.
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
import { auth, db } from "../firebase";
import { handleError } from "../utils/errorUtils";

// 사용자 데이터 관련 함수들
export const userService = {
  // 사용자 데이터 가져오기
  fetchUserData: async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      throw handleError(error);
    }
  },

  // 새로운 사용자 추가
  addUser: async (userData) => {
    try {
      const userRef = doc(db, "users", userData.userId);
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// 게시물 관련 함수들
export const postService = {
  // 모든 게시물 가져오기
  fetchAllPosts: async () => {
    try {
      const postsSnapshot = await getDocs(collection(db, "posts"));
      return postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      throw handleError(error);
    }
  },

  // 새 게시물 생성
  createPost: async (postData) => {
    try {
      const docRef = await addDoc(collection(db, "posts"), postData);
      return { ...postData, id: docRef.id };
    } catch (error) {
      throw handleError(error);
    }
  },

  // 게시물 수정
  updatePost: async (postId, updatedData) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, updatedData);
      return { id: postId, ...updatedData };
    } catch (error) {
      throw handleError(error);
    }
  },

  // 게시물 삭제
  deletePost: async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      return postId;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// 댓글 관련 함수들
export const commentService = {
  // 댓글 생성
  createComment: async (postId, commentData) => {
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion(commentData),
      });
      return commentData;
    } catch (error) {
      throw handleError(error);
    }
  },

  // 댓글 삭제
  deleteComment: async (postId, commentId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postDoc = await getDoc(postRef);
      const updatedComments = postDoc
        .data()
        .comments.filter((comment) => comment.id !== commentId);
      await updateDoc(postRef, { comments: updatedComments });
      return commentId;
    } catch (error) {
      throw handleError(error);
    }
  },
};
