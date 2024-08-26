import styled from "styled-components";

import SummaryCard from "./SummaryCard";

//TODO: Filter 기능 추가, SummaryCard 받아온 데이터로 변경

const WholeDesignCardContainer = () => {
    return (
        <>
            <Container>
                <CategoryText>전체보기</CategoryText>
                <FilterTextContainer>
                    <FilterText>기본순</FilterText>
                    <FilterText>인기순</FilterText>
                    <FilterText>최신순</FilterText>
                </FilterTextContainer>
                <CardContainer>
                    <SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard />
                </CardContainer>
            </Container>
        </>
    )
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
    grid-template-columns: repeat(6, 1fr); 
    gap: 20px;
`