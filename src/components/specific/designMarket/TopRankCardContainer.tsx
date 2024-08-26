import styled from "styled-components"
import SummaryCard from "../../common/SummaryCard";

//TODO: SummaryCard 받아온 데이터로 변경

type TopRankCardContainerProps = {
  category: string;
}

const TopRankCardContainer= ({category}: TopRankCardContainerProps) => {
  return (
    <>
      <Container>
        <CategoryText>BEST {category}</CategoryText>
        <CardContainer>
          <SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard />
        </CardContainer>
      </Container>
    </>
  )
}

export default TopRankCardContainer;

const Container = styled.div`
  margin: 3vw 4vw;
`

const CategoryText = styled.div`
  font-size: 30px;
  margin-bottom: 2vw;
`

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); 
  gap: 20px;
  
`;