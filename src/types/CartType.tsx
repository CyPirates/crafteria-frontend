export type Cart = {
    cartId: string;
    userId: string;
    manufacturerId: string;
    modelId: string;
};

export type CartItem = {
    cartId: string;
    modelId: string;
    modelFileUrl: string;
    name: string;
    price: string;
};
