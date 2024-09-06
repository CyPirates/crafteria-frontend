import styled from "styled-components";

import DesignOutlineCard from "../components/specific/myDesign/DesignOutlineCard";
import { useState } from "react";

import { designList as data } from "../testdata/dummyDesign";

//TODO: State 위치 조정, 채우기

const MyDesignPage = () => {
    return (
        <>
            <PageWrapper>
                <DesignListContainer>
                    <DesignList />
                </DesignListContainer>
                <CurrentStateContainer>{/*채울 내용*/}</CurrentStateContainer>
            </PageWrapper>
        </>
    );
};

const DesignList = () => {
    const [isPublished, setIsPublished] = useState(false);

    const handleFilterClick = (filterType: boolean) => {
        setIsPublished(filterType);
    };

    return (
        <>
            <HeaderContainer>
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
            </HeaderContainer>
            {data.map((e, i) => {
                return (
                    <DesignOutlineCard
                        designData={{ ...e, published: isPublished }}
                    />
                );
            })}
        </>
    );
};

export default MyDesignPage;

const PageWrapper = styled.div`
    margin-top: 50px;
    height: auto;

    display: flex;
    flex-direction: row;
    gap: 40px;
`;

const DesignListContainer = styled.div``;

const HeaderContainer = styled.div`
    margin-bottom: 1vw;
    display: flex;
    flex-direction: row;
`;

const FilterText = styled.div<{ isActive: boolean }>`
    font-size: 15px;
    margin-right: 20px;
    cursor: pointer;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#B3B3B3")};
`;

const CurrentStateContainer = styled.div`
    width: 500px;
    height: 1000px;
    background-color: #5c5c60;
    border-radius: 10px;
`;
