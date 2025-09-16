import { useEffect, useState } from "react";
import styled from "styled-components";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import { DesignFormData } from "../../types/DesignType";
import getStlModelSize from "../../utils/getStlModelSize";
import { Typography } from "./Typography";
import UploadIcon from "../../assets/images/icons/upload.png";

type OwnProps = {
    setData: React.Dispatch<React.SetStateAction<DesignFormData>>;
    modelFile?: File | null;
};

const FileDrop = ({ setData, modelFile }: OwnProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.name.toLowerCase().endsWith(".stl")) {
            setSelectedFile(file);
            const { width, length, height } = await getStlModelSize(file);
            setData((prev) => ({
                ...prev,
                modelFile: file,
                widthSize: width.toString(),
                lengthSize: length.toString(),
                heightSize: height.toString(),
            }));
        } else {
            alert("STL 파일만 업로드 가능합니다.");
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsActive(false);

        const file = event.dataTransfer.files[0];
        if (file && file.name.toLowerCase().endsWith(".stl")) {
            setSelectedFile(file);
        } else {
            alert("STL 파일만 업로드 가능합니다.");
        }
    };

    useEffect(() => {
        if (modelFile) {
            setSelectedFile(modelFile);
        }
    }, [modelFile]);

    return (
        <Label isActive={isActive} onDragEnter={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragEnd} onDrop={handleDrop}>
            <input type="file" accept=".stl" onChange={handleOnChange} style={{ display: "none" }} />
            {selectedFile ? (
                <StlRenderContainer filePath={URL.createObjectURL(selectedFile)} width="250px" height="250px" clickDisabled={true} />
            ) : (
                <VerticalContainer>
                    <img src={UploadIcon} alt="x" width="24px" height="24px" />
                    <Typography variant="body.small_b" color="text.body">
                        파일을 드롭하거나 클릭하여 업로드하세요
                    </Typography>
                    <Typography variant="body.small_r" color="grayScale.400">
                        (.stl)
                    </Typography>
                </VerticalContainer>
            )}
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
