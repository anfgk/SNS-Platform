// CountdownCircle.js
import React, { useEffect, useState } from "react";
import "./CountdownCircle.css"; // CSS 파일 import

const CountdownCircle = () => {
  // 카운트 다운 값을 7로 초기화
  const [count, setCount] = useState(7);
  // 애니메이션 상태, 초기값은 false
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 애니메이션 시작
    setIsAnimating(true);

    // 1초마다 카운트 값 감소시키는 인터벌 설정
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 0) return prevCount - 1; // 카운트가 0보다 클 경우 1씩 감소
        clearInterval(interval); // 카운트가 0이 되면 인터벌 종료
        return prevCount; // 카운트가 0일 때는 그대로 유지
      });
    }, 1000);

    // 컴포넌트가 언마운트될 때 인터벌 클리어
    return () => clearInterval(interval);
  }, []); // 의존성 배열이 빈 배열이므로 처음 한 번만 실행됨

  return (
    <div className={`circle ${isAnimating ? "animate" : ""}`}>
      {/* 애니메이션 적용 시 animate 클래스 추가 */}
      <span className="count">{count}</span>
      {/* 카운트 값 표시 */}
    </div>
  );
};

export default CountdownCircle;
