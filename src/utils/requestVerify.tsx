import PortOne from "@portone/browser-sdk/v2";
import { newAxios } from "./axiosWithUrl";

const requestVerify = async () => {
    try {
        const userId = localStorage.getItem("user-id");
        const accessToken = localStorage.getItem("accessToken");
        const response = await PortOne.requestIdentityVerification({
            storeId: "store-fac07677-97a5-457e-a490-fa243d2d40d1",
            identityVerificationId: `identity-verification-${userId}`,
            channelKey: "channel-key-5f86b98e-bbc3-4088-88c7-dfc8e3d7eeb5",
        });
        if (response?.code !== undefined) {
            return alert(response.message);
        }
        const postData = { identityVerificationId: `identity-verification-${userId}` };
        const notified: any = await newAxios.post("/api/v1/identity-verifications/verify", postData, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } });
        if (notified.data.status === 200) {
            return true;
        } else {
            alert("complete" + notified.data.message);
            return false;
        }
    } catch (e) {
        console.log(e);
        return false;
    }
};

export default requestVerify;

/*{
  "identityVerificationId": "iv-12345678-1234-1234-1234-1234567890ab"
} */
