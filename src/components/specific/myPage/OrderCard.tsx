import styled from "styled-components";
import { FetchedOrder } from "../../../types/OrderType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useEffect, useState } from "react";
import convertMaterialName from "../../../utils/convertMaterialName";

type OrderCardProps = {
    data: FetchedOrder;
};

type ModelOrder = {
    modelFileUrl: string;
    magnification: number;
    quantity: number;
    materialType: string;
    color: string;
};

const OrderCard = ({ data }: OrderCardProps) => {
    const { status, modelFileUrls, orderItems, purchasePrice, orderId, orderDate, delivery } = data;
    const [modelData, setModelData] = useState<ModelOrder[]>([]);
    const navigate = useNavigate();
    const statusMap = {
        PAID: "출력 대기",
        IN_PRODUCTING: "출력 중",
        PRODUCTED: "출력 완료",
        DELIVERING: "배송 중",
        DELIVERED: "배송 완료",
        CANCELED: "주문 취소",
    };

    const openDeliveryTracking = () => {
        const width = 520;
        const height = 860;
        const url = `/track?courier=${delivery.courier}&trackingNumber=${delivery.trackingNumber}`;

        const features = `width=${width},height=${height},resizable=no,scrollbars=no`;
        window.open(url, "_blank", features);
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

    useEffect(() => {
        modelFileUrls.map(async (url, i) => {
            const { magnification, quantity, technologyId } = orderItems[i];
            const newModelOrderData: ModelOrder = { modelFileUrl: url, magnification: magnification, quantity: quantity, materialType: "", color: "" };
            const response = await newAxios.get(`/api/v1/technologies/${technologyId}`);
            newModelOrderData.materialType = response.data.data.material;
            newModelOrderData.color = response.data.data.colorValue;
            setModelData((prev) => [...prev, newModelOrderData]);
        });
    }, [data]);
    return (
        <CardWrapper>
            <Title>
                <span>{orderDate.split("T")[0]} 주문</span>
                <span>{purchasePrice}원</span>
            </Title>
            <ContentsContainer>
                <Status>
                    {statusMap[status]}
                    {delivery ? (
                        <div style={{ fontSize: "16px", fontWeight: "initial" }}>
                            {delivery.courier} {delivery.trackingNumber}
                        </div>
                    ) : null}
                </Status>
                <RowContainer>
                    <ColumnContainer>
                        {modelData.map((e, i) => {
                            return (
                                <ItemContainer>
                                    <StlRenderContainer filePath={e.modelFileUrl} width="100px" height="100px" clickDisabled={true} />
                                    <TextContainer>
                                        <Text style={{ whiteSpace: "pre-line" }}></Text>
                                        <Text style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{ backgroundColor: e.color, width: "16px", height: "16px" }} />
                                            {convertMaterialName(e.materialType)}, {e.magnification}배, {e.quantity}개
                                        </Text>
                                    </TextContainer>
                                </ItemContainer>
                            );
                        })}
                    </ColumnContainer>
                    <ButtonContainer>
                        {status === "PAID" && <Button onClick={handleCancel}>주문취소</Button>}
                        {delivery && <Button onClick={openDeliveryTracking}>배송추적</Button>}
                        {status === "DELIVERED" && <Button onClick={() => navigate(`/createReview/${data.manufacturerId}`)}>리뷰쓰기</Button>}
                    </ButtonContainer>
                </RowContainer>
            </ContentsContainer>
        </CardWrapper>
    );
};

export default OrderCard;

const CardWrapper = styled.div`
    width: 720px;
    height: auto;
    padding: 16px;
    margin-bottom: 20px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Title = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
`;

const ContentsContainer = styled.div`
    width: 700px;
    height: auto;
    padding: 16px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;
`;

const RowContainer = styled.div`
    height: 100%;
    width: 100%;
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
    border-left: 1px solid #e6e6e6;

    display: flex;
    gap: 20px;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const Status = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Text = styled.div`
    font-size: 16px;
`;

const Button = styled.div`
    width: 100px;
    height: 32px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #dddddd;
        cursor: pointer;
    }
`;
