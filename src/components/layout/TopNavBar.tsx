import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { newAxios } from "../../utils/axiosWithUrl";
import { User } from "../../types/UserType";
import CartDropdown from "./CartDropdown";
import SearchBar from "./SearchBar";
import UserMenuDropdown from "./UserMenuDropdown";
import { smallLevelImagesArray as levelImagesArray } from "../common/LevelImagesArray";
import CouponBoxIcon from "../../assets/images/topNavBar/coupon.svg";

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 가져오기
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const handleLoginClick = () => {
        if (localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
        }
        localStorage.setItem("redirectPath", window.location.href);
        navigate("/login");
    };

    const openCouponBox = () => {
        const width = 520;
        const height = 860;
        const url = "/coupon"; // 절대 경로로 바꾸고 싶다면 origin 붙이기

        const features = `width=${width},height=${height},resizable=no,scrollbars=no`;
        window.open(url, "_blank", features);
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token == null) return;

        const fetchUserData = async () => {
            try {
                const response = await newAxios.get("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } });
                setUserData(response.data.data);
                localStorage.setItem("realname", response.data.data.realname);
                localStorage.setItem("email", response.data.data.oauth2Id);
                console.log(response.data.data);
            } catch (e: any) {
                if (e.response.status == 401) {
                    alert("로그인 세션이 만료되었습니다.");
                    localStorage.removeItem("accessToken");
                    window.location.reload();
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const checkIsBanned = () => {
            if (!userData || !userData.banned) return;
            alert("사용 정지된 회원입니다.\n관리자에게 문의해주세요.\n 기간: " + userData.banUntil);
            localStorage.removeItem("accessToken");
            window.location.reload();
        };
        checkIsBanned();
    }, [userData]);

    return (
        <>
            <NavContainer>
                <ContentsContainer>
                    <LogoContainer onClick={() => navigate("/home")}>Crafteria</LogoContainer>
                    <NavMenuContainer>
                        <NavMenu to="/home" isActive={location.pathname === "/home"}>
                            홈
                        </NavMenu>
                        <NavMenu to="/my-design" isActive={location.pathname === "/my-design"}>
                            내 도면
                        </NavMenu>
                        <NavMenu to="/design-market" isActive={location.pathname === "/design-market" || location.pathname.startsWith("/design")}>
                            도면장터
                        </NavMenu>
                        <NavMenu to="/print-order" isActive={location.pathname === "/print-order"}>
                            주문하기
                        </NavMenu>
                        <NavMenu to="/sell-design" isActive={location.pathname === "/sell-design"}>
                            도면판매
                        </NavMenu>
                    </NavMenuContainer>
                    <SearchBar />
                    <UserInfoArea>
                        {userData ? (
                            <>
                                <img src={CouponBoxIcon} alt="쿠폰박스" width={24} height={24} onClick={openCouponBox} />
                                <CartDropdown />

                                <UserMenuDropdown userLevel={userData.userLevel} userName={userData.realname} />
                            </>
                        ) : (
                            <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
                        )}
                    </UserInfoArea>
                </ContentsContainer>
            </NavContainer>
        </>
    );
};

export default TopNavBar;

const NavContainer = styled.div`
    min-width: 100%;
    height: 50px;
    position: fixed;
    top: 0;
    background-color: ${({ theme }) => theme.bgColor};

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: ${({ theme }) => theme.border};
    z-index: 3000;
`;

const ContentsContainer = styled.div`
    width: 1440px;
    padding: 0 80px;
    height: 100%;
    display: flex;
    align-items: center;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    font-weight: bold;
    font-size: 20px;
    color: ${({ theme }) => theme.text.heading};

    &:hover {
        cursor: pointer;
    }
`;

const NavMenuContainer = styled.div`
    width: auto;
    height: 100%;
    margin: 0 187px;
    gap: 48px;

    display: flex;
`;

const NavMenu = styled(Link)<{ isActive: boolean }>`
    height: 100%;
    text-decoration: none;
    color: ${({ theme, isActive }) => (isActive ? theme.text.heading : theme.text.placeholder)};
    font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
    font-size: 14px;
    border-bottom: ${({ isActive }) => (isActive ? "2px solid #111111" : "none")};

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        font-weight: bold;
    }
`;

const LoginButton = styled.div`
    text-decoration: none;
    color: ${({ theme }) => theme.text.placeholder};

    &:hover {
        font-weight: bold;
    }
`;

const UserInfoArea = styled.div`
    margin-left: 16px;

    display: flex;
    align-items: center;
    gap: 16px;
`;

const UserInfoBox = styled.div`
    width: 117px;
    height: 40px;
    border-radius: 20px;
    background-color: ${({ theme }) => theme.grayScale[100]};

    display: flex;
    align-items: center;
`;
