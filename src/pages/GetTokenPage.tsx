import React, { useEffect } from "react";

const GetTokenPage = () => {
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
            const redirectPath = localStorage.getItem("redirectPath");
            if (redirectPath) {
                localStorage.removeItem("redirectPath"); // 리다이렉트 경로를 가져온 후 삭제
                window.location.href = redirectPath; // 원래 페이지로 이동
            }
        }
    }, []);

    return (
        <div>
            <h1>Authentication Success</h1>
        </div>
    );
};

export default GetTokenPage;
