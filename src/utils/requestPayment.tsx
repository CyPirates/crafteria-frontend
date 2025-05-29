import PortOne from "@portone/browser-sdk/v2";
import { newAxios } from "./axiosWithUrl";

const initiatePortOnePayment = async (paymentId: string, orderId: string, price: string, itemType: string): Promise<boolean> => {
    try {
        const response = await PortOne.requestPayment({
            storeId: "store-fac07677-97a5-457e-a490-fa243d2d40d1",
            channelKey: "channel-key-34aa25bf-744d-40bf-bb55-99ca683c7fbf",
            paymentId: paymentId,
            orderName: "주문하기",
            // must +price
            totalAmount: +price,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customData: {},
            customer: {
                fullName: localStorage.getItem("realname")?.toString(),
            },
        });
        if (response?.code) {
            console.log(response.message + "ㅁㄴㅇㄹ");
        } else {
            const data = { paymentId: paymentId, [itemType]: orderId };
            console.log(data);
            const notified: any = await newAxios.post(`/api/v1/payment/${itemType === "modelId" ? "model/" : ""}complete`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            console.log(notified.data);
            if (notified.data.status === 200) {
                return true;
            } else {
                alert("complete" + notified.data.message);
            }
        }
    } catch (e) {
        console.log(e);
    }
    return false;
};

export default initiatePortOnePayment;
