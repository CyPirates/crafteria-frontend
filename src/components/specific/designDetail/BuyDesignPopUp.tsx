import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import StlRenderContainer from "./StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";
import CouponBoxPage from "../../../pages/CouponBoxPage";
import { Coupon } from "../../../types/CouponType";
import initiatePortOnePayment from "../../../utils/requestPayment";

type BuyDesignPopUpProps = {
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
    price: number;
    filePath: string;
    id: any;
};

const BuyDesignPopUp: React.FC<BuyDesignPopUpProps> = ({ handleOnClick, name, price, filePath, id }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [vat, setVat] = useState<number>(Math.ceil(+price * 0.1));
    const [discontedPrice, setDiscontedPrice] = useState<number>(price);
    const [finalPrice, setFinalPrice] = useState<number>(+price);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        if (!coupon) return;
        const discountedPrice = price - Math.min(Math.floor(+price * (+coupon.discountRate / 100)), +coupon.maxDiscountAmount);
        const discounedVAT = Math.ceil(discountedPrice * 0.1);
        setVat(discounedVAT);
        setFinalPrice(discountedPrice + discounedVAT);
        setDiscontedPrice(discountedPrice);
    }, [coupon]);

    const handleSubmit = async (e: any) => {
        const data = { modelId: id, couponId: coupon ? coupon.id : null };
        console.log(data);
        try {
            const response = await newAxios.post(`/api/v1/model/user/purchase/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            console.log(response.data.status);
            if (response.data.status === 400) {
                alert("purchase" + response.data.message);
            } else {
                const { paymentId, id } = response.data.data;
                console.log(response.data.data);
                if (paymentId && id) {
                    const isPaymentSuccess = await initiatePortOnePayment(paymentId, id, finalPrice.toString(), "modelId");
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
        <>
            {isOpen && (
                <CouponOverlay onClick={() => setIsOpen(false)}>
                    <CouponModalContainer onClick={(e) => e.stopPropagation()}>
                        <CouponBoxPage isCouponUseMode={true} couponType="MODEL_PURCHASE" handleCouponSelect={setCoupon} price={price} setIsOpen={setIsOpen} />
                    </CouponModalContainer>
                </CouponOverlay>
            )}
            <Overlay onClick={() => handleOnClick(false)}>
                <PopUpContainer onClick={(e) => e.stopPropagation()}>
                    <Content>
                        <h2>결제 정보</h2>
                        <UnderLine />
                        <DesignInfoContainer>
                            <StlRenderContainer filePath={filePath} width="200px" height="200px" />
                            <InfoList>
                                <InfoRow>
                                    <InfoLabel>상품명</InfoLabel>
                                    <InfoValue>{name}</InfoValue>
                                </InfoRow>
                                <InfoRow>
                                    <InfoLabel>상품 가격</InfoLabel>
                                    <InfoValue>
                                        <div style={{ textDecoration: coupon ? "line-through" : "none", color: coupon ? "#858585" : "black" }}>{price} 원</div>
                                        {coupon && <div style={{ color: "red" }}>{discontedPrice} 원</div>}
                                    </InfoValue>
                                </InfoRow>
                                <InfoRow>
                                    <InfoLabel>VAT</InfoLabel>
                                    <InfoValue>
                                        <div>{vat} 원</div>
                                    </InfoValue>
                                </InfoRow>
                                <InfoRow>
                                    <InfoLabel>총 가격</InfoLabel>
                                    <InfoValue>
                                        <div>{finalPrice} 원</div>
                                    </InfoValue>
                                </InfoRow>
                                {coupon && (
                                    <InfoRow>
                                        <InfoLabel>쿠폰</InfoLabel>
                                        <InfoValue>{coupon.name}</InfoValue>
                                    </InfoRow>
                                )}
                                <InfoRow>
                                    <Button onClick={() => setIsOpen(!isOpen)}>쿠폰 사용</Button>
                                    <Button onClick={handleSubmit}>결제하기</Button>
                                </InfoRow>
                            </InfoList>
                        </DesignInfoContainer>
                        <UnderLine />
                    </Content>
                </PopUpContainer>
            </Overlay>
        </>
    );
};
export default BuyDesignPopUp;

const slideUp = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-end; // 하단에서 팝업이 올라오도록 설정
    z-index: 999; // 팝업이 다른 요소들 위에 표시되도록 설정
    color: black;
`;

const CouponOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999; // BuyDesignPopUp보다 높게
`;

const CouponModalContainer = styled.div`
    background-color: white;
    width: 520px;
    height: 860px;
`;

const PopUpContainer = styled.div`
    width: 1300px;
    height: 600px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    animation: ${slideUp} 0.3s ease-out forwards;
`;

const UnderLine = styled.div`
    width: 100%;
    border-bottom: 1px solid lightgray;
    margin: 16px 0;
`;
const Content = styled.div`
    padding: 50px;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
`;

const DesignInfoContainer = styled.div`
    display: flex;
    gap: 30px;
`;

const InfoList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
`;

const InfoRow = styled.div`
    display: flex;
    gap: 12px;
`;

const InfoLabel = styled.div`
    width: 80px;
    font-weight: bold;
`;

const InfoValue = styled.div`
    display: flex;
    gap: 12px;
`;

const Button = styled.div`
    width: 200px;
    height: 44px;
    margin-top: 40px;
    background-color: #000000;
    color: white;
    border-radius: 8px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #2e2e2e;
    }
`;
