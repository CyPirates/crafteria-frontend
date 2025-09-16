import styled from "styled-components";
import { FetchedOrder } from "../../../types/OrderType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useEffect, useState } from "react";
import convertMaterialName from "../../../utils/convertMaterialName";
import { Typography } from "../../common/Typography";

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
        try {
            const response = await newAxios.post(`/api/v1/order/my/cancel/${orderId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(orderId);
            console.log(response.data);
            //window.location.reload();
        } catch (e) {
            console.log(e);
        }
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
            <Typography variant="body.medium_b">
                {orderDate.split("T")[0]} 주문 · {purchasePrice} 원
            </Typography>
            <RowContainer>
                <OrderInfoConatiner>
                    <Typography variant="body.medium_b" style={{ fontSize: "16px", display: "flex", gap: "8px" }}>
                        {statusMap[status]}
                        {delivery ? (
                            <>
                                <span>· {delivery.courier}</span>
                                <span>{delivery.trackingNumber}</span>
                            </>
                        ) : null}
                    </Typography>
                    <TableWrapper>
                        <colgroup>
                            <col width={"140px"} />
                            <col width={"140px"} />
                            <col width={"140px"} />
                            <col width={"140px"} />
                            <col width={"140px"} />
                        </colgroup>
                        <thead>
                            <Th>도면</Th>
                            <Th>재료</Th>
                            <Th>색</Th>
                            <Th>배율</Th>
                            <Th>수량</Th>
                        </thead>
                        <tbody>
                            {modelData.map((e) => {
                                return (
                                    <tr>
                                        <Td>
                                            <InnerDiv>
                                                <StlRenderContainer filePath={e.modelFileUrl} width="80px" height="80px" clickDisabled={true} />
                                            </InnerDiv>
                                        </Td>
                                        <Td>{convertMaterialName(e.materialType)}</Td>
                                        <Td>
                                            <InnerDiv>
                                                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                    <div style={{ backgroundColor: e.color, width: "16px", height: "16px" }} />
                                                    {e.color.toUpperCase()}
                                                </div>
                                            </InnerDiv>
                                        </Td>
                                        <Td>{e.magnification}</Td>
                                        <Td>{e.quantity}</Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </TableWrapper>
                </OrderInfoConatiner>
                <ButtonContainer>
                    {status === "PAID" && <Button onClick={handleCancel}>주문취소</Button>}
                    {status === "DELIVERING" && <Button onClick={openDeliveryTracking}>배송추적</Button>}
                    {status === "DELIVERED" && <Button onClick={() => navigate(`/createReview?orderId=${orderId}&manufacturerId=${data.manufacturerId}`)}>리뷰쓰기</Button>}
                </ButtonContainer>
            </RowContainer>
        </CardWrapper>
    );
};

export default OrderCard;

const CardWrapper = styled.div`
    width: 1120px;
    height: auto;
    padding: 20px 0 20px 48px;
    margin-bottom: 16px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
`;

const RowContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 48px;
`;

const OrderInfoConatiner = styled.div`
    width: 700px;
    margin-top: 16px;
    padding: 16px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;

    display: flex;
    flex-direction: column;
    align-items: start;
`;

const ButtonContainer = styled.div`
    height: auto;
    border-left: 1px solid #e6e6e6;
    flex: 1;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
`;

const Button = styled.div`
    width: 220px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #dddddd;
        cursor: pointer;
    }
`;

const TableWrapper = styled.table`
    margin-top: 16px;
    th,
    td,
    div {
        color: ${({ theme }) => theme.text.heading};
        font-size: ${({ theme }) => theme.typography.body.small_b.fontSize};
        font-weight: ${({ theme }) => theme.typography.body.small_b.fontWeight};
        line-height: ${({ theme }) => theme.typography.body.small_b.lineHeight};
    }
`;

const Th = styled.th`
    height: 40px;
    text-align: center;
`;

const Td = styled.td`
    text-align: center;
`;
const InnerDiv = styled.div`
    display: inline-block;
`;
