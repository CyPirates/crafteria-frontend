import { useEffect, useState } from "react";
import { FetchedOrder } from "../types/OrderType";
import { newAxios } from "../utils/axiosWithUrl";
import styled from "styled-components";
import { title } from "process";
import OrderCard from "../components/specific/myPage/OrderCard";
import useClassifiedOrderList from "../hooks/useClassifiedOrderList";

const MyPage = () => {
    const [orderList, setOrderList] = useState<FetchedOrder[]>([]);
    const { ordered, inProducting, delivered } = useClassifiedOrderList({ orderList });

    useEffect(() => {
        const getOrderList = async () => {
            try {
                const response = await newAxios.get("/api/v1/order/my?page=0", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                //console.log(response.data.data);
                setOrderList(response.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        getOrderList();
    }, []);

    useEffect(() => {
        console.log("check");
        console.log(delivered);
    }, [delivered]);

    return (
        <>
            <Title>나의 주문</Title>
            <CardContainer>
                {ordered.map((e) => {
                    return <OrderCard data={e} />;
                })}
                {inProducting.map((e) => {
                    return <OrderCard data={e} />;
                })}
                {delivered.map((e, i) => {
                    //if (i == 3) return;
                    return <OrderCard data={e} />;
                })}
            </CardContainer>
        </>
    );
};

export default MyPage;

const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 3px solid #707074;
    margin-bottom: 10px;
`;

const CardContainer = styled.div``;
