import styled from "styled-components";
import { FetchedOrder } from "../../../types/OrderType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../../../utils/axiosWithUrl";

type OrderCardProps = {
    data: FetchedOrder;
};

const OrderCard = ({ data }: OrderCardProps) => {
    const { status, modelFileUrls, orderItems, purchasePrice, orderId } = data;
    const navigate = useNavigate();
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
    const handleCancel = async () => {
        const token = localStorage.getItem("accessToken");
        const response = await newAxios.post(`/api/v1/order/my/cancel/${orderId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data.data);
        window.location.reload();
    };
    let convertedStatus = convertStatusToString(data.status);
    return (
        <>
            <CardWrapper>
                <Status>{convertedStatus}</Status>
                <RowContainer>
                    <ColumnContainer>
                        {modelFileUrls.map((e, i) => {
                            return (
                                <ItemContainer>
                                    <StlRenderContainer filePath={e} width="100px" height="100px" clickDisabled={true} />
                                    <TextContainer>
                                        <Text style={{ whiteSpace: "pre-line" }}></Text>
                                        <Text>
                                            재료타입, 색상, {orderItems[i].magnification}배, {orderItems[i].quantity}개
                                        </Text>
                                    </TextContainer>
                                </ItemContainer>
                            );
                        })}

                        <TextContainer>
                            <Text>총 {purchasePrice}원</Text>
                        </TextContainer>
                    </ColumnContainer>
                    <ButtonContainer>
                        {status === "ORDERED" ? <ReviewButton onClick={handleCancel}>주문취소</ReviewButton> : null}
                        {status === "DELIVERED" ? <ReviewButton onClick={() => navigate(`/createReview/${data.manufacturerId}`)}>리뷰쓰기</ReviewButton> : null}
                    </ButtonContainer>
                </RowContainer>
            </CardWrapper>
        </>
    );
};

export default OrderCard;

const CardWrapper = styled.div`
    width: 700px;
    height: auto;
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;

    position: relative;
`;

const RowContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: stretch;
    //justify-content: start;
`;

const ColumnContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
`;

const ItemContainer = styled.div`
    width: 500px;
    height: 120px;
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
`;

const ButtonContainer = styled.div`
    position: absolute;
    right: 20px;
    top: 20px;

    display: flex;
    gap: 20px;
    flex: 1;
    align-items: center;
    justify-content: center;
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
    font-size: 16px;
`;

const ReviewButton = styled.div`
    width: 100px;
    height: 32px;
    background-color: #000000;
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
