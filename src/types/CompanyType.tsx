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
    technologies: Technology[];
    unitPrice: string;
};

export type Technology = {
    technologyId: string;
    colorValue: string;
    description: string;
    imageUrl: string;
    manufacturerId: string;
    material: string;
    pricePerHour: string;
};

export type Equipment = {
    id: string;
    name: string;
    description: string;
    status: string;
    imageFileUrl: string;
    manufartureId: string;
};
