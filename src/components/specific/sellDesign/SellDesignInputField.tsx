import React, { useState, useRef } from "react";
import styled from "styled-components";
import { DesignFormData } from "../../../types/DesignType";
import FileUploadContainer from "./FileUploadContainer";
import InputDesignInfoContainer from "./InputDesignInfoContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";

const SellDesignInputField = () => {
    const [designFormData, setDesignFormData] = useState<DesignFormData>({
        name: "",
        description: "",
        price: "",
        minimumSize: "",
        maximumSize: "",
        file: null,
    });

    const [activeMenu, setActiveMenu] = useState<string>("title");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDesignFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setDesignFormData((prevData) => ({
            ...prevData,
            file: file,
        }));
    };

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (designFormData: DesignFormData) => {
        const formData = new FormData();
        const token = localStorage.getItem("accessToken");

        formData.append("name", designFormData.name);
        formData.append("description", designFormData.description);
        formData.append("price", designFormData.price);
        formData.append("minimumSize", designFormData.minimumSize);
        formData.append("maximumSize", designFormData.maximumSize);

        if (designFormData.file) {
            formData.append("modelFile", designFormData.file);
        }

        try {
            const response = await newAxios.post("/api/v1/model/author/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Design data submitted successfully:", response.data);
            navigate("/my-design");
            return response.data;
        } catch (error) {
            console.error("Error submitting design data:", error);
            throw error;
        }
    };

    const renderDescription = () => {
        switch (activeMenu) {
            case "title":
                return <InputDesignInfoContainer formData={designFormData} onInputChange={handleInputChange} />;
            case "fileUpload":
                return <FileUploadContainer formData={designFormData} onFileChange={handleFileChange} onUploadClick={handleFileUploadClick} fileInputRef={fileInputRef} />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <MenuContainer>
                <div>
                    <MenuItem onClick={() => setActiveMenu("title")} active={activeMenu === "title"}>
                        제목 및 내용
                    </MenuItem>
                    <MenuItem onClick={() => setActiveMenu("fileUpload")} active={activeMenu === "fileUpload"}>
                        파일 업로드
                    </MenuItem>
                </div>
                <SubmitButton onClick={() => handleSubmit(designFormData)}>제출하기</SubmitButton>
            </MenuContainer>
            <DescriptionContainer>{renderDescription()}</DescriptionContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 800px;
    display: flex;
    flex-direction: row;
`;

const MenuContainer = styled.div`
    width: 300px;
    padding: 50px;
    color: black;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: space-between; /* 추가: MenuContainer의 요소들을 상하로 분산 */
`;

const MenuItem = styled.div<{ active?: boolean }>`
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    cursor: pointer;
    text-align: center;
    position: relative;
    font-weight: ${({ active }) => (active ? "bold" : "normal")};

    &::before {
        content: "•";
        font-size: 24px;
        color: ${({ active }) => (active ? "green" : "gray")};
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
    }

    &:hover {
        background-color: #e0e0e0;
    }
`;

const SubmitButton = styled.div`
    width: 200px;
    height: 50px;
    background-color: #008ecc;
    color: white;
    border-radius: 5px;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: #4682b4;
    }
`;

const DescriptionContainer = styled.div`
    width: calc(100% - 300px);
    height: 100%;
    background-color: white;
    box-shadow: -4px 0px 4px 0px #a1a1a7;
    padding: 20px;
`;

export default SellDesignInputField;
