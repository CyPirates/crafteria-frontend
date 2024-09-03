import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

//TODO: 반응형 UI, 로고 들어오면 navigate 추가하기, params로 빨갛게 하기

const TopNavBar = () => {
    const navigate = useNavigate();

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const searchKeyword = e.currentTarget.value.trim();
            if (searchKeyword) {
                navigate(`/search/${searchKeyword}`);
            }
        }
    };

    const routeToMypage = () => {
        navigate("/mypage");
    };

    return (
        <>
            <NavContainer>
                <LogoContainer>LOGO</LogoContainer>
                <NavMenuContainer>
                    <NavMenu to="/home">홈</NavMenu>
                    <NavMenu to="/my-design">내 도면</NavMenu>
                    <NavMenu to="/design-market">도면 장터</NavMenu>
                    <NavMenu to="/print-order">주문하기</NavMenu>
                </NavMenuContainer>
                <SearchBar onSearchSubmit={handleSearchSubmit} />
                <LoginButton>로그인</LoginButton>
                <MyPageButton onClick={routeToMypage} />
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

const NavMenu = styled(Link)`
    text-decoration: none;
    font-size: 1vw;
    color: #a5a5a7;

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

const MyPageButton = styled(AiOutlineUser)`
    color: #a5a5a7;
    width: 2vw;
    height: 2vw;
    margin-left: 60px;

    &:hover {
        width: 2.2vw;
        height: 2.2vw;
    }
`;
