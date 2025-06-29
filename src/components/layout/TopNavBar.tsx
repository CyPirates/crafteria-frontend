import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { toggleTheme } from "../../store/themeSlice";

import Logo from "../../assets/logo.png";

import { newAxios } from "../../utils/axiosWithUrl";
import { User } from "../../types/UserType";
import CartDropdown from "./CartDropdown";
import SearchBar from "./SearchBar";
import UserMenuDropdown from "./UserMenuDropdown";
import levelImagesArray from "../common/LevelImagesArray";

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 가져오기
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const isLight = useSelector((state: RootState) => state.theme.isLight);
    const dispatch = useDispatch<AppDispatch>();

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

    return (
        <>
            <NavContainer>
                <ContentsContainer>
                    <LogoContainer onClick={() => navigate("/home")}>
                        <LogoImage src={Logo} alt="x" />
                    </LogoContainer>
                    <NavMenuContainer>
                        <NavMenu to="/home" isActive={location.pathname === "/home"}>
                            홈
                        </NavMenu>
                        <NavMenu to="/my-design" isActive={location.pathname === "/my-design"}>
                            내 도면
                        </NavMenu>
                        <NavMenu to="/design-market" isActive={location.pathname === "/design-market" || location.pathname.startsWith("/design")}>
                            도면 장터
                        </NavMenu>
                        <NavMenu to="/print-order" isActive={location.pathname === "/print-order"}>
                            주문하기
                        </NavMenu>
                        <NavMenu to="/sell-design" isActive={location.pathname === "/sell-design"}>
                            도면 판매
                        </NavMenu>
                    </NavMenuContainer>
                    <SearchBar />
                    <UserInfoArea>
                        {userData ? (
                            <>
                                <div>
                                    <img src={levelImagesArray[Math.min(userData.userLevel, 4)]} alt="레벨" width={24} height={24} />
                                    {userData.realname}님
                                </div>

                                <CartDropdown />
                                <UserMenuDropdown />
                                <LoginButton onClick={openCouponBox}>쿠폰함</LoginButton>
                            </>
                        ) : (
                            <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
                        )}
                    </UserInfoArea>

                    {/* <button onClick={() => dispatch(toggleTheme())}>{isLight ? "라이트모드" : "다크모드"}</button> */}
                </ContentsContainer>
            </NavContainer>
        </>
    );
};

export default TopNavBar;

const NavContainer = styled.div`
    width: 100%;
    height: 50px;
    position: fixed;
    top: 0;
    background-color: ${({ theme }) => theme.bgColor};

    display: flex;
    align-items: center;
    justify-content: center;

    border-bottom: 1px solid #464649;
    z-index: 3000;
`;

const ContentsContainer = styled.div`
    width: 1500px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px; // TopNavBar의 높이에 맞추기
    width: auto;
    overflow: hidden; // 튀어나오는 외곽을 숨김
    &:hover {
        cursor: pointer;
    }
`;

const LogoImage = styled.img`
    height: 80px; // 원하는 이미지 크기
    width: auto; // 원본 비율 유지
    object-fit: contain; // 이미지 비율 유지하면서 영역에 맞춤
`;

const NavMenuContainer = styled.div`
    width: 480px;
    margin-right: 40px;
    display: flex;
    justify-content: space-between;
`;

const NavMenu = styled(Link)<{ isActive: boolean }>`
    text-decoration: none;
    font-size: 18px;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#a5a5a7")};
    font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
    border-bottom: ${({ isActive }) => (isActive ? "2px solid #F4351D" : "none")};

    &:hover {
        font-weight: bold;
    }
`;

const LoginButton = styled.div`
    text-decoration: none;
    font-size: 18px;
    color: #a5a5a7;

    &:hover {
        font-weight: bold;
    }
`;

const UserInfoArea = styled.div`
    flex: 1;
    padding: 0 20px;
    display: flex;
    gap: 20px;
`;
