import { useEffect, useState } from "react";
import styled from "styled-components";
import { DesignFormData } from "../../types/DesignType";
import { Typography } from "./Typography";
import UploadIcon from "../../assets/images/icons/upload.png";

type OwnProps = {
    setData: React.Dispatch<React.SetStateAction<DesignFormData>>;
};

const FileDrop = ({ setData }: OwnProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    const handleDragStart = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(true);
    };

    const handleDragEnd = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    };

    const categorizeFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const modelFiles: File[] = [];
        const imageFiles: File[] = [];
        Array.from(files).forEach((file) => {
            const lower = file.name.toLowerCase();
            if (lower.endsWith(".stl")) {
                modelFiles.push(file);
            } else if (lower.match(/\.(jpg|jpeg|png|webp)$/)) {
                imageFiles.push(file);
            }
        });

        if (modelFiles.length === 0 && imageFiles.length === 0) {
            alert("지원하지 않는 파일 형식입니다.");
            return;
        }

        setData((prev) => ({
            ...prev,
            modelFiles: [...prev.modelFiles, ...modelFiles],
            descriptionImages: [...prev.descriptionImages, ...imageFiles],
        }));
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        categorizeFiles(event.target.files);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(false);
        categorizeFiles(event.dataTransfer.files);
    };

    return (
        <Label isActive={isActive} onDragEnter={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragEnd} onDrop={handleDrop}>
            <input type="file" accept=".stl, .jpg, .jpeg, .png, .webp" multiple onChange={handleOnChange} style={{ display: "none" }} />
            <VerticalContainer>
                <img src={UploadIcon} alt="x" width="24px" height="24px" />
                <Typography variant="body.small_b" color="text.body">
                    파일 및 이미지를 드롭하거나 클릭하여 업로드하세요
                </Typography>
                <Typography variant="body.small_r" color="grayScale.400">
                    (.stl, .jpg, .png, .webp)
                </Typography>
            </VerticalContainer>
        </Label>
    );
};

export default FileDrop;

const Label = styled.label<{ isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 548px;
    height: 440px;
    border-radius: 8px;
    border: 2px dashed ${({ theme }) => theme.grayScale[200]};
    background-color: ${({ theme }) => theme.grayScale[100]};
    cursor: pointer;
`;

const VerticalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;
