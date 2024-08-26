import styled from "styled-components";

import Carousel from "../components/specific/home/Carousel";
import WholeDesignCardContainer from "../components/common/WholeDesignCardContainer";

const HomePage = () => {

    return (
        <>
            <Carousel />
            <CurrentVisitContainer></CurrentVisitContainer>
            <WholeDesignCardContainer/>
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
