import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import StlRenderContainer from "./StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";

type BuyDesignPopUpProps = {
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPurchased: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
    price: string;
    filePath: string;
    id: any;
};

const BuyDesignPopUp: React.FC<BuyDesignPopUpProps> = ({ handleOnClick, setIsPurchased, name, price, filePath, id }) => {
    const navigate = useNavigate();
    const [paymentStatus, setPaymentStatus] = useState<any>({
        status: "IDLE",
    });
    useEffect(() => {
        // 팝업이 열릴 때 스크롤을 막기 위해 body에 overflow hidden 설정
        document.body.style.overflow = "hidden";
        return () => {
            // 팝업이 닫힐 때 스크롤을 다시 활성화
            document.body.style.overflow = "auto";
        };
    }, []);

    // const handlePurchase = async () => {
    //     const token = localStorage.getItem("accessToken");
    //     console.log(token);
    //     console.log(id);
    //     try {
    //         const response = await newAxios.post(`/api/v1/model/user/purchase/${id}`, null, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         console.log("data submitted successfully:", response.data);
    //         handleOnClick(false);
    //         setIsPurchased(true);
    //         navigate("/my-design");
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error submitting design data:", error);
    //         throw error;
    //     }
    // };

    function randomId() {
        return [...crypto.getRandomValues(new Uint32Array(2))].map((word) => word.toString(16).padStart(8, "0")).join("");
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setPaymentStatus({ status: "PENDING" });
        const paymentId = randomId();
        const payment = await PortOne.requestPayment({
            storeId: "store-fac07677-97a5-457e-a490-fa243d2d40d1",
            channelKey: "channel-key-cc38c030-f0b0-46b0-8c0d-78695dac8786",
            paymentId,
            orderName: name,
            totalAmount: +price * 1000,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customData: {
                item: id,
            },
            customer: {
                fullName: "이찬호",
                email: "qboooodp@naver.com",
                phoneNumber: "010-8152-1000",
            },
        });
        if (payment!.code !== undefined) {
            setPaymentStatus({
                status: "FAILED",
                message: payment!.message,
            });
            return;
        }
        const completeResponse = await fetch("/api/payment/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentId: payment!.paymentId,
            }),
        });
        if (completeResponse.ok) {
            const paymentComplete = await completeResponse.json();
            setPaymentStatus({
                status: paymentComplete.status,
            });
        } else {
            setPaymentStatus({
                status: "FAILED",
                message: await completeResponse.text(),
            });
        }
    };

    return (
        <Overlay onClick={() => handleOnClick(false)}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <Content>
                    <h2>상품 정보</h2>
                    <DesignInfoContainer>
                        <StlRenderContainer filePath={filePath} width="200px" height="200px" />
                        <ColumnContainer>
                            <BoldText>{name}</BoldText>
                            <BoldText>{price}원</BoldText>
                            <PurchaseButton onClick={handleSubmit}>결제하기</PurchaseButton>
                        </ColumnContainer>
                    </DesignInfoContainer>
                </Content>
            </PopUpContainer>
        </Overlay>
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

const PopUpContainer = styled.div`
    width: 1300px;
    height: 400px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    animation: ${slideUp} 0.3s ease-out forwards;
`;

const Content = styled.div`
    padding: 50px;
    text-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;

    border-bottom: 1px solid lightgray;
`;

const DesignInfoContainer = styled.div`
    display: flex;
    gap: 30px;
`;
const ColumnContainer = styled.div`
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    align-items: start;
`;
const BoldText = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const PurchaseButton = styled.div`
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
