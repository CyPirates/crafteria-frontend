import GoogleLoginImage from "../assets/googleLogin.png";
import NaverLoginImage from "../assets/naverLogin.png";
import KakaoLoginImage from "../assets/kakaoLogin.png";
import Logo from "../assets/logo.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <PageWrapper>
            <LogoContainer onClick={() => navigate("/")} src={Logo} />
            <Container>간편로그인/회원가입</Container>
            <ImagesContainer>
                <OauthImageContainer src={GoogleLoginImage} onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google")} />
                {/* <OauthImageContainer src={KakaoLoginImage} alt="x" onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/kakao")} /> */}
                <OauthImageContainer src={NaverLoginImage} onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/naver")} />
            </ImagesContainer>
        </PageWrapper>
    );
};

export default LoginPage;

const PageWrapper = styled.div`
    width: 1000px;
    margin: auto;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LogoContainer = styled.img`
    width: 800px;
`;

const OauthImageContainer = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
`;
const Line = styled.div`
    border: 1px solid #464649;
    width: 100%;
    margin: 5px 0px 20px;
`;

const ImagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
`;
