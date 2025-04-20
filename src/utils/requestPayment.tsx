import PortOne from "@portone/browser-sdk/v2";
import { newAxios } from "./axiosWithUrl";

const initiatePortOnePayment = async (paymentId: string, orderId: string, price: string, itemType: string): Promise<boolean> => {
    try {
        const response = await PortOne.requestPayment({
            storeId: "store-fac07677-97a5-457e-a490-fa243d2d40d1",
            channelKey: "channel-key-cc38c030-f0b0-46b0-8c0d-78695dac8786",
            paymentId: paymentId,
            orderName: "주문하기",
            // must +price
            totalAmount: +price,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customData: {},
            customer: {
                fullName: "이찬호",
                email: "qboooodp@naver.com",
                phoneNumber: "010-8152-1000",
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
