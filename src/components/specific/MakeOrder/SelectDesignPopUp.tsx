import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { DesignProps } from "../../../types/DesignType";
import getStlModelSize from "../../../utils/getStlModelSize";

type BuyDesignPopUpProps = {
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
    setModelFileUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type DesignLayoutProps = {
    data: DesignProps;
    handleSelect: (data: DesignProps) => void;
};

type Size = {
    width: number;
    height: number;
    depth: number;
};

const SelectDesignPopUp = ({ handleOnClick, setModelFileUrl: setSelectedDesign }: BuyDesignPopUpProps) => {
    const [purchasedDesigns, setPurchasedDesigns] = useState<DesignProps[]>([]);
    useEffect(() => {
        // 팝업이 열릴 때 스크롤을 막기 위해 body에 overflow hidden 설정
        document.body.style.overflow = "hidden";
        return () => {
            // 팝업이 닫힐 때 스크롤을 다시 활성화
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await newAxios.get("/api/v1/model/user/list/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data.data);
                setPurchasedDesigns(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handleSelect = (data: DesignProps) => {
        setSelectedDesign(data.modelFileUrl);
        handleOnClick(false);
    };
    return (
        <Overlay onClick={() => handleOnClick(false)}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <Title>구매한 도면</Title>
                <DesignContainer>
                    {purchasedDesigns.map((design, i) => {
                        return <DesignLayout data={design} handleSelect={handleSelect} />;
                    })}
                </DesignContainer>
            </PopUpContainer>
        </Overlay>
    );
};

const DesignLayout = ({ data, handleSelect }: DesignLayoutProps) => {
    const { name, modelFileUrl } = data;
    const [size, setSize] = useState<Size | undefined>(undefined);
    const fetchSize = async () => {
        if (modelFileUrl) {
            try {
                const modelSize = await getStlModelSize(modelFileUrl);
                setSize(modelSize);
            } catch (error) {
                console.error("Failed to fetch model size:", error);
            }
        }
    };
    fetchSize();
    return (
        <DesignLayoutContainer>
            <StlRenderContainer filePath={modelFileUrl} width="100px" height="100px" clickDisabled={true} />
            <DesignInfo>
                <InfoText>이름: {name}</InfoText>
                <InfoText>
                    크기: {size?.width} x {size?.height} x {size?.depth} (mm){" "}
                </InfoText>
                <SelectButton onClick={() => handleSelect(data)}>선택</SelectButton>
            </DesignInfo>
        </DesignLayoutContainer>
    );
};
export default SelectDesignPopUp;

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
    width: 600px;
    height: 700px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    animation: ${slideUp} 0.3s ease-out forwards;

    display: flex;
    justify-content: center;

    overflow-y: auto;
`;

const Title = styled.div`
    width: 500px;
    height: 60px;
    padding: 10px;
    text-align: center;
    background-color: white;
    color: black;
    font-size: 20px;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;

    position: fixed;
    top: 0;
    z-index: 1200;

    border-bottom: 1px solid #707074;
`;

const DesignContainer = styled.div`
    margin-top: 61px;
`;

const DesignLayoutContainer = styled.div`
    width: 500px;
    margin: 20px;
    height: 120px;
    border-bottom: 1px solid gray;

    display: flex;
    align-items: center;
`;

const DesignInfo = styled.div`
    margin-left: 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    position: relative;
    flex: 1;
    height: 100%;
`;
const InfoText = styled.div`
    color: black;
    font-size: 20px;
    font-weight: 500;
`;
const SelectButton = styled.div`
    width: 60px;
    height: 30px;
    background-color: #000000;
    color: white;
    font-size: 15px;
    border-radius: 5px;
    margin-bottom: 10px;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    bottom: 0;
    right: 0;

    &:hover {
        background-color: #4682b4;
    }
`;
