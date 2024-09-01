import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";


import { designList as data } from "../../testdata/dummyDesign";

//TODO: Filter 기능 추가, SummaryCard 받아온 데이터로 변경

const WholeDesignCardContainer = () => {
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
                    <WholeDesignCards />
                </CardContainer>
            </Container>
        </>
    )
}

const WholeDesignCards = () => {
    const navigate = useNavigate();

    return (
        <>
            {data.map((e, i) => {
                const { publishedDay, name, size, price, volume, id, filePath, fileType } = e;
                const handleOnclick = () => {
                    navigate(`/design/${id}`, {
                        state: { publishedDay, name, size, price, volume, id, filePath, fileType }
                    })
                }
                return (
                    <StyledCard onClick={handleOnclick}>
                        <Card.Img variant="top" src={e.profileImage} />
                        <Card.Body>
                            <Card.Title>{e.name}</Card.Title>
                            <Card.Text>
                                <DetailText>가격: {price}원</DetailText>
                                <DetailText>파일크기: {size}</DetailText>
                                <DetailText>판매량: {volume}</DetailText>
                                <DetailText>등록일: {publishedDay}</DetailText>
                            </Card.Text>
                        </Card.Body>
                    </StyledCard>
                )
            }
            )}
        </>
    );
}

export default WholeDesignCardContainer;

const Container = styled.div`
  margin-left: 4vw;
  margin-top: 2vw;
`

const CategoryText = styled.div`
  font-size: 30px;
  margin-bottom: 2vw;
`


const FilterTextContainer = styled.div`
    margin-bottom: 2vw;
    display: flex;
    flex-direction: row;
`

const FilterText = styled.div`
    font-size: 15px;
    color: #B3B3B3;
    margin-right: 20px;
    cursor: pointer;
`

const CardContainer = styled.div`
    margin: 0px;
    display: grid;
    grid-template-columns: repeat(5, 1fr); 
`

const StyledCard = styled(Card)`
    width: 254px;
    height: 300px;
    color: black;
    background-color: white;
    border-radius: 10px;
    border: solid 2px #5C5C60;
    margin-bottom: 40px;
    
    &:hover{
        box-shadow: 5px 5px 5px black;
        cursor: pointer;
    }

    .card-img-top {
        width: 250px;
        height: 150px;
        object-fit: cover;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .card-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
`

const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;