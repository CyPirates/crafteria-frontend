import styled from "styled-components";
import { Order } from "../../../types/OrderType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { useNavigate } from "react-router-dom";

type OrderCardProps = {
    data: Order;
};

const OrderCard = ({ data }: OrderCardProps) => {
    const navigate = useNavigate();
    const { modelFileUrls, widthSize, lengthSize, heightSize, magnification, quantity, purchasePrice, manufacturerId, status } = data;
    const convertStatusToString = (status: string) => {
        switch (status) {
            case "ORDERED":
                return "출력 대기";
            case "IN_PRODUCTING":
                return "출력 중";
            case "DELIVERED":
                return "배송 중";
        }
    };
    let convertedStatus = convertStatusToString(status);
    return (
        <>
            <CardWrapper>
                <Status>{convertedStatus}</Status>
                <InfoContainer>
                    <StlRenderContainer filePath={modelFileUrls[0]} width="100px" height="100px" clickDisabled={true} />
                    <TextContainer>
                        <Text style={{ whiteSpace: "pre-line" }}>
                            크기: {widthSize}mm x {lengthSize}mm x {heightSize}mm{"\n"}
                            {magnification}배 x {quantity}개
                        </Text>
                        <Text>총 {purchasePrice}원</Text>
                    </TextContainer>
                </InfoContainer>
                {status === "DELIVERED" ? <button onClick={() => navigate(`/createReview/${manufacturerId}`)}>리뷰쓰기</button> : null}
            </CardWrapper>
        </>
    );
};

export default OrderCard;

const CardWrapper = styled.div`
    width: 700px;
    height: 170px;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;

    position: relative;
`;

const InfoContainer = styled.div`
    height: 100%;

    display: flex;
    gap: 10px;
    justify-content: start;
`;

const Status = styled.div`
    font-size: 23px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;

    justify-content: space-between;
`;

const Text = styled.div`
    font-size: 15px;
`;
