import { useEffect, useState } from "react";
import { FetchedOrder } from "../types/OrderType";

type OwnProps = {
    orderList: FetchedOrder[];
};

const useClassifiedOrderList = ({ orderList }: OwnProps) => {
    const [ordered, setOrdered] = useState<FetchedOrder[]>([]);
    const [inProducting, setInProducting] = useState<FetchedOrder[]>([]);
    const [delivered, setDelivered] = useState<FetchedOrder[]>([]);
    const [canceled, setCanceled] = useState<FetchedOrder[]>([]);

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
