// 주어진 페이지에 대한 마지막 추가 시간을 로컬 스토리지에 저장하는 함수
export const setLastAddedTime = (page) => {
  // 로컬 스토리지에 `lastAdded_{page}` 키로 현재 시간을 저장
  localStorage.setItem(`lastAdded_${page}`, new Date().toLocaleString());
};

// 주어진 페이지에 대한 마지막 추가 시간을 로컬 스토리지에서 가져오는 함수
export const getLastAddedTime = (page) => {
  // 로컬 스토리지에서 `lastAdded_{page}` 값을 가져옴
  const time = localStorage.getItem(`lastAdded_${page}`);

  // 값이 있으면 Date 객체로 변환하여 반환, 없으면 null 반환
  return time ? new Date(time) : null;
};

// 주어진 페이지에서 포인트를 추가할 수 있는지 여부를 판단하는 함수
export const canAddPoints = (page) => {
  // 마지막 추가 시간을 가져옴
  const lastTime = getLastAddedTime(page);

  // 마지막 추가 시간이 없으면 (처음이라면) 포인트 추가 가능
  if (!lastTime) return true;

  // 현재 시간을 가져옴
  const now = new Date();

  // 마지막 추가 시간과 현재 시간의 차이를 계산
  const diff = now - lastTime;

  // 24시간 이상 차이가 나면 포인트를 추가할 수 있음
  return diff > 24 * 60 * 60 * 1000;
};
