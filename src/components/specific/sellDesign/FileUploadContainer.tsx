import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

import { DesignFormData } from "../../../types/DesignType";
import StlRenderContainer from "../designDetail/StlRenderContainer";

type ownProps = {
    formData: DesignFormData;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadClick: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
};

const FileUploadContainer: React.FC<ownProps> = ({
    formData,
    onFileChange,
    onUploadClick,
    fileInputRef,
}) => {
    return (
        <>
            <SectionTitle>파일 업로드</SectionTitle>
            <UploadBox onClick={onUploadClick}>
                파일 선택
                <HiddenFileInput
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileChange}
                    accept=".stl"
                />
            </UploadBox>
            {formData.file && (
                <FileDetails>
                    <StlRenderContainer
                        filePath={URL.createObjectURL(formData.file)}
                        width="200px"
                        height="200px"
                    />
                    <FileName>파일명: {formData.file.name}</FileName>
                </FileDetails>
            )}
        </>
    );
};

export default FileUploadContainer;

const SectionTitle = styled.div`
    color: black;
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 20px;
`;

const UploadBox = styled.div`
    width: 180px;
    height: 50px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: white;
    background-color: #008ecc;

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
    color: black;
`;
