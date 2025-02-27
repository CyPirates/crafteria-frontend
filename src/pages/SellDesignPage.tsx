import { useState } from "react";
import styled from "styled-components";
import FileDrop from "../components/common/FileDrop";
import { DesignFormData } from "../types/DesignType";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { newAxios } from "../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";

const modules = {
    toolbar: [
        [{ size: ["small", false, "large", "huge"] }], // 글자 크기 설정
        ["bold", "italic", "underline", "strike"], // 기본 스타일 (굵기, 기울임, 밑줄, 취소선)
        [{ color: [] }, { background: [] }], // 글자색, 배경색
        [{ list: "ordered" }, { list: "bullet" }], // 리스트
        [{ align: [] }], // 정렬
        //["link", "image"],
    ],
};

const formats = ["size", "bold", "italic", "underline", "strike", "color", "background", "list", "bullet", "align"];

const SellDesignPage = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<DesignFormData>({
        name: "",
        file: null,
        widthSize: "",
        heightSize: "",
        lengthSize: "",
        price: "",
        description: "",
    });
    const [value, setValue] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleDescriptionChange = (value: string) => {
        setValue(value);
        setData((prev) => ({ ...prev, description: value }));
    };

    const handleSubmit = async () => {
        if (!data.file) {
            alert("파일을 선택해주세요.");
            return;
        }
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("modelFile", data.file);
        formData.append("widthSize", data.widthSize);
        formData.append("heightSize", data.heightSize);
        formData.append("lengthSize", data.lengthSize);
        formData.append("price", data.price);
        formData.append("description", data.description);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await newAxios.post("/api/v1/model/author/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            navigate("/my-design");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <PageWrapper>
            <Header>도면 판매</Header>

            <RowContainer>
                <InputContainer>
                    <Step>도면 선택</Step>
                    <FileDrop setData={setData} />
                </InputContainer>
                <InputContainer>
                    <Step>제목</Step>
                    <input id="name" value={data.name} onChange={handleInputChange} />
                    <Step>가격</Step>
                    <input id="price" value={data.price} onChange={handleInputChange} />
                </InputContainer>
            </RowContainer>
            <Step>설명</Step>
            <QuillWrapper>
                <ReactQuill theme="snow" value={value} onChange={handleDescriptionChange} modules={modules} formats={formats} />
            </QuillWrapper>
            <SubmitButton onClick={handleSubmit}>제출하기</SubmitButton>
        </PageWrapper>
    );
};

export default SellDesignPage;

const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Header = styled.div`
    height: 50px;
    padding: 0px 30px;
    border-bottom: 0.5px solid #dddddd;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const RowContainer = styled.div`
    margin-top: 20px;
    display: flex;
    align-items: flex-start;
    gap: 20px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Step = styled.div`
    font-size: 16px;
    font-weight: bold;
`;

const QuillWrapper = styled.div`
    width: 100%;
    .ql-container {
        height: 320px; /* 에디터 최소 높이 */
    }

    .ql-editor {
        min-height: 320px; /* 편집 영역 최소 높이 */
    }
`;
const SubmitButton = styled.div`
    width: 200px;
    height: 40px;
    margin-top: 20px;
    background-color: #000000;
    color: white;
    border-radius: 5px;
    font-size: 20px;

    cursor: pointer;
    &:hover {
        background-color: #4682b4;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;
