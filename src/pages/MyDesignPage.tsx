import styled from "styled-components"

import DesignOutlineCard from "../components/specific/myDesign/DesignOutlineCard"
import { useState } from "react"

const MyDesignPage = () => {
    return (
        <>
            <PageWrapper>
                <DesignList />
            </PageWrapper>
        </>
    )
}

const DesignList = () => {
    const [published, setPublished] = useState(false);

    const handleFilterClick = (filterType: boolean) => {
        setPublished(filterType);
    };

    return (
        <>
            <FilterTextContainer>
                <FilterText
                    isActive={!published}
                    onClick={() => handleFilterClick(false)}
                >
                    구매한 도면
                </FilterText>
                <FilterText
                    isActive={published}
                    onClick={() => handleFilterClick(true)}
                >
                    판매중 도면
                </FilterText>
            </FilterTextContainer>
            <DesignOutlineCard published={published} />
        </>
    )
}

export default MyDesignPage;

const PageWrapper = styled.div`
    margin: 50px 70px 0px;
`


const FilterTextContainer = styled.div`
    margin-bottom: 1vw;
    display: flex;
    flex-direction: row;
`

const FilterText = styled.div<{ isActive: boolean }>`
    font-size: 15px;
    margin-right: 20px;
    cursor: pointer;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#B3B3B3")};
`;