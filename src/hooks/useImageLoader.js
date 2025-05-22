// 이미지 지연 로딩을 위한 커스텀 훅입니다.
import { useState, useEffect } from "react";

export const useImageLoader = (src, placeholder = "/img/placeholder.jpg") => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 이미지가 없으면 로딩하지 않음
    if (!src) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError("이미지를 불러오는데 실패했습니다.");
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, isLoading, error };
};
