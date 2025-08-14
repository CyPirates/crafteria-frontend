import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import UserIcon from "../../assets/images/topNavBar/userImg2x.png";
import { smallLevelImagesArray } from "../common/LevelImagesArray";

type OwnProps = {
    userLevel: number;
    userName: string;
};

function UserMenuDropdown(props: OwnProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
        navigate("/");
    };

    return (
        <StyledDropdown>
            <Dropdown.Toggle as="div" id="dropdown-custom-toggle" className="no-caret" style={{ cursor: "pointer" }}>
                <UserInfoBox>
                    <img src={smallLevelImagesArray[props.userLevel]} alt="x" width={"16px"} />
                    <img src={UserIcon} alt="x" width={"20px"} />
                    <UserName>{props.userName}님</UserName>
                </UserInfoBox>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "100px" }}>
                <Dropdown.Item onClick={() => navigate("my-page")}>
                    <div>내 정보</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("my-order")}>
                    <div>내 주문</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                    <div>로그아웃</div>
                </Dropdown.Item>
            </Dropdown.Menu>
        </StyledDropdown>
    );
}

export default UserMenuDropdown;

const StyledDropdown = styled(Dropdown)`
    .dropdown-toggle.no-caret::after {
        display: none;
        min-width: 118px;
    }
`;

const UserInfoBox = styled.div`
    width: 117px;
    height: 40px;
    border-radius: 20px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    padding-left: 12px;
    gap: 4px;

    display: flex;
    align-items: center;
`;

const UserName = styled.div`
    font-size: 11px;
    color: ${({ theme }) => theme.text.body};
    height: 11px;
`;
