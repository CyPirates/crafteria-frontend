import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

import { Design } from "../types/DesignType";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/axiosWithUrl";
import { useCart } from "../hooks/useCart";
import initiatePortOnePayment from "../utils/requestPayment";
import getStlModelVolume from "../utils/getStlModelVolume";
import BuyDesignPopUp from "../components/specific/designDetail/BuyDesignPopUp";

const DesignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [design, setDesign] = useState<Design | undefined>(undefined);
    const [modelVolume, setModelVolume] = useState<number>(0);
    const categoryKeys = {
        INTERIOR_DECORATION: "인테리어 & 장식용",
        PLANTER_GARDENING: "플랜테리어 / 정원용",
        STORAGE_ORGANIZATION: "보관 & 정리용",
        GIFTS_SOUVENIRS: "선물 & 기념품",
        TOOLS_FUNCTIONALITY: "도구 & 기능성",
        HOBBIES_PLAY: "취미 & 놀이",
        COMMERCIAL_BRANDING: "상업/브랜딩",
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            try {
                const response = await newAxios.get(`/api/v1/model/user/view/${id}`, {
                    headers: headers,
                });
                let data = response.data.data;
                console.log(data);
                setDesign(data);
                setModelVolume(await getStlModelVolume(data.modelFileUrl));
                console.log(modelVolume);
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

    const { author, name, description, price, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl, purchaseAvailability, category, downloadable } = design;
    const handleButtonClick = async () => {
        if (!purchaseAvailability) {
            if (!downloadable) {
                navigate("/print-order");
                return;
            }
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
            //handlePurchase();
            setIsOpen(true);
        }
    };

    const handlePurchase = async () => {
        try {
            const response = await newAxios.post(
                `/api/v1/model/user/purchase/${id}`,
                { modelId: id, couponId: null },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            console.log(response.data.status);
            if (response.data.status === 400) {
                alert("purchase" + response.data.message);
            } else {
                const { paymentId, id } = response.data.data;
                console.log(response.data.data);
                if (paymentId && id) {
                    const isPaymentSuccess = await initiatePortOnePayment(paymentId, id, (+price * 1.1).toString(), "modelId");
                    if (isPaymentSuccess) {
                        navigate("/my-design");
                    }
                }
            }
        } catch (e: any) {
            if (e.response.status === 401) {
                const isConfirm = window.confirm("로그인이 필요한 서비스 입니다.");
                if (isConfirm) {
                    navigate("/login");
                }
            }
        }
    };

    return (
        <PageWrapper>
            {isOpen && <BuyDesignPopUp handleOnClick={setIsOpen} name={name} price={+price} filePath={modelFileUrl} id={id} />}
            <OutlineContainer>
                <StlRenderContainer filePath={modelFileUrl} width="500px" height="500px" />
                <OutlineContentContainer>
                    <Title>{name}</Title>
                    <ArtistName>작가: {author.name}</ArtistName>
                    <Divider />
                    <DetailContainer>
                        <Detail>
                            <DetailTitle>가격</DetailTitle>
                            <DetailContent>{+price * 1.1}원(VAT포함)</DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>판매량</DetailTitle>
                            <DetailContent>{downloadCount}</DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>모델 크기</DetailTitle>
                            <DetailContent>
                                {modelVolume} mm3 ({widthSize} x {lengthSize} x {heightSize} mm)
                            </DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>카테고리</DetailTitle>
                            <DetailContent>{categoryKeys[category]}</DetailContent>
                        </Detail>
                        <Detail>
                            <DetailTitle>다운로드</DetailTitle>
                            <DetailContent>{downloadable ? "가능" : "불가능"}</DetailContent>
                        </Detail>
                    </DetailContainer>
                    <ButtonContainer>
                        <Button onClick={handleButtonClick}>{purchaseAvailability ? "구매하기" : downloadable ? "다운로드" : "프린트하기"}</Button>
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
