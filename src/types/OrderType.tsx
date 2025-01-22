export type SubmittedOrder = {
    manufactureId: string;
    purchasedPrice: string;
    status: "ORDERED";
    deliveryAddress: string;
    orderItems: OrderItems[];
    recipientName: string;
    recipentPhone: string;
    recipientEmail: string;
    specialRequest: string;
    files: string[];
};

export type OrderItems = {
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: number;
    quantity: number;
};

export type FetchedOrder = {
    orderId: string;
    userId: string;
    purchasePrice: string;
    manufacturerId: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: string;
    quantity: string;
    deliveryAddress: string;
    status: string;
    modelFileUrls: string[];
};

export type PrintOrderData = {
    fileUrl: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    magnification: number;
    quantity: number;
    materialType: string;
    color: string;
};
