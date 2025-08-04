import styled from "styled-components";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { useCarousel } from "../../../hooks/useCarousel";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useEffect, useState } from "react";

type Advertisement = {
    id: string;
    title: string;
    linkurl: string;
    imageUrl: string;
};
const Carousel = () => {
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const images = advertisements.map((e) => e.imageUrl);

    const fetchImages = async () => {
        const response = await newAxios.get("/api/v1/advertisement-images");
        const data = response.data.data;
        console.log(data);
        setAdvertisements(data);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const totalImages = images.length;
    const extendedImages = [images[totalImages - 1], ...images, images[0]];
    const transitionTime = 0.5; //애니메이션 동작 시간. 초
    const intervalTime = 4000; //자동으로 슬라이드 넘어가는 시간. 밀리초

    const { currentIndex, isTransitioning, nextSlide, prevSlide } = useCarousel(totalImages, transitionTime, intervalTime);

    return (
        <CarouselContainer>
            <CarouselWrapper translateX={currentIndex * 100} transition={isTransitioning ? `transform ${transitionTime}s ease-in-out` : "none"}>
                {extendedImages.map((image, index) => (
                    <CarouselSlide
                        key={index}
                        style={{ backgroundImage: `url(${image})` }}
                        onClick={() => {
                            let adIndex = index - 1;
                            if (adIndex < 0) adIndex += totalImages;
                            const linkUrl = advertisements[adIndex].linkurl;
                            const url = linkUrl.startsWith("https://") ? linkUrl : `https://${linkUrl}`;
                            window.open(url, "_blank");
                        }}
                    />
                ))}
            </CarouselWrapper>
            <PrevButton onClick={prevSlide}>
                <IoIosArrowBack size={20} />
            </PrevButton>
            <NextButton onClick={nextSlide}>
                <IoIosArrowForward size={20} />
            </NextButton>
        </CarouselContainer>
    );
};

export default Carousel;

const CarouselContainer = styled.div`
    position: relative;
    width: 1200px;
    height: 628px;
    margin: auto;
    overflow: hidden;
    border-radius: 15px;
`;

const CarouselWrapper = styled.div<{ translateX: number; transition: string }>`
    display: flex;
    transition: ${({ transition }) => transition};
    transform: ${({ translateX }) => `translateX(-${translateX}%)`};
`;

const CarouselSlide = styled.div`
    min-width: 100%;
    height: 628px;
    background-size: cover;
    background-position: center;
`;

const PrevButton = styled.button`
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
`;

const NextButton = styled.button`
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    border: none;
    border-radius: 50%;
    padding: 10px;
    cursor: pointer;
`;
