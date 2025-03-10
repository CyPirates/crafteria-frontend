import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { newAxios } from "../utils/axiosWithUrl";
import { CartItem } from "../types/CartType";

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (modelId: string) => void;
    removeFromCart: (cartId: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 장바구니 데이터 가져오기
    const fetchCartData = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await newAxios.get("/api/v1/carts", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const cartData = response.data.data;

            // 모델 정보 가져오기
            const items = await Promise.all(
                cartData.map(async (cart: any) => {
                    const modelRes = await newAxios.get(`/api/v1/model/user/view/${cart.modelId}`);
                    const modelData = modelRes.data.data;
                    return {
                        cartId: cart.cartId,
                        modelId: cart.modelId,
                        modelFileUrl: modelData.modelFileUrl,
                        name: modelData.name,
                        price: modelData.price,
                    };
                })
            );

            setCartItems(items);
        } catch (e) {
            console.error("Failed to fetch cart data:", e);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    // 장바구니에 추가
    const addToCart = async (modelId: string) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await newAxios.post("/api/v1/carts/addModel", { manufacturerId: 0, modelId: modelId }, { headers: { Authorization: `Bearer ${token}` } });

            console.log(response.data);
            fetchCartData(); // 상태 업데이트
        } catch (e) {
            console.error("Failed to add to cart:", e);
        }
    };

    // 장바구니에서 제거
    const removeFromCart = async (cartId: string) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            await newAxios.delete(`/api/v1/carts/${cartId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
        } catch (e) {
            console.error("삭제 실패:", e);
        }
    };

    return <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
