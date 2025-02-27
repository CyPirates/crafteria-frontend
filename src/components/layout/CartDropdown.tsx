import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { MdDelete } from "react-icons/md";
import { Cart } from "../../types/CartType";
import { Badge, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { newAxios } from "../../utils/axiosWithUrl";
import styled from "styled-components";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";

type DesignOutline = {
    cartId: string;
    modelId: string;
    modelFileUrl: string;
    name: string;
    price: string;
};

function CartDropdown() {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<Cart[] | undefined>(undefined);
    const [items, setItems] = useState<DesignOutline[]>([]);

    // 장바구니 데이터 가져오기
    const fetchCartData = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await newAxios.get("/api/v1/carts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartData(response.data.data);
        } catch (e) {
            console.error("Failed to fetch cart data:", e);
        }
    };

    // 디자인 정보 가져오기
    const fetchItemData = async (modelId: string, cartId: string) => {
        try {
            const response = await newAxios.get(`/api/v1/model/user/view/${modelId}`);
            const data = response.data.data;

            setItems((prev) => [...prev, { cartId: cartId, modelId: modelId, modelFileUrl: data.modelFileUrl, name: data.name, price: data.price }]);
        } catch (e) {
            console.error(`Failed to fetch design data for id: ${cartId}`, e);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        setItems([]); // 기존 데이터 초기화
        cartData?.forEach((e) => fetchItemData(e.modelId, e.cartId));
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
                            color: "white",
                        },
                    }}
                >
                    <ShoppingCartIcon />
                </Badge>
            </Dropdown.Toggle>

            {/* 드롭다운 메뉴 */}
            <Dropdown.Menu style={{ minWidth: "100px" }}>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div key={index}>
                            <Dropdown.Item onClick={() => navigate(`/design/${item.modelId}`)}>
                                <ItemLayout modelFileUrl={item.modelFileUrl} name={item.name} id={item.cartId} setItems={setItems} setCartData={setCartData} />
                            </Dropdown.Item>
                            {index + 1 !== items.length && <Dropdown.Divider />}
                        </div>
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

const ItemLayout = ({
    modelFileUrl,
    name,
    id,
    setItems,
    setCartData,
}: {
    modelFileUrl: string;
    name: string;
    id: string;
    setItems: React.Dispatch<React.SetStateAction<DesignOutline[]>>;
    setCartData: React.Dispatch<React.SetStateAction<Cart[] | undefined>>;
}) => {
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await newAxios.delete(`/api/v1/carts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartData((prev) => prev?.filter((cart) => cart.cartId !== id));
        } catch (e) {
            console.error("삭제 실패:", e);
        }
    };

    return (
        <ItemWrapper>
            <StlRenderContainer filePath={modelFileUrl} width="80px" height="80px" clickDisabled={true} />
            <NameContainer>
                {name} {id}
            </NameContainer>
            <MdDelete size={"1.5em"} onClick={handleDelete} style={{ cursor: "pointer" }} />
        </ItemWrapper>
    );
};

export default CartDropdown;

const ItemWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 300px;
    align-items: center;
`;

const NameContainer = styled.div`
    flex: 1;
    margin-left: 10px;
`;
