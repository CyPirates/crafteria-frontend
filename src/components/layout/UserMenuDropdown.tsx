import Dropdown from "react-bootstrap/Dropdown";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function UserMenuDropdown() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
        navigate("/");
    };

    return (
        <Dropdown>
            <Dropdown.Toggle as="div" id="dropdown-custom-toggle" style={{ cursor: "pointer" }}>
                <AiOutlineUser size={"1.5em"} />
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "100px" }}>
                <Dropdown.Item onClick={() => navigate("my-order")}>
                    <div>내 주문</div>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>
                    <div>로그아웃</div>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default UserMenuDropdown;
