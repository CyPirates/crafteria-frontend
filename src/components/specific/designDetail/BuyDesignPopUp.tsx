import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

type BuyDesignPopUpProps = {
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
};

const BuyDesignPopUp: React.FC<BuyDesignPopUpProps> = ({ handleOnClick }) => {
    useEffect(() => {
        // 팝업이 열릴 때 스크롤을 막기 위해 body에 overflow hidden 설정
        document.body.style.overflow = "hidden";
        return () => {
            // 팝업이 닫힐 때 스크롤을 다시 활성화
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <Overlay onClick={() => handleOnClick(false)}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <Content>
                    <h2>구매하기</h2>
                    <p>디자인을 구매하시겠습니까?</p>
                    {/* 추가적인 콘텐츠와 버튼들 */}
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
    height: 500px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    animation: ${slideUp} 0.3s ease-out forwards;
`;

const Content = styled.div`
    padding: 20px;
    text-align: center;
`;
