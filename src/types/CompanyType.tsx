export type Company = {
    id: string;
    name: string;
    introduction: string;
    address: string;
    dialNumber: string;
    productionCount: string;
    rating: string;
    representativeEquipment: string;
    imageFileUrl: string;
    equipmentList: Equipment[];
};

export type Equipment = {
    id: string;
    name: string;
    description: string;
    status: string;
    imageFileUrl: string;
    manufartureId: string;
};
