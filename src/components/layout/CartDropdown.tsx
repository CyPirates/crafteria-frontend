import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Cart } from "../../types/CartType";
import { Badge, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";

type DesignOutline = {
    id: string;
    modelFileUrl: string;
    name: string;
    price: string;
};
function CartDropdown() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<Cart[] | undefined>(undefined);
    const [items, setItems] = useState<DesignOutline[]>([]);

    const fetchCartData = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await newAxios.get("/api/v1/carts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartData(response.data.data);
        } catch (e: any) {
            console.error("Failed to fetch cart data:", e);
        }
    };

    const fetchItemData = async (id: string) => {
        try {
            const response = await newAxios.get(`/api/v1/model/user/view/${id}`);
            const data = response.data.data;

            setItems((prev) => [...prev, { id: data.id, modelFileUrl: data.modelFileUrl, name: data.name, price: data.price }]);
        } catch (e: any) {
            console.error(`Failed to fetch design data for id: ${id}`, e);
        }
    };
    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        setItems([]);
        console.log(cartData);
        cartData?.map((e) => {
            fetchItemData(e.modelId);
        });
    }, [cartData]);

    return (
        <Dropdown>
            {/* 커스텀 토글 */}
            <Dropdown.Toggle as="div" id="dropdown-custom-toggle" style={{ cursor: "pointer" }}>
                <Badge
                    badgeContent={cartData?.length || 0}
                    sx={{
                        "& .MuiBadge-badge": {
                            backgroundColor: "#F20000",
                            color: "white", // 배지 텍스트 색상
                        },
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </Dropdown.Toggle>

            {/* 드롭다운 메뉴 */}
            <Dropdown.Menu style={{ minWidth: "100px" }}>
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <>
                            <Dropdown.Item key={index} onClick={() => navigate(`/design/${item.id}`)}>
                                <ItemLayout modelFileUrl={item.modelFileUrl} name={item.name} price={item.price} />
                            </Dropdown.Item>
                            {index + 1 == items.length ? null : <Dropdown.Divider />}
                        </>
                    ))
                ) : (
                    <Dropdown.Item disabled>
                        <Typography textAlign="center" color="text.secondary">
                            장바구니가 비어 있습니다.
                        </Typography>
                    </Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
}

const ItemLayout = ({ modelFileUrl, name, price }: { modelFileUrl: string; name: string; price: string }) => {
    return (
        <>
            <ItemWrapper>
                <StlRenderContainer filePath={modelFileUrl} width="50px" height="50px" clickDisabled={true} />
                <NameContainer>{name}</NameContainer>
            </ItemWrapper>
        </>
    );
};
export default CartDropdown;

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 200px;

    align-items: center;
`;

const NameContainer = styled.div`
    flex: 1;
    margin-left: 10px;
`;
