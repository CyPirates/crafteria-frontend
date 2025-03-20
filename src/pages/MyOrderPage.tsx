import { useEffect, useState } from "react";
import { FetchedOrder } from "../types/OrderType";
import { newAxios } from "../utils/axiosWithUrl";
import styled from "styled-components";
import OrderCard from "../components/specific/myPage/OrderCard";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";
import useAuthErrorHandler from "../hooks/useAuthErrorHandler";

const MyOrderPage = () => {
    const { handleAuthError } = useAuthErrorHandler();
    const [orderList, setOrderList] = useState<FetchedOrder[]>([]);
    const { ordered, inProducting, delivered } = useClassifiedOrderList({ orderList });

    const filterTextArray = ["전체", "출력 대기", "출력 중", "배송 중"];
    const [filterText, setFilterText] = useState<string[]>([]);

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

    // 🔹 필터링된 주문 리스트 생성
    const filteredOrders = orderList.filter((order) => {
        if (filterText.length === 0 && order.status !== "CANCELED") return true;
        if (filterText.includes("출력 대기") && ordered.includes(order)) return true;
        if (filterText.includes("출력 중") && inProducting.includes(order)) return true;
        if (filterText.includes("배송 중") && delivered.includes(order)) return true;
        return false;
    });

    const handleCheckboxChange = (text: string) => {
        if (text === "전체") {
            setFilterText([]); // "전체" 선택 시 다른 필터 해제
        } else {
            setFilterText(
                (prev) =>
                    prev.includes(text)
                        ? prev.filter((item) => item !== text) // 이미 선택된 항목이면 해제
                        : [...prev.filter((item) => item !== "전체"), text] // "전체" 제거 후 추가
            );
        }
    };

    return (
        <>
            <Title>나의 주문</Title>
            <FilterContainer>
                <FilterCategory>상태</FilterCategory>
                {filterTextArray.map((text) => (
                    <FilterLabel key={text}>
                        <input type="checkbox" checked={text === "전체" ? filterText.length === 0 : filterText.includes(text)} onChange={() => handleCheckboxChange(text)} />
                        {text}
                    </FilterLabel>
                ))}
            </FilterContainer>
            <CardContainer>{filteredOrders.length > 0 ? filteredOrders.map((order) => <OrderCard data={order} />) : <NoOrders>해당 상태의 주문이 없습니다.</NoOrders>}</CardContainer>
        </>
    );
};

export default MyOrderPage;

// 스타일링
const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 3px solid #707074;
    margin-bottom: 10px;
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
