import { useEffect, useState } from "react";
import { FetchedOrder } from "../types/OrderType";
import { newAxios } from "../utils/axiosWithUrl";
import styled from "styled-components";
import OrderCard from "../components/specific/myPage/OrderCard";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";
import { Typography } from "../components/common/Typography";

const MyOrderPage = () => {
    const { handleAuthError } = useAuthErrorHandler();
    const [orderList, setOrderList] = useState<FetchedOrder[]>([]);
    const { PAID, IN_PRODUCTING, PRODUCTED, DELIVERING, DELIVERED, CANCELED } = useClassifiedOrderList({ orderList });

    const filterTextArray = ["전체", "출력 대기", "출력 중", "출력 완료", "배송 중", "배송 완료"];
    const [filterText, setFilterText] = useState<string[]>([]);

    const statusMap: Record<string, FetchedOrder[]> = {
        "출력 대기": PAID,
        "출력 중": IN_PRODUCTING,
        "출력 완료": PRODUCTED,
        "배송 중": DELIVERING,
        "배송 완료": DELIVERED,
        "주문 취소": CANCELED,
    };
    const filteredOrders: FetchedOrder[] = (() => {
        if (filterText.length === 0) {
            return orderList.filter((order) => order.status !== "CANCELED");
        }

        const matchedOrderSet = new Set<FetchedOrder>();

        filterText.forEach((text) => {
            const orders = statusMap[text];
            orders?.forEach((order) => matchedOrderSet.add(order));
        });
        return Array.from(matchedOrderSet);
    })();

    const handleCheckboxChange = (text: string) => {
        if (text === "전체") {
            setFilterText([]); // "전체" 선택 시 다른 필터 해제
        } else {
            setFilterText((prev) =>
                prev.includes(text)
                    ? prev.filter((item) => item !== text) // 이미 선택된 항목이면 해제
                    : [...prev, text]
            );
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const getOrderList = async () => {
            try {
                const response = await newAxios.get("/api/v1/order/my?page=0", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setOrderList(response.data.data);
                console.log(response.data.data);
            } catch (e) {
                handleAuthError(e);
            }
        };
        getOrderList();
    }, []);

    return (
        <PageWrapper>
            <Typography variant="heading.h6" color="text.heading">
                주문 내역
            </Typography>
            <FilterContainer>
                {filterTextArray.map((text) => (
                    <FilterLabel key={text}>
                        <input type="checkbox" checked={text === "전체" ? filterText.length === 0 : filterText.includes(text)} onChange={() => handleCheckboxChange(text)} />
                        {text}
                    </FilterLabel>
                ))}
            </FilterContainer>
            <CardContainer>{filteredOrders.length > 0 ? filteredOrders.map((order) => <OrderCard key={order.orderId} data={order} />) : <NoOrders>주문이 없습니다.</NoOrders>}</CardContainer>
        </PageWrapper>
    );
};

export default MyOrderPage;

const PageWrapper = styled.div`
    padding: 32px 0 0 80px;
`;

const CardContainer = styled.div``;

const FilterCategory = styled.div`
    padding-right: 8px;
    border-right: 1.5px solid black;
`;

const FilterContainer = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
`;

const FilterLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
`;

const NoOrders = styled.div`
    text-align: center;
    font-size: 18px;
    color: gray;
    margin-top: 20px;
`;
