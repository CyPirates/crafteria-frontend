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
    technologyId: number | string;
};

export type FetchedOrder = {
    orderId: string;
    userId: string;
    manufacturerId: string;
    purchasePrice: string;
    status: string;
    modelFileUrls: string[];
    deliveryAddress: string;
    recipientName: string;
    recipientEmail: string;
    specialRequest: string;
    orderItems: OrderItems[];
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
    technologyId: string;

    //for datagrid
    volume?: number;
    time?: number;
    price?: number;
    materialPrice?: number;
};
