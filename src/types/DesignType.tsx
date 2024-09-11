export type DesignProps = {
    id: string;
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
};

export type DesignFormData = {
    name: string;
    description: string;
    price: string;
    widthSize: string;
    lengthSize: string;
    heightSize: string;
    file: File | null;
};
