import styled from "styled-components";

import Carousel from "../components/specific/home/Carousel";
import WholeDesignCardContainer from "../components/common/WholeDesignCardContainer";
import PortOne from "@portone/browser-sdk/v2";

const HomePage = () => {
    return (
        <>
            <PageWrapper>
                <Carousel />
                {/* <CurrentVisitContainer></CurrentVisitContainer> */}
                <WholeDesignCardContainer />
            </PageWrapper>
        </>
    );
};

export default HomePage;

const PageWrapper = styled.div``;

const CurrentVisitContainer = styled.div`
    width: 100%;
    height: 200px;
    background-color: #d9d9d9;
    margin-top: 50px;
`;
