// 에러 처리를 위한 유틸리티 함수들을 모아둔 파일입니다.

// 에러 타입 정의
export const ErrorTypes = {
  NETWORK: "NETWORK_ERROR",
  AUTH: "AUTH_ERROR",
  FIREBASE: "FIREBASE_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

// 사용자 친화적인 에러 메시지
export const ErrorMessages = {
  [ErrorTypes.NETWORK]: "네트워크 연결을 확인해주세요.",
  [ErrorTypes.AUTH]: "로그인이 필요하거나 권한이 없습니다.",
  [ErrorTypes.FIREBASE]: "Firebase 작업 중 문제가 발생했습니다.",
  [ErrorTypes.VALIDATION]: "입력값이 올바르지 않습니다.",
  [ErrorTypes.UNKNOWN]: "알 수 없는 오류가 발생했습니다.",
};

// Firebase 에러 코드를 ErrorTypes로 매핑
const firebaseErrorMap = {
  "auth/user-not-found": ErrorTypes.AUTH,
  "auth/wrong-password": ErrorTypes.AUTH,
  "auth/email-already-in-use": ErrorTypes.AUTH,
  "permission-denied": ErrorTypes.AUTH,
  "not-found": ErrorTypes.FIREBASE,
  "already-exists": ErrorTypes.FIREBASE,
};

// 에러 객체 생성 함수
export const createError = (type, message, originalError = null) => ({
  type,
  message: message || ErrorMessages[type],
  originalError,
  timestamp: new Date().toISOString(),
});

// Firebase 에러 처리 함수
export const handleFirebaseError = (error) => {
  const errorCode = error.code || error.message;
  const errorType = firebaseErrorMap[errorCode] || ErrorTypes.FIREBASE;

  return createError(errorType, ErrorMessages[errorType], error);
};

// 네트워크 에러 처리 함수
export const handleNetworkError = (error) => {
  return createError(
    ErrorTypes.NETWORK,
    ErrorMessages[ErrorTypes.NETWORK],
    error
  );
};

// 유효성 검사 에러 처리 함수
export const handleValidationError = (error) => {
  return createError(
    ErrorTypes.VALIDATION,
    error.message || ErrorMessages[ErrorTypes.VALIDATION],
    error
  );
};

// 일반적인 에러 처리 함수
export const handleError = (error) => {
  if (!navigator.onLine) {
    return handleNetworkError(error);
  }

  if (error.code) {
    return handleFirebaseError(error);
  }

  if (error.name === "ValidationError") {
    return handleValidationError(error);
  }

  return createError(
    ErrorTypes.UNKNOWN,
    ErrorMessages[ErrorTypes.UNKNOWN],
    error
  );
};
