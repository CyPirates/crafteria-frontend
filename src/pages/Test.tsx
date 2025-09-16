import PortOne from "@portone/browser-sdk/v2";
import { newAxios } from "../utils/axiosWithUrl";

const Test = () => {
    const ivTest = async () => {
        try {
            const userId = localStorage.getItem("user-id");
            const accessToken = localStorage.getItem("accessToken");
            const postData = { identityVerificationId: `identity-verification-${userId}` };
            console.log(postData);
            const notified: any = await newAxios.post("/api/v1/identity-verifications/verify", postData, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` } });
            if (notified.data.status === 200) {
                return true;
            } else {
                alert("complete" + notified.data.message);
                return false;
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            <button onClick={ivTest}>asdf</button>
        </>
    );
};

export default Test;
