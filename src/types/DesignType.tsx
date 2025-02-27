export type DesignProps = {
    id: string;
    author: AuthorInfo;
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

type AuthorInfo = {
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
    file: File | null;
};
