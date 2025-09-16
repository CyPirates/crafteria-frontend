import styled from "styled-components";
import WholeDesignCardContainer from "../components/common/WholeDesignCardContainer";

const DesignMarket = () => {
    return (
        <PageWrapper>
            <WholeDesignCardContainer />
        </PageWrapper>
    );
};

export default DesignMarket;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
