import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { newAxios } from "../utils/axiosWithUrl";
import { Design } from "../types/DesignType";
import DesignOutlineCard from "../components/specific/myDesign/DesignOutlineCard";
import { ErrorType } from "../types/ErrorType";
import useLoginNavigation from "../hooks/useLoginNavigation";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";
import { Typography } from "../components/common/Typography";

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
            <Typography variant="heading.h6" color="text.heading">
                내 도면
            </Typography>
            <HeaderContainer>
                <FilterButton isActive={!isPublished} onClick={() => handleFilterClick(false)}>
                    <Typography variant="body.small_b">구매한 도면</Typography>
                </FilterButton>
                <FilterButton isActive={isPublished} onClick={() => handleFilterClick(true)}>
                    <Typography variant="body.small_b">업로드한 도면</Typography>
                </FilterButton>
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
    padding-top: 32px;
    padding-left: 80px;
    height: auto;
    display: flex;
`;

const DesignListContainer = styled.div``;

const HeaderContainer = styled.div`
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

const FilterButton = styled.div<{ isActive: boolean }>`
    height: 40px;
    padding: 0 20px;
    color: ${({ theme, isActive }) => (isActive ? theme.primaryColor.blue1 : theme.grayScale[300])};
    border: 1.4px solid ${({ theme, isActive }) => (isActive ? theme.primaryColor.blue1 : theme.grayScale[200])};
    border-radius: 8px;
    background-color: ${({ theme, isActive }) => (isActive ? theme.primaryColor.blue3 : theme.grayScale[0])};

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
`;

const CardContainer = styled.div`
    width: 1280px;
`;
