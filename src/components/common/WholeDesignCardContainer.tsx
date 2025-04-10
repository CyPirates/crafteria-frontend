import { useEffect, useState } from "react";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { Design } from "../../types/DesignType";
import { Card } from "react-bootstrap";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";

//TODO: Filter 기능 추가, SummaryCard 받아온 데이터로 변경

const WholeDesignCardContainer = () => {
    const [designList, setDesignList] = useState<Design[]>([]);
    const [isActive, setIsActive] = useState<number>(0);

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

    const sortDefault = () => {
        setIsActive(0);
        fetchData();
    };

    const sortDesignList = () => {
        const temp = [...designList];
        temp.sort((a, b) => {
            return +b.downloadCount - +a.downloadCount;
        });
        setDesignList(temp);
        setIsActive(1);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <Container>
                <CategoryText>모든 도면</CategoryText>
                <FilterTextContainer>
                    <FilterText onClick={() => sortDefault()} isActive={isActive == 0}>
                        기본순
                    </FilterText>
                    <FilterText onClick={() => sortDesignList()} isActive={isActive == 1}>
                        판매량순
                    </FilterText>
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

const WholeDesignCards = ({ designData }: { designData: Design }) => {
    const navigate = useNavigate();
    const { id, name, description, rating, price, viewCount, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl } = designData;

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
                        <DetailText>
                            크기: {widthSize} x {lengthSize} x {heightSize}(mm)
                        </DetailText>
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
`;

const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;
