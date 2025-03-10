import Dropdown from "react-bootstrap/Dropdown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { MdDelete } from "react-icons/md";
import { Badge, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "../../types/CartType";

function CartDropdown() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart(); // ✅ Context에서 데이터 가져오기

    return (
        <Dropdown>
            <Dropdown.Toggle as="div" id="dropdown-custom-toggle" style={{ cursor: "pointer" }}>
                <Badge
                    badgeContent={cartItems.length}
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

            <Dropdown.Menu style={{ minWidth: "100px" }}>
                {cartItems.length > 0 ? (
                    cartItems.map((item: CartItem, index: number) => (
                        <div key={item.cartId}>
                            <Dropdown.Item onClick={() => navigate(`/design/${item.modelId}`)}>
                                <ItemLayout modelFileUrl={item.modelFileUrl} name={item.name} cartId={item.cartId} removeFromCart={removeFromCart} />
                            </Dropdown.Item>
                            {index + 1 !== cartItems.length && <Dropdown.Divider />}
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

const ItemLayout = ({ modelFileUrl, name, cartId, removeFromCart }: { modelFileUrl: string; name: string; cartId: string; removeFromCart: (cartId: string) => void }) => {
    return (
        <ItemWrapper>
            <StlRenderContainer filePath={modelFileUrl} width="80px" height="80px" clickDisabled={true} />
            <NameContainer>{name}</NameContainer>
            <MdDelete size={"1.5em"} onClick={() => removeFromCart(cartId)} style={{ cursor: "pointer" }} />
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
