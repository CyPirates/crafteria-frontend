import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import Badge from "@mui/material/Badge";
import { toggleTheme } from "../../store/themeSlice";

import LoginModal from "../specific/login/LoginModal";
import Logo from "../../assets/logo.png";
import { newAxios } from "../../utils/axiosWithUrl";
import { User } from "../../types/UserType";
import { Cart } from "../../types/CartType";
import CartDropdown from "./CartDropdown";

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 가져오기
    const [isOpen, setIsOpen] = useState(false);
    const [num, setNum] = useState<number>(0);
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const isLight = useSelector((state: RootState) => state.theme.isLight);
    const dispatch = useDispatch<AppDispatch>();

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const searchKeyword = e.currentTarget.value.trim();
            if (searchKeyword) {
                navigate(`/search/${searchKeyword}`);
            }
        }
    };

    const handleLoginClick = () => {
        if (localStorage.getItem("accessToken")) {
            localStorage.removeItem("accessToken");
            setNum(num + 1);
            return;
        }
        localStorage.setItem("redirectPath", window.location.href);
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token == null) return;

        const fetchUserData = async () => {
            try {
                const response = await newAxios.get("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } });
                setUserData(response.data.data);
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
            <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
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
                        <NavMenu to="/design-market" isActive={location.pathname === "/design-market"}>
                            도면 장터
                        </NavMenu>
                        <NavMenu to="/print-order" isActive={location.pathname === "/print-order"}>
                            주문하기
                        </NavMenu>
                        <NavMenu to="/sell-design" isActive={location.pathname === "/sell-design"}>
                            도면 판매
                        </NavMenu>
                    </NavMenuContainer>
                    {/* <div style={{ width: "20vw" }}></div> */}
                    {userData ? <div>{userData.realname}님</div> : null}
                    <LoginButton onClick={handleLoginClick}>{localStorage.getItem("accessToken") ? null : "로그인"}</LoginButton>
                    <CartDropdown />
                    <MyPageButton isActive={location.pathname === "/my-page"} onClick={() => navigate("/my-page")} />
                    {/* <button onClick={() => dispatch(toggleTheme())}>{isLight ? "라이트모드" : "다크모드"}</button> */}
                </ContentsContainer>
            </NavContainer>
        </>
    );
};

const SearchBar: React.FC<{
    onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ onSearchSubmit }) => {
    return (
        <SearchContainer>
            <SearchInput
                onKeyUp={onSearchSubmit} // Enter 키 입력 시 검색 처리
            />
        </SearchContainer>
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
    width: 1300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const LogoContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: start;

    &:hover {
        cursor: pointer;
    }
`;

const LogoImage = styled.img`
    //height: 48px;
    width: 240px;
    object-fit: contain;
`;

const NavMenuContainer = styled.div`
    width: 500px;
    margin-left: 30px;
    margin-right: 300px;
    display: flex;
    justify-content: space-between;
`;

const NavMenu = styled(Link)<{ isActive: boolean }>`
    text-decoration: none;
    font-size: 18px;
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#a5a5a7")};
    font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};

    &:hover {
        font-weight: bold;
    }
`;

const SearchContainer = styled.div`
    width: 15vw;
    height: 34px;
    margin: 0px 10vw;
    padding-left: 20px;
    border-radius: 30px;
    background-color: white;
    display: flex;
    justify-content: start;
    align-items: center;
`;

const SearchInput = styled.input`
    width: 12vw;
    margin-left: 10px;
    border: none;
    outline: none;
    font-size: 1vw;
`;

const LoginButton = styled.div`
    text-decoration: none;
    font-size: 18px;
    color: #a5a5a7;

    &:hover {
        font-weight: bold;
    }
`;

const MyPageButton = styled(AiOutlineUser)<{ isActive: boolean }>`
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#a5a5a7")};
    width: 25px;
    height: 25px;
    margin-left: 30px;

    &:hover {
        color: grey;
    }
`;
