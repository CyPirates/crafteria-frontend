import { useState, useEffect, useRef } from "react";

export const useCarousel = (totalImages: number, transitionTime: number, intervalTime: number) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false); // 확장된 이미지 배열 양 끝 도달 시 안쪽으로 이동할 때는 transition이 필요없어 끄고 키는 역할
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const resetAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current); // 기존 타이머 해제
        intervalRef.current = setInterval(nextSlide, intervalTime); // 새로운 타이머 설정
    };

    const nextSlide = () => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
        resetAutoSlide();
      }
    };
  
    const prevSlide = () => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => prevIndex - 1);
        resetAutoSlide();
      }
    };
  
    const handleEdgeTransition = () => { //확장된 이미지 배열의 양 끝 고려
      if (currentIndex === 0) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(totalImages);
        }, transitionTime * 1000);
      } 
      if (currentIndex === totalImages + 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(1);
        }, transitionTime * 1000);
      } else {
        setTimeout(() => setIsTransitioning(false), transitionTime * 1000);
      }
    };
  
    useEffect(() => {
      handleEdgeTransition();
    }, [currentIndex]);
  
    useEffect(() => {
        resetAutoSlide(); // 컴포넌트 마운트 시 자동 슬라이드 타이머 설정
        // return () => {
        //   if (intervalRef.current) clearInterval(intervalRef.current); // 컴포넌트 언마운트 시 타이머 해제
        // };
    }, []);
  
    return { currentIndex, isTransitioning, nextSlide, prevSlide };
  };
  
