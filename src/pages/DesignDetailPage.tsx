import { useLocation } from "react-router-dom";
import styled from "styled-components";

import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import DesignInfo from "../components/specific/designDetail/DesignInfo";
import { useState } from "react";
import BuyDesignPopUp from "../components/specific/designDetail/BuyDesignPopUp";

const DesignDetailPage = () => {
    const location = useLocation();
    const {
        publishedDay,
        name,
        size,
        price,
        volume,
        id,
        filePath,
        fileType,
        artist,
        introduction,
    } = location.state;

    const [isPop, setIsPop] = useState<boolean>(false);

    return (
        <PageWrapper>
            <DesignContainer>
                <StlRenderContainer filePath={filePath} />
                <DesignInfo
                    name={name}
                    artist={artist}
                    publishedDay={publishedDay}
                    price={price}
                    volume={volume}
                    size={size}
                    fileType={fileType}
                    id={id}
                    handleOnClick={setIsPop}
                />
            </DesignContainer>
            <IntroductionTitle>소개말</IntroductionTitle>
            <IntroductionContents>{introduction}</IntroductionContents>
            {isPop ? <BuyDesignPopUp handleOnClick={setIsPop} /> : null}
        </PageWrapper>
    );
};

export default DesignDetailPage;

const PageWrapper = styled.div`
    margin-top: 20px;
`;

const DesignContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding-bottom: 10px;
    border-bottom: 5px solid #464649;
    margin-bottom: 30px;
`;

const IntroductionContainer = styled.div``;
const IntroductionTitle = styled.div`
    width: 100%;
    font-size: 30px;
    color: white;
    font-weight: bold;
    border-bottom: 5px solid #464649;
`;

const IntroductionContents = styled.div`
    margin-top: 20px;
    font-size: 20px;
    color: white;
`;
