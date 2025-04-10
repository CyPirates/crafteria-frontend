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
    technologies: Material[];
    printSpeedFilament: number;
    printSpeedPowder: number;
    printSpeedLiquid: number;
    [key: string]: any; // Add this line
};

export type Material = {
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
