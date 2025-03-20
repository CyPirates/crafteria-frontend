import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

import { DesignFormData } from "../../../types/DesignType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import getStlModelSize from "../../../utils/getStlModelSize";
import { useEffect, useState } from "react";

type ownProps = {
    formData: DesignFormData;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSizesChange: React.Dispatch<React.SetStateAction<DesignFormData>>;
    onUploadClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
};

type Size = {
    width: number;
    length: number;
    height: number;
};

const FileUploadContainer: React.FC<ownProps> = ({ formData, onFileChange, handleSizesChange, onUploadClick, fileInputRef }) => {
    const [size, setSize] = useState<Size | undefined>(undefined);

    useEffect(() => {
        const fetchSize = async () => {
            if (formData.file) {
                try {
                    const modelSize = await getStlModelSize(formData.file);
                    setSize(modelSize);
                } catch (error) {
                    console.error("Failed to fetch model size:", error);
                }
            }
        };

        fetchSize();
    }, [formData.file]);

    useEffect(() => {
        if (size) {
            handleSizesChange((prev) => ({ ...prev, widthSize: size.width.toString(), heightSize: size.height.toString(), lengthSize: size.length.toString() }));
        }
    }, [size]);

    return (
        <>
            <SectionTitle>파일 업로드</SectionTitle>
            <UploadButton onClick={onUploadClick}>
                파일 선택
                <HiddenFileInput ref={fileInputRef} type="file" onChange={onFileChange} accept=".stl" />
            </UploadButton>
            {formData.file && (
                <FileDetails>
                    <StlRenderContainer filePath={URL.createObjectURL(formData.file)} width="200px" height="200px" />
                    <FileName>파일명: {formData.file.name}</FileName>
                    <ModelSize>
                        크기: {size?.width}mm x {size?.length}mm x {size?.height}mm
                    </ModelSize>
                </FileDetails>
            )}
        </>
    );
};

export default FileUploadContainer;

const SectionTitle = styled.div`
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 20px;
`;

const UploadButton = styled.div`
    width: 180px;
    height: 50px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    background-color: #008ecc;
    color: white;

    &:hover {
        background-color: #4682b4;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const FileDetails = styled.div`
    margin-top: 20px;
`;

const FileName = styled.div`
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
`;

const ModelSize = styled.div`
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
`;
