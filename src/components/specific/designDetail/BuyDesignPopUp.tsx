import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import StlRenderContainer from "./StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";

type BuyDesignPopUpProps = {
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPurchased: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
    price: string;
    filePath: string;
    id: any;
};

const BuyDesignPopUp: React.FC<BuyDesignPopUpProps> = ({ handleOnClick, setIsPurchased, name, price, filePath, id }) => {
    useEffect(() => {
        // 팝업이 열릴 때 스크롤을 막기 위해 body에 overflow hidden 설정
        document.body.style.overflow = "hidden";
        return () => {
            // 팝업이 닫힐 때 스크롤을 다시 활성화
            document.body.style.overflow = "auto";
        };
    }, []);

    const handlePurchase = async () => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        console.log(id);
        try {
            const response = await newAxios.post(`/api/v1/model/user/purchase/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Design data submitted successfully:", response.data);
            handleOnClick(false);
            setIsPurchased(true);
            return response.data;
        } catch (error) {
            console.error("Error submitting design data:", error);
            throw error;
        }
    };

    return (
        <Overlay onClick={() => handleOnClick(false)}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <Content>
                    <h2>상품 정보</h2>
                    <DesignInfoContainer>
                        <StlRenderContainer filePath={filePath} width="200px" height="200px" />
                        <ColumnTextContainer>
                            <BoldText>도면명: {name}</BoldText>
                            <BoldText>가격: {price}원</BoldText>
                        </ColumnTextContainer>
                    </DesignInfoContainer>
                </Content>
                <PriceContainer>
                    <BoldText>총 가격: {price}원</BoldText>
                    <PurchaseButton onClick={handlePurchase}>결제하기</PurchaseButton>
                </PriceContainer>
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
    height: 700px;
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
const ColumnTextContainer = styled.div`
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    align-items: start;
`;
const BoldText = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const PriceContainer = styled.div`
    margin: 30px 45px;
`;

const PurchaseButton = styled.div`
    width: 200px;
    height: 50px;
    margin-top: 20px;
    background-color: #008ecc;
    color: white;
    border-radius: 5px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #4682b4;
    }
`;