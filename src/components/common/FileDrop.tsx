import { useState } from "react";
import styled from "styled-components";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import { DesignFormData } from "../../types/DesignType";
import getStlModelSize from "../../utils/getStlModelSize";

type OwnProps = {
    setData: React.Dispatch<React.SetStateAction<DesignFormData>>;
};

const FileDrop = ({ setData }: OwnProps) => {
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

    return (
        <Label isActive={isActive} onDragEnter={handleDragStart} onDragOver={handleDragOver} onDragLeave={handleDragEnd} onDrop={handleDrop}>
            <input type="file" accept=".stl" onChange={handleOnChange} style={{ display: "none" }} />
            {selectedFile ? <StlRenderContainer filePath={URL.createObjectURL(selectedFile)} width="250px" height="250px" clickDisabled={true} /> : <p>파일을 드롭하거나 클릭하여 업로드</p>}
        </Label>
    );
};

export default FileDrop;

const Label = styled.label<{ isActive: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 300px;
    border: 2px dashed ${({ isActive }) => (isActive ? "#000000" : "#999999")};
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    transition: border 0.2s ease-in-out;

    &:hover {
        border: 2px dashed #000000;
    }
`;
