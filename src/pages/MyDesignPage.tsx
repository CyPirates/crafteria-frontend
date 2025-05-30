import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { newAxios } from "../utils/axiosWithUrl";
import { Design } from "../types/DesignType";
import DesignOutlineCard from "../components/specific/myDesign/DesignOutlineCard";
import { ErrorType } from "../types/ErrorType";
import useLoginNavigation from "../hooks/useLoginNavigation";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";

const MyDesignPage = () => {
    return (
        <PageWrapper>
            <DesignListContainer>
                <DesignList />
            </DesignListContainer>
            {/* <CurrentStateContainer></CurrentStateContainer> */}
        </PageWrapper>
    );
};

const DesignList = () => {
    const { handleAuthError } = useAuthErrorHandler();

    const [purchasedDesigns, setPurchasedDesigns] = useState<Design[]>([]);
    const [uploadDesigns, setUploadDesigns] = useState<Design[]>([]);
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await newAxios.get("/api/v1/model/user/list/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPurchasedDesigns(response.data.data);
            } catch (error) {
                handleAuthError(error);
            }
            try {
                const token = localStorage.getItem("accessToken");
                const response = await newAxios.get("/api/v1/model/author/list/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUploadDesigns(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleFilterClick = (filterType: boolean) => {
        setIsPublished(filterType);
    };

    return (
        <>
            <Title>내 도면</Title>
            <HeaderContainer>
                <FilterText isActive={!isPublished} onClick={() => handleFilterClick(false)}>
                    구매한 도면
                </FilterText>
                <FilterText isActive={isPublished} onClick={() => handleFilterClick(true)}>
                    판매중 도면
                </FilterText>
            </HeaderContainer>
            <CardContainer>
                {isPublished ? (
                    uploadDesigns.length != 0 ? (
                        uploadDesigns.map((design) => <DesignOutlineCard key={design.id} designData={design} published={isPublished} />)
                    ) : (
                        <div>판매 중인 도면이 없습니다</div>
                    )
                ) : purchasedDesigns.length != 0 ? (
                    purchasedDesigns.map((design) => <DesignOutlineCard key={design.id} designData={design} published={isPublished} />)
                ) : (
                    <div>구매한 도면이 없습니다</div>
                )}
            </CardContainer>
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

const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
    margin-bottom: 12px;
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

const CardContainer = styled.div`
    width: 700px;
`;
