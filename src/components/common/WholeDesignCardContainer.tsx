import { useEffect, useState } from "react";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { DesignProps } from "../../types/DesignType";
import { Card } from "react-bootstrap";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";

//TODO: Filter 기능 추가, SummaryCard 받아온 데이터로 변경

const WholeDesignCardContainer = () => {
    const [designList, setDesignList] = useState<DesignProps[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await newAxios.get("/api/v1/model/user/list/popular");
                let data = response.data.data;
                console.log(data);
                setDesignList(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Container>
                <CategoryText>도면 전체보기</CategoryText>
                <FilterTextContainer>
                    <FilterText>기본순</FilterText>
                    <FilterText>인기순</FilterText>
                    <FilterText>최신순</FilterText>
                </FilterTextContainer>
                <CardContainer>
                    {designList.map((e, i) => {
                        return <WholeDesignCards designData={e} key={i} />;
                    })}
                </CardContainer>
            </Container>
        </>
    );
};

const WholeDesignCards = ({ designData }: { designData: DesignProps }) => {
    const navigate = useNavigate();
    const { id, name, description, rating, price, viewCount, downloadCount, maximumSize, minimumSize, modelFileUrl } = designData;

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
                        <DetailText>가격: {price}원</DetailText>
                        <DetailText>크기: {minimumSize}</DetailText>
                        <DetailText>판매량: {downloadCount}</DetailText>
                        <DetailText>조회수: {viewCount}</DetailText>
                    </Card.Text>
                </Card.Body>
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

const FilterText = styled.div`
    font-size: 15px;
    color: #b3b3b3;
    margin-right: 20px;
    cursor: pointer;
`;

const CardContainer = styled.div`
    margin: 0px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
`;

const StyledCard = styled(Card)`
    width: 234px;
    height: auto;
    color: black;
    background-color: white;
    border-radius: 10px;
    border: solid 2px #5c5c60;
    margin-bottom: 4vw;

    &:hover {
        box-shadow: 5px 5px 5px black;
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
`;

const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;
