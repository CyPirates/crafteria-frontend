import React, { useState } from "react";
import styled from "styled-components";

type designFormData = {
    title: string;
    description: string;
    price: string;
    file: File | null;
}

const SellDesignInputField = () => {
    const [designFormData, setDesignFormData] = useState<designFormData>({
        title: '',
        description: '',
        price: '',
        file: null,
    });

    const [activeMenu, setActiveMenu] = useState<string>('title'); // 기본으로 'title' 메뉴를 활성화

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDesignFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(designFormData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setDesignFormData((prevData) => ({
            ...prevData,
            file: file,
        }));
    };

    const renderDescription = () => {
        switch (activeMenu) {
            case 'title':
                return <InputDesignInfoContainer formData={designFormData} onInputChange={handleInputChange} />;
            case 'fileUpload':
                return <FileUploadContainer onFileChange={handleFileChange} />;
            default:
                return null;
        }
    };

    return (
        <Container>
            <MenuContainer>
                <MenuItem 
                    onClick={() => setActiveMenu('title')} 
                    active={activeMenu === 'title'}
                >
                    제목 및 내용
                </MenuItem>
                <MenuItem 
                    onClick={() => setActiveMenu('fileUpload')} 
                    active={activeMenu === 'fileUpload'}
                >
                    파일 업로드
                </MenuItem>
            </MenuContainer>
            <DescriptionContainer>
                {renderDescription()}
            </DescriptionContainer>
        </Container>
    );
};

export default SellDesignInputField;

const InputDesignInfoContainer: React.FC<{
    formData: { title: string; description: string; price: string };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ formData, onInputChange }) => {

    return (
        <>
            <SectionTitle>제목</SectionTitle>
            <InputField 
                name="title" 
                value={formData.title} 
                onChange={onInputChange} 
                placeholder="제목을 입력하세요" 
            />
            <SectionTitle>내용</SectionTitle>
            <TextArea 
                name="description" 
                value={formData.description} 
                onChange={onInputChange} 
                placeholder="내용을 입력하세요" 
            />
            <SectionTitle>가격</SectionTitle>
            <InputField 
                name="price" 
                value={formData.price} 
                onChange={onInputChange} 
                placeholder="가격을 입력하세요" 
            />
        </>
    )
};

const FileUploadContainer: React.FC<{
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onFileChange }) => {
    return (
        <>
            <SectionTitle>파일 업로드</SectionTitle>
            <input 
                type="file" 
                onChange={onFileChange} 
            />
        </>
    );
};

const Container = styled.div`
    width: 100%;
    height: calc(100% - 50px);
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
`;

const MenuItem = styled.div<{ active?: boolean }>`
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    position: relative;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

    &::before {
        content: '•';
        font-size: 24px;
        color: ${({ active }) => (active ? 'green' : 'gray')};
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
    }

    &:hover {
        background-color: #e0e0e0;
    }
`;

const DescriptionContainer = styled.div`
    width: calc(100% - 300px);
    height: 100%;
    background-color: white;
    box-shadow: -4px 0px 4px 0px #a1a1a7;
    padding: 20px;
`;

const SectionTitle = styled.div`
    color: black;
    font-weight: bold;
    font-size: 23px;
    margin-bottom: 20px;
`;

const InputField = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    font-size: 16px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    height: 100px;
    margin-bottom: 20px;
    font-size: 16px;
`;
