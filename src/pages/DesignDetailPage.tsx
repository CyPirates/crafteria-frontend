import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

import { Design } from "../types/DesignType";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import { useEffect, useState } from "react";
import BuyDesignPopUp from "../components/specific/designDetail/BuyDesignPopUp";
import { newAxios } from "../utils/axiosWithUrl";
import { useCart } from "../hooks/useCart";

const DesignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [design, setDesign] = useState<Design | undefined>(undefined);
    const [isPop, setIsPop] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await newAxios.get(`/api/v1/model/user/view/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                let data = response.data.data;
                console.log(data);
                setDesign(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const handleDownload = async (url: string, filename: string) => {
        const file = await fetch(url);
        const blob = await file.blob();
        const objectUrl = URL.createObjectURL(blob);
        const newName = filename + ".stl";
        const link = document.createElement("a");
        link.download = newName;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (!design) {
        return <div>Loading...</div>; // 디자인이 로드되기 전 로딩 메시지 표시
    }

    const { author, name, description, price, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl, purchased } = design;
    const handleButtonClick = async () => {
        if (purchased) {
            handleDownload(modelFileUrl, name);
            return;
        }
        if (price == "0") {
            try {
                const response = await newAxios.post(`/api/v1/model/user/purchase/${id}`, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                if (response.data.status === 200) {
                    navigate("/my-design");
                }
                if (response.data.status === 400) {
                    alert(response.data.message);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            setIsPop(true);
        }
    };

    return (
        <PageWrapper>
            <OutlineContainer>
                <StlRenderContainer filePath={modelFileUrl} width="500px" height="500px" />
                <OutlineContentContainer>
                    <Title>{name}</Title>
                    <ArtistName>작가: {author.name}</ArtistName>
                    <Divider />
                    <DetailContainer>
                        <Detail>
                            <DetailTitle>가격</DetailTitle>
                            <DetailContent>{price}원</DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>판매량</DetailTitle>
                            <DetailContent>{downloadCount}</DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>모델 크기</DetailTitle>
                            <DetailContent>
                                {widthSize} x {lengthSize} x {heightSize} mm
                            </DetailContent>
                        </Detail>
                    </DetailContainer>
                    <ButtonContainer>
                        <Button onClick={handleButtonClick}>{purchased ? "다운로드" : "구매하기"}</Button>
                        <Button onClick={() => addToCart(id!)}>장바구니 담기</Button>
                    </ButtonContainer>
                </OutlineContentContainer>
            </OutlineContainer>
            <Divider />
            <IntroductionTitle>소개말</IntroductionTitle>
            <Divider />
            <IntroductionContents>
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
            </IntroductionContents>
            {isPop ? <BuyDesignPopUp handleOnClick={setIsPop} name={name} price={price} filePath={modelFileUrl} id={id} /> : null}
        </PageWrapper>
    );
};

export default DesignDetailPage;

const PageWrapper = styled.div`
    margin-top: 20px;
`;

const OutlineContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    padding-bottom: 10px;
`;

const IntroductionTitle = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    margin-top: 20px;
`;

const IntroductionContents = styled.div`
    margin-top: 20px;
    font-size: 20px;
`;

const OutlineContentContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 40px;
`;

const ArtistName = styled.div`
    color: #9d9d9f;
    font-size: 15px;
`;

const Divider = styled.div`
    border-bottom: 1px solid #464649;
`;

const DetailContainer = styled.div`
    flex: 1;
`;

const Detail = styled.div`
    font-size: 20px;
    display: flex;
    margin-bottom: 5px;
`;

const DetailTitle = styled.div`
    width: 100px;
    font-weight: bold;
`;

const DetailContent = styled.div`
    flex: 1;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    //margin-top: 30px;
`;

const Button = styled.button`
    width: 248px;
    height: 40px;
    color: white;
    font-weight: 600;
    background-color: #000000;
    box-shadow: none;
    border: none;
    border-radius: 8px;

    cursor: pointer;
`;
