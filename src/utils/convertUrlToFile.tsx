const convertURLToFile = async (url: string, index: number) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const filename = `file_${index}.stl`;
        return new File([blob], filename, { type: blob.type });
    } catch (error) {
        console.error("파일 변환 실패:", error);
        return null;
    }
};

export default convertURLToFile;
