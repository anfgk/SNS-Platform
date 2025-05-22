// 캐시 관리를 위한 유틸리티 함수들입니다.

// 캐시 만료 시간 설정 (1시간)
const CACHE_EXPIRY = 60 * 60 * 1000;

// 캐시 데이터 저장
export const setCacheData = (key, data) => {
  const cacheData = {
    data,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

// 캐시 데이터 조회
export const getCacheData = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  const now = new Date().getTime();

  // 캐시가 만료되었으면 null 반환
  if (now - timestamp > CACHE_EXPIRY) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

// 캐시 데이터 삭제
export const clearCache = (key) => {
  localStorage.removeItem(key);
};
