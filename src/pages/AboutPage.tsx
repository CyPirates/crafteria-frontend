import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Company } from "../types/CompanyType";
import { newAxios } from "../utils/axiosWithUrl";
import styled from "styled-components";
import { useColor } from "color-thief-react";

import Star from "../assets/star.png";

const AboutPage = () => {
    const { id } = useParams();
    const [data, setData] = useState<Company | undefined>(undefined);
    const [imageTheme, setImageTheme] = useState<string>("white");

    const { data: color } = useColor(data?.imageFileUrl || "", "rgbArray", {
        crossOrigin: "anonymous", // 외부 URL 이미지를 다룰 때 필수
    });

    const toPastel = (rgbArray: number[], adjustmentFactor: number = 0.5) => {
        if (!rgbArray) return [255, 255, 255]; // 기본 흰색
        return rgbArray.map((color) => Math.round(color + (255 - color) * adjustmentFactor));
    };
    const pastelColor = color ? toPastel(color) : [255, 255, 255];

    // Ref 생성
    const introRef = useRef<HTMLDivElement>(null);
    const reviewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await newAxios.get(`/api/v1/manufacturers/${id}`);
                console.log(response.data.data);
                setData(response.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    const renderStars = () => {
        return Array.from({ length: +data!.rating }, (_, index) => <img key={index} src={Star} alt="star" />);
    };

    // 탭 클릭 시 스크롤 이동 함수
    const handleScrollToSection = (section: "intro" | "review") => {
        if (section === "intro" && introRef.current) {
            introRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (section === "review" && reviewRef.current) {
            reviewRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    if (!data) return <div>Loading..</div>;

    return (
        <>
            <Header style={{ backgroundColor: `rgb(${pastelColor.join(",")})` }}>
                <ProfileImage src={data.imageFileUrl} alt="x" />
                <ProfileText>
                    <Title>{data.name}</Title>
                    <Rating>
                        {renderStars()} ({data.rating})
                    </Rating>
                    <CompanyInfo>주소: {data.address}</CompanyInfo>
                    <CompanyInfo>전화번호: {data.dialNumber}</CompanyInfo>
                </ProfileText>
            </Header>

            <Tabs>
                <TabButton onClick={() => handleScrollToSection("intro")}>소개</TabButton>
                <TabButton onClick={() => handleScrollToSection("review")}>리뷰</TabButton>
            </Tabs>

            <ContentSection ref={introRef}>
                <SectionTitle>소개</SectionTitle>
                <p>{data.introduction}</p>
            </ContentSection>
            <div style={{ height: "600px" }}></div>
            <ContentSection ref={reviewRef}>
                <SectionTitle>리뷰</SectionTitle>
                <p>리뷰 내용</p>
            </ContentSection>
        </>
    );
};

export default AboutPage;

const Header = styled.div`
    width: 100%;
    height: 320px;
    padding: 30px;
    box-sizing: border-box;

    display: flex;
    align-items: center;
`;

const ProfileImage = styled.img`
    width: 280px;
    height: 280px;
    margin-right: 30px;
    object-fit: contain;
    border-radius: 5px;
`;

const ProfileText = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;
const Title = styled.div`
    font-size: 30px;
    font-weight: bold;
`;

const CompanyInfo = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #3f3f3f;
`;

const Rating = styled.div`
    margin-left: 20px;
    color: #e54444;
    font-size: 20px;
    img {
        width: 16px;
        height: 16px;
        object-fit: cover;
    }
`;

const Tabs = styled.div`
    display: flex;
    margin: 20px 0;
    padding: 10px 0;
    background-color: #ffffff;

    top: 50px; // 페이지 상단에 고정되게 위치 설정
    position: sticky; // 스크롤 시 고정되도록 설정
    z-index: 100; // 다른 요소 위에 표시되도록 설정
`;

const TabButton = styled.div`
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const ContentSection = styled.div`
    padding: 20px;
    margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;
