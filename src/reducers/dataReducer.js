const dataReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      //데이터 초기화
      return { ...state, ...action.data };
    case "ADD_USER": {
      const newState = { ...state, users: [...state.users, action.newUser] };
      return newState;
    }
    case "ADD_POST": {
      // posts 배열에 새 포스트 추가
      const updatedPosts = [action.newPost, ...state.posts];
      return { ...state, posts: updatedPosts };
    }
    case "UPDATE_USER_POSTS": {
      // users 배열에서 해당 userId를 가진 사용자의 posts에 새로운 postId 추가
      const updatedUsers = state.users.map((user) =>
        user.id === action.userId
          ? { ...user, posts: [...user.posts, action.newPostId] } // posts 배열에 새 postId 추가
          : user
      );
      return { ...state, users: updatedUsers };
    }
    case "LIKE_POST": {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === action.postId) {
          const updatedLikes = action.isLiked ? post.likes - 1 : post.likes + 1; // 좋아요 수 증가/감소
          return {
            ...post,
            likes: updatedLikes, // 업데이트된 좋아요 수
          };
        }
        return post;
      });
      return { ...state, posts: updatedPosts };
    }
    case "ADD_COMMENT": {
      // 포스트 ID에 맞는 포스트를 찾아서 댓글 추가
      const updatedPosts = state.posts.map((post) => {
        if (post.id === action.postId) {
          // 해당 포스트의 comments 배열에 새로운 댓글 추가
          return {
            ...post,
            comments: [...post.comments, action.newComment],
          };
        }
        return post;
      });

      return { ...state, posts: updatedPosts };
    }
    case "UPDATE_USER": {
      const updatedUsers = state.users.map((user) =>
        user.id === action.updatedUser.id ? action.updatedUser : user
      );
      return { ...state, users: updatedUsers };
    }
    case "DELETE_POST": {
      const updatedPosts = state.posts.filter(
        (post) => post.id !== action.targetId
      );
      return { ...state, posts: updatedPosts };
    }
    //라이브 커머스 포인트
    case "INIT_POINTS": {
      const storedPoints = localStorage.getItem("points");
      const initialPoints = storedPoints ? parseInt(storedPoints) : 0;
      return { ...state, points: initialPoints };
    }
    case "ADD_POINTS":
      return {
        ...state,
        currentUserData: {
          ...state.currentUserData,
          wallet: {
            ...state.currentUserData.wallet,
            point: (state.currentUserData.wallet?.point || 0) + action.payload,
          },
        },
      };
    case "SET_CURRENT_USER_DATA":
      return { ...state, currentUserData: action.data };
    default:
      return state;
  }
};

export default dataReducer;
