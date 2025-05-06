import { useEffect, useState } from "react";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { MdFileDownload, MdShoppingCart, MdRemoveRedEye, MdOutlineStar } from "react-icons/md";

import { Design } from "../../types/DesignType";
import { Card } from "react-bootstrap";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import { Key } from "@mui/icons-material";

const categoryKeys: Record<string, string> = {
    INTERIOR_DECORATION: "인테리어 & 장식용",
    PLANTER_GARDENING: "플랜테리어 / 정원용",
    STORAGE_ORGANIZATION: "보관 & 정리용",
    GIFTS_SOUVENIRS: "선물 & 기념품",
    TOOLS_FUNCTIONALITY: "도구 & 기능성",
    HOBBIES_PLAY: "취미 & 놀이",
    COMMERCIAL_BRANDING: "상업/브랜딩",
};

const WholeDesignCardContainer = () => {
    const [designList, setDesignList] = useState<Design[]>([]);
    const [filteredDesignList, setFilteredDesignList] = useState<Design[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [isActive, setIsActive] = useState<number>(0);

    const fetchData = async () => {
        try {
            const response = await newAxios.get("/api/v1/model/user/list/popular");
            let data = response.data.data;
            console.log(data);
            setDesignList(data);
            setFilteredDesignList(data);
        } catch (error) {
            console.log(error);
        }
    };

    const filterDesignList = (filter: string): Design[] => {
        const temp = [...designList];
        if (filter == "") return temp;
        return temp.filter((e) => e.category == filter);
    };

    useEffect(() => {
        setFilteredDesignList(filterDesignList(categoryFilter));
    }, [categoryFilter]);

    const sortDefault = () => {
        setIsActive(0);
        setFilteredDesignList(filterDesignList(categoryFilter));
    };

    const sortDesignList = () => {
        const temp = [...filteredDesignList];
        temp.sort((a, b) => {
            return +b.downloadCount - +a.downloadCount;
        });
        setFilteredDesignList(temp);
        setIsActive(1);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Container>
                <CategoryText>도면 장터</CategoryText>
                <FilterTextContainer>
                    <FilterText isActive={categoryFilter == ""} onClick={() => setCategoryFilter("")}>
                        전체
                    </FilterText>
                    {Object.entries(categoryKeys).map(([key, value]) => (
                        <FilterText isActive={categoryFilter == key} onClick={() => setCategoryFilter(key)}>
                            {value}
                        </FilterText>
                    ))}

                    <div style={{ borderLeft: "1px solid #B3B3B3", marginRight: "20px" }} />
                    <FilterText onClick={() => sortDefault()} isActive={isActive == 0}>
                        기본순
                    </FilterText>
                    <FilterText onClick={() => sortDesignList()} isActive={isActive == 1}>
                        판매량순
                    </FilterText>
                </FilterTextContainer>
                <CardContainer>
                    {filteredDesignList.map((e, i) => {
                        return <DesignCard designData={e} key={i} />;
                    })}
                </CardContainer>
            </Container>
        </>
    );
};

const DesignCard = ({ designData }: { designData: Design }) => {
    const navigate = useNavigate();
    const { id, name, author, description, rating, price, viewCount, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl, category, downloadable } = designData;

    const handleOnClick = () => {
        navigate(`/design/${id}`);
    };

    return (
        <>
            <StyledCard onClick={handleOnClick}>
                <StlRenderContainer filePath={modelFileUrl} width="230px" height="150px" clickDisabled={true} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        <DetailText>{author.name}</DetailText>
                        <DetailText>{categoryKeys[category]}</DetailText>
                        <div style={{ fontSize: "16px" }}>₩{price}</div>
                    </Card.Text>
                </Card.Body>
                <CardFooter>
                    <DetailText>
                        <MdShoppingCart /> {downloadCount}
                    </DetailText>
                    <DetailText>
                        <MdRemoveRedEye /> {viewCount}
                    </DetailText>
                    <DetailText>
                        <MdOutlineStar /> {rating}
                    </DetailText>
                </CardFooter>
            </StyledCard>
        </>
    );
};

export default WholeDesignCardContainer;

const Container = styled.div`
    margin-top: 50px;
`;

const CategoryText = styled.div`
    font-size: 30px;
    margin-bottom: 40px;
`;

const FilterTextContainer = styled.div`
    margin-bottom: 30px;
    display: flex;
    flex-direction: row;
`;

const FilterText = styled.div<{ isActive: boolean }>`
    font-size: 15px;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#B3B3B3")};
    margin-right: 20px;
    cursor: pointer;
`;

const CardContainer = styled.div`
    margin: 0px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
`;

const StyledCard = styled(Card)`
    width: 248px;
    height: auto;
    color: black;
    margin-bottom: 4vw;
    padding-top: 10px;

    &:hover {
        //box-shadow: 5px 5px 5px black;
        cursor: pointer;
    }

    .card-img-top {
        width: 230px;
        aspect-ratio: 1.4/1;
        object-fit: cover;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .card-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`;

const CardFooter = styled(Card.Footer)`
    height: 36px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;
