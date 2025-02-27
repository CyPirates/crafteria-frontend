import { useParams } from "react-router-dom";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

import { DesignProps } from "../types/DesignType";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import DesignInfo from "../components/specific/designDetail/DesignInfo";
import { useEffect, useState } from "react";
import BuyDesignPopUp from "../components/specific/designDetail/BuyDesignPopUp";
import { newAxios } from "../utils/axiosWithUrl";

const DesignDetailPage = () => {
    const [design, setDesign] = useState<DesignProps | undefined>(undefined);
    const [isPop, setIsPop] = useState<boolean>(false);
    const [isPurchased, setIsPurchased] = useState<boolean>(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await newAxios.get(`/api/v1/model/user/view/${id}`);
                let data = response.data.data;
                console.log(data);
                setDesign(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    if (!design) {
        return <div>Loading...</div>; // 디자인이 로드되기 전 로딩 메시지 표시
    }

    const { author, name, description, price, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl } = design;
    const size = { width: widthSize, length: lengthSize, height: heightSize };

    return (
        <PageWrapper>
            <DesignContainer>
                <StlRenderContainer filePath={modelFileUrl} width="500px" height="500px" />
                <DesignInfo name={name} artist={author.name} price={price} volume={downloadCount} size={size} id={id} handleOnClick={setIsPop} isPurchased={isPurchased} />
            </DesignContainer>
            <IntroductionTitle>소개말</IntroductionTitle>
            <IntroductionContents>
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
            </IntroductionContents>
            {isPop ? <BuyDesignPopUp handleOnClick={setIsPop} setIsPurchased={setIsPurchased} name={name} price={price} filePath={modelFileUrl} id={id} /> : null}
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
    border-bottom: 1px solid #464649;
    margin-bottom: 30px;
`;

const IntroductionTitle = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #464649;
`;

const IntroductionContents = styled.div`
    margin-top: 20px;
    font-size: 20px;
`;
