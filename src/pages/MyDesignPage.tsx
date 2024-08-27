import styled from "styled-components"

import DesignOutlineCard from "../components/specific/myDesign/DesignOutlineCard"
import { useState } from "react"

import { designList as data } from "../testdata/dummyDesign"

//TODO: State 위치 조정, 채우기

const MyDesignPage = () => {
    return (
        <>
            <PageWrapper>
                <DesignList />
                <CurrentStateContainer>
                {/*채울 내용*/}
                </CurrentStateContainer>
            </PageWrapper>
        </>
    )
}

const DesignList = () => {
    const [isPublished, setIsPublished] = useState(false);

    const handleFilterClick = (filterType: boolean) => {
        setIsPublished(filterType);
    };

    return (
        <>
            <FilterTextContainer>
                <FilterText
                    isActive={!isPublished}
                    onClick={() => handleFilterClick(false)}
                >
                    구매한 도면
                </FilterText>
                <FilterText
                    isActive={isPublished}
                    onClick={() => handleFilterClick(true)}
                >
                    판매중 도면
                </FilterText>
            </FilterTextContainer>
            {
                data.map((e, i) => {
                    return(
                        <DesignOutlineCard 
                        designData={{...e,'published': isPublished}}/>
                    )            
                })
            }
            
        </>
    )
}

export default MyDesignPage;

const PageWrapper = styled.div`
    margin: 50px 100px 0px;
    height: auto;
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

const CurrentStateContainer = styled.div`
    width: 20vw;
    min-width: 320px;
    aspect-ratio: 1/2;
    background-color: #5C5C60;
    border-radius: 10px;

    position: absolute;
    top: 100px;
    right: 100px;
`