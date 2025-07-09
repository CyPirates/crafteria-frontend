import { useEffect, useState } from "react";
import { FetchedOrder, OrderStatus } from "../types/OrderType";

type ClassifiedOrders = {
    [key in OrderStatus]: FetchedOrder[];
};

const initialClassifiedOrders: ClassifiedOrders = {
    PAID: [],
    IN_PRODUCTING: [],
    PRODUCTED: [],
    DELIVERING: [],
    DELIVERED: [],
    CANCELED: [],
};

type OwnProps = {
    orderList: FetchedOrder[];
};

const useClassifiedOrderList = ({ orderList }: OwnProps) => {
    const [classifiedOrders, setClassifiedOrders] = useState<ClassifiedOrders>(initialClassifiedOrders);

    useEffect(() => {
        const newClassifiedOrders: ClassifiedOrders = { ...initialClassifiedOrders };
        orderList.forEach((order) => {
            const status = order.status as OrderStatus;
            newClassifiedOrders[status].push(order);
        });
        setClassifiedOrders(newClassifiedOrders);
    }, [orderList]);

    return classifiedOrders;
};

export default useClassifiedOrderList;
