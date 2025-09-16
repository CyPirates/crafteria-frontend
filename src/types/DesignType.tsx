export type Design = {
    id: string;
    author: Author;
    name: string;
    description: string;
    rating: string;
    price: string;
    viewCount: string;
    downloadCount: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    modelFileUrl: string;
    purchaseAvailability: boolean;
    category: DesignCategory;
    downloadable: boolean;
};

export type DesignCategory = "INTERIOR_DECORATION" | "PLANTER_GARDENING" | "STORAGE_ORGANIZATION" | "GIFTS_SOUVENIRS" | "TOOLS_FUNCTIONALITY" | "HOBBIES_PLAY" | "COMMERCIAL_BRANDING";

export type Author = {
    id: string;
    name: string;
    rating: string;
    introduction: string;
    modelCount: string;
    viewCount: string;
    profileImageUrl: string;
};

export type DesignFormData = {
    name: string;
    description: string;
    price: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    modelFile: File | null;
    category: string;
    downloadable: boolean;
};
