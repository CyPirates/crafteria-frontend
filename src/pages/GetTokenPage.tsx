import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GetTokenPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        // URL에서 쿼리 파라미터를 추출하는 함수
        const getQueryParam = (param: string): string | null => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };

        // 액세스 토큰을 추출
        const accessToken = getQueryParam("accessToken");

        if (accessToken) {
            // 액세스 토큰을 로컬 스토리지에 저장
            console.log(accessToken);
            localStorage.setItem("accessToken", accessToken);
            //navigate(-2);
        }

        // 선택적으로: 인증 후 다른 페이지로 리디렉션
        // window.location.href = '/some-other-page';
    }, []);

    return (
        <div>
            <h1>Authentication Success</h1>
        </div>
    );
};

export default GetTokenPage;
