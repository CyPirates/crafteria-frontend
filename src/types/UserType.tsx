export type User = {
    id: string;
    oauth2Id: string;
    banned: boolean;
    banUntil: string;
    realname: string;
    role: string;
    username: string | null;
    address: string;
    totalPurchaseCount: number;
    totalPurchaseAmount: number;
    totalUploadCount: number;
    totalSalesCount: number;
    totalSalesAmount: number;
    totalPrintedCount: number;
    totalPrintedAmount: number;
    userLevel: number;
    sellerLevel: number;
};
