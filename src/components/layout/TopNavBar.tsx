import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import { useState } from "react";

const TopNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 현재 URL 경로 가져오기
    const [num, setNum] = useState<number>(0);

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
        window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google";
    };

    return (
        <>
            <NavContainer>
                <LogoContainer onClick={() => navigate("/home")}>Crafteria</LogoContainer>
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
                {/* <SearchBar onSearchSubmit={handleSearchSubmit} /> */}
                <div style={{ width: "20vw" }}></div>
                <LoginButton onClick={handleLoginClick}>{localStorage.getItem("accessToken") ? "로그아웃" : "로그인"}</LoginButton>
                <MyPageButton isActive={location.pathname === "/my-page"} onClick={() => navigate("/my-page")} />
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
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 5px solid #464649;
    background-color: #39393c;
    z-index: 3000;
`;

const LogoContainer = styled.div`
    margin: 0px 10vw;
    font-size: 2vw;
    color: #9d9d9f;
`;

const NavMenuContainer = styled.div`
    width: 25vw;
    display: flex;
    justify-content: space-between;
`;

const NavMenu = styled(Link)<{ isActive: boolean }>`
    text-decoration: none;
    font-size: 1vw;
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
    font-size: 1vw;
    color: #a5a5a7;

    &:hover {
        font-weight: bold;
    }
`;

const MyPageButton = styled(AiOutlineUser)<{ isActive: boolean }>`
    color: ${({ isActive }) => (isActive ? "#F4351D" : "#a5a5a7")};
    width: 2vw;
    height: 2vw;
    margin-left: 60px;

    &:hover {
        width: 2.2vw;
        height: 2.2vw;
    }
`;
