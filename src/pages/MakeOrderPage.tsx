import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DesignProps } from "../types/DesignType";
import SelectDesignPopUp from "../components/specific/MakeOrder/SelectDesignPopUp";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import getStlModelSize from "../utils/getStlModelSize";
import useInput from "../hooks/useInput";
import OrderInfoContainer from "../components/specific/MakeOrder/OrderInfoContainer";
import { OrderData } from "../types/OrderType";

type Size = {
    width: number;
    height: number;
    depth: number;
};

const MakeOrderPage = () => {
    const [selectedDesign, setSelectedDesign] = useState<DesignProps>();
    const [isPop, setIsPop] = useState<boolean>(false);
    const [size, setSize] = useState<Size | undefined>(undefined);
    const { value: times, onChange: handleTimesChange } = useInput("1"); // 도면 배율
    const [orderData, setOrderData] = useState<OrderData>({
        manufactureId: "",
        widthSize: "",
        lengthSize: "",
        heightSize: "",
        magnification: "",
        quantity: "",
        deliveryAddress: "",
    });

    useEffect(() => {
        const fetchSize = async () => {
            if (selectedDesign && selectedDesign.modelFileUrl) {
                try {
                    const modelSize = await getStlModelSize(selectedDesign.modelFileUrl);
                    setSize(modelSize);
                } catch (error) {
                    console.error("Failed to fetch model size:", error);
                }
            }
        };

        fetchSize();
    }, [selectedDesign]);

    return (
        <>
            <PageWrapper>
                <DesignArea>
                    <Title>주문하기</Title>
                    <Step>
                        <StepName>1.도면 선택</StepName>
                        {selectedDesign ? (
                            <>
                                <StlRenderContainer filePath={selectedDesign.modelFileUrl} width="300px" height="300px" />
                                <div>
                                    크기: {size?.width}mm x {size?.height}mm x {size?.depth}mm
                                </div>
                                <div>
                                    배율: <Input value={times} onChange={handleTimesChange} />배
                                </div>
                            </>
                        ) : (
                            <EmptyDesign>도면을 선택해 주세요</EmptyDesign>
                        )}
                        <SelectDesignButton onClick={() => setIsPop(true)}>구매한 도면에서 선택</SelectDesignButton>
                        {isPop ? <SelectDesignPopUp handleOnClick={setIsPop} setSelectedDesign={setSelectedDesign} /> : null}
                    </Step>
                    <Step>
                        <StepName>3. 제조사 선택</StepName>
                    </Step>
                    <button onClick={() => console.log(times)}>asdf</button>
                </DesignArea>
                <OrderInfoContainer setOrderData={setOrderData} />
            </PageWrapper>
        </>
    );
};

export default MakeOrderPage;

const PageWrapper = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
`;

const DesignArea = styled.div`
    flex: 1;
    padding-right: 20px;
`;

const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 3px solid #707074;
`;

const Step = styled.div`
    margin-top: 20px;

    display: flex;
    flex-direction: column;
    gap: 20px;
    border-bottom: 3px solid #707074;
`;

const StepName = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const SelectDesignButton = styled.div`
    width: 200px;
    height: 30px;
    background-color: #008ecc;
    border-radius: 5px;
    margin-bottom: 10px;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #4682b4;
    }
`;

const EmptyDesign = styled.div`
    width: 300px;
    height: 300px;
    background-color: #e0e0e0;
    color: black;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const Input = styled.input`
    width: 40px;
`;
