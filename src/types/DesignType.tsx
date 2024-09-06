export type DesignProps = {
    id: string;
    name: string;
    description: string;
    rating: string;
    price: string;
    viewCount: string;
    downloadCount: string;
    minimumSize: string;
    maximumSize: string;
    modelFileUrl: string;
};

export type DesignFormData = {
    name: string;
    description: string;
    price: string;
    minimumSize: string;
    maximumSize: string;
    file: File | null;
};
