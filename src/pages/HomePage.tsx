import styled from "styled-components";
import Carousel from "../components/specific/home/Carousel";
import { Typography } from "../components/common/Typography";
import { useEffect, useState } from "react";
import { Design } from "../types/DesignType";
import { newAxios } from "../utils/axiosWithUrl";
import DesignTabImage from "../assets/images/designTab/TabButton9.jpg";
import AuthorTabImage from "../assets/images/designTab/TabButton10.jpg";
import DesignCard from "../components/common/DesignCard";
import DefaultUserImage from "../assets/images/topNavBar/userImg2x.png";
import { smallLevelImagesArray } from "../components/common/LevelImagesArray";
import { User } from "../types/UserType";

const TabImages = [DesignTabImage, AuthorTabImage];
type Category = "design" | "author";

const HomePage = () => {
    const [popularDesigns, setPopularDesigns] = useState<Design[] | undefined>(undefined);
    const [popularAutors, setPopularAuthors] = useState<User[] | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<Category>("design");

    const fetchPopulsrDesigns = async () => {
        try {
            const response = await newAxios.get(`/api/v1/model/user/list/popular-by-downloads?page=0`);
            const data = response.data.data;
            setPopularDesigns(data);
        } catch (e) {
            console.log(e);
        }
    };
    const fetchPopulsrAuthors = async () => {
        try {
            const response = await newAxios.get(`/api/v1/users/authors/popular-by-sales?page=0`);
            const data = response.data.data;
            setPopularAuthors(data);
        } catch (e) {
            console.log(e);
        }
    };
    useEffect(() => {
        fetchPopulsrDesigns();
        fetchPopulsrAuthors();
    }, []);
    return (
        <>
            <PageWrapper>
                <Carousel />
                <div style={{ paddingLeft: "80px", width: "100%" }}>
                    <Typography variant="heading.h6">인기리스트</Typography>
                    <TabContainer>
                        {TabImages.map((image, i) => {
                            const filterText: Category[] = ["design", "author"];
                            return (
                                <TabBox
                                    key={i}
                                    bgImage={image}
                                    onClick={() => {
                                        setSelectedCategory(filterText[i]);
                                    }}
                                >
                                    <TabOpacity isActive={filterText[i] === selectedCategory}>
                                        <Typography variant="body.small_b" color="grayScale.100">
                                            {i === 0 ? "인기 도면" : "인기 작가"}
                                        </Typography>
                                    </TabOpacity>
                                </TabBox>
                            );
                        })}
                    </TabContainer>

                    {selectedCategory === "design" ? <DesignGrid designs={popularDesigns || []} /> : <AuthorGrid authors={popularAutors || []} />}
                </div>
            </PageWrapper>
        </>
    );
};

const DesignGrid = ({ designs }: { designs: Design[] }) => {
    return (
        <DesignContainer>
            {designs.map((e, i) => (
                <DesignCard designData={e} />
            ))}
        </DesignContainer>
    );
};

const AuthorGrid = ({ authors }: { authors: User[] }) => {
    return (
        <>
            {authors.map((author, i) => {
                if (author.totalSalesCount === 0) return;
                const imgUrl = author.profileImageUrl != null ? author.profileImageUrl : DefaultUserImage;
                return (
                    <AuthorCard key={i}>
                        <img src={imgUrl} alt="x" />
                        <div>
                            <RowContainer>
                                <Typography variant="body.medium_b" color="text.heading">
                                    {author.username || author.realname}
                                </Typography>
                                <LevelContainer>
                                    <img src={smallLevelImagesArray[author.sellerLevel]} alt="x" />
                                    <Typography variant="body.xs_m" color="grayScale.400">
                                        LEVEL {author.sellerLevel}
                                    </Typography>
                                </LevelContainer>
                            </RowContainer>

                            <Typography variant="body.small_r" color="grayScale.400">
                                도면 판매 수 {author.totalSalesCount} | 도면 총 판매 액 {author.totalSalesAmount}
                            </Typography>
                        </div>
                    </AuthorCard>
                );
            })}
        </>
    );
};

export default HomePage;

const PageWrapper = styled.div`
    width: 100%;
    min-height: 1080px;
    padding-bottom: 40px;
`;
const TabContainer = styled.div`
    margin: 16px 0;
    display: flex;
    gap: 4px;
`;
const TabBox = styled.div<{ bgImage: string }>`
    height: 40px;
    border-radius: 8px;

    background-image: url("${({ bgImage }) => bgImage}");
    background-size: cover;
    background-position: center;

    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: scale(1.05);
    }
`;

const TabOpacity = styled.div<{ isActive: boolean }>`
    width: 100%;
    height: 100%;
    padding: 0 20px;
    border-radius: 8px;
    background-color: ${({ isActive }) => (isActive ? "rgba(23, 84, 206, 0.8)" : "rgba(0, 0, 0, 0.7)")};

    display: flex;
    align-items: center;
    justify-content: center;
`;

const DesignContainer = styled.div`
    width: 1280px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
`;

const AuthorCard = styled.div`
    width: 1280px;
    height: 80px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 0 16px;

    display: flex;
    align-items: center;

    img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 16px;
    }
`;

const RowContainer = styled.div`
    display: flex;
`;

const LevelContainer = styled.div`
    width: 76px;
    height: 24px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    border-radius: 30px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }
`;
