import styled from "styled-components";
import { Typography } from "../../common/Typography";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const navigate = useNavigate();
    return (
        <SideBarContainer>
            <Typography variant="body.medium_b">회원 정보 관리</Typography>
            <div style={{ marginTop: "8px" }} />

            <LinkedTypography variant="body.medium_r" onClick={() => navigate("/my-page/user-info")}>
                내 정보
            </LinkedTypography>
            <LinkedTypography variant="body.medium_r" onClick={() => navigate("/my-page/address")}>
                주소지 관리
            </LinkedTypography>
            <LinkedTypography variant="body.medium_r" onClick={() => navigate("/my-page/order")}>
                주문 내역
            </LinkedTypography>
            <div style={{ marginTop: "40px" }} />

            <Typography variant="body.medium_b">도면 판매 관리</Typography>
            <div style={{ marginTop: "8px" }} />

            <LinkedTypography variant="body.medium_r" onClick={() => navigate("/my-page/bank-account")}>
                판매자 정보
            </LinkedTypography>
        </SideBarContainer>
    );
};

export default SideBar;

const SideBarContainer = styled.div`
    width: 200px;
    height: 600px;
    padding: 20px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.grayScale[100]};

    position: sticky;
    left: 0px;
    top: 80px;

    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const LinkedTypography = styled(Typography)`
    cursor: pointer;
`;
