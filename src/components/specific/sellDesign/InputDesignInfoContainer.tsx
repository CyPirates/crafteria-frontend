import styled from "styled-components";

import { DesignFormData } from "../../../types/DesignType";

type ownProps = {
    formData: DesignFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const InputDesignInfoContainer: React.FC<ownProps> = ({ formData, onInputChange }) => {
    return (
        <>
            <SectionTitle>제목</SectionTitle>
            <InputField name="name" value={formData.name} onChange={onInputChange} placeholder="제목을 입력하세요" />
            <SectionTitle>내용</SectionTitle>
            <TextArea name="description" value={formData.description} onChange={onInputChange} placeholder="내용을 입력하세요" />
            <SectionTitle>가격</SectionTitle>
            <InputField name="price" value={formData.price} onChange={onInputChange} placeholder="가격을 입력하세요" />
        </>
    );
};

export default InputDesignInfoContainer;

const SectionTitle = styled.div`
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
