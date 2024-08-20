import styled from "styled-components";

import Carousel from "../components/specific/home/Carousel";
import SummaryCard from "../components/common/SummaryCard";

const HomePage: React.FC = () => {

    return (
        <>
            <Carousel />
            <CurrentVisitContainer></CurrentVisitContainer>
            <FilterTextContainer>
                <FilterText>기본순</FilterText>
                <FilterText>인기순</FilterText>
                <FilterText>최신순</FilterText>
            </FilterTextContainer>
            <CardContainer>
                <SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard /><SummaryCard />
            </CardContainer>
        </>
    )
}

export default HomePage;

const CurrentVisitContainer = styled.div`
    width: 100%;
    height: 200px;
    background-color: #D9D9D9;
    margin-top: 50px;
`
const FilterTextContainer = styled.div`
    margin: 30px 80px 30px;
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
    margin: 0px 80px;
    display: grid;
    grid-template-columns: repeat(6, 1fr); 
    gap: 20px;
`