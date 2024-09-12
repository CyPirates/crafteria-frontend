export type OrderData = {
    manufactureId: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: string;
    deliveryAddress: string;
    quantity: string;
};

export type Order = {
    orderId: string;
    userId: string;
    purchasePrice: string;
    manufactureId: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: string;
    quantity: string;
    deliveryAddress: string;
    status: string;
    modelFileUrl: string;
};
