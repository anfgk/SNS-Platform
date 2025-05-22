 // 최적화된 이미지 컴포넌트입니다.
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useImageLoader } from '../../hooks/useImageLoader';

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;

  &.loading {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      background-color: #f0f0f0;
    }
    50% {
      background-color: #e0e0e0;
    }
    100% {
      background-color// 최적화된 이미지 컴포넌트입니다.
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useImageLoader } from '../../hooks/useImageLoader';

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;

  &.loading {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      background-color: #f0f0f0;
    }
    50% {
      background-color: #e0e0e0;
    }
    100% {
      background-colorcolor: #666;
  text-align: center;
  font-size: 14px;
`;

const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '',
  width = '100%',
  height = '100%',
  priority = false, // true일 경우 즉시 로딩
  onLoad,
  onError,
  ...props 
}) => {
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef(null);
  const { imageSrc, isLoading, error } = useImageLoader(
    isInView || priority ? src : null
  );

  useEffect(() => {
    if (!imageRef.current || priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '50px', // 이미지가 뷰포트에 50px 진입하기 전에 로딩 시작
      }
    );
    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [priority]);

  const handleLoad = (e) => {
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (onError) onError(e);
  };

  return (
    <ImageWrapper 
      ref={imageRef}
      className={`${className} ${isLoading ? 'loading' : ''}`}
      style={{ width, height }}
    >
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <StyledImage
          src={imageSrc}
          alt={alt}
          isLoaded={!isLoading}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      </ImageWrapper>
  );
};

export default React.memo(OptimizedImage);