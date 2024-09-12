import { useEffect, useState } from "react";
import { Order } from "../types/OrderType";

type OwnProps = {
    orderList: Order[];
};

const useClassifiedOrderList = ({ orderList }: OwnProps) => {
    const [ordered, setOrdered] = useState<Order[]>([]);
    const [inProducting, setInProducting] = useState<Order[]>([]);
    const [delivered, setDelivered] = useState<Order[]>([]);
    const [canceled, setCanceled] = useState<Order[]>([]);

    useEffect(() => {
        const classifiedOrdered = orderList.filter((order) => order.status === "ORDERED");
        const classifiedInProducting = orderList.filter((order) => order.status === "IN_PRODUCTING");
        const classifiedDelivered = orderList.filter((order) => order.status === "DELIVERED");
        const classifiedCanceled = orderList.filter((order) => order.status === "CANCELED");

        setOrdered(classifiedOrdered);
        setInProducting(classifiedInProducting);
        setDelivered(classifiedDelivered);
        setCanceled(classifiedCanceled);
    }, [orderList]);

    return { ordered, inProducting, delivered, canceled };
};

export default useClassifiedOrderList;
