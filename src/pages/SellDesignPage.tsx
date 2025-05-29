import { useEffect, useState } from "react";
import styled from "styled-components";
import FileDrop from "../components/common/FileDrop";
import { DesignFormData } from "../types/DesignType";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { newAxios } from "../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";
import useLoginNavigation from "../hooks/useLoginNavigation";

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
    const { moveToLogin } = useLoginNavigation();
    const [data, setData] = useState<DesignFormData>({
        name: "",
        modelFile: null,
        widthSize: "",
        heightSize: "",
        lengthSize: "",
        price: "",
        description: "",
        category: "INTERIOR_DECORATION",
        downloadable: false,
    });
    const [value, setValue] = useState("");

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log("asdf");
            moveToLogin();
        }
    }, []);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleDescriptionChange = (value: string) => {
        setValue(value);
        setData((prev) => ({ ...prev, description: value }));
    };

    const handleSubmit = async () => {
        if (!data.modelFile) {
            alert("파일을 선택해주세요.");
            return;
        }
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("modelFile", data.modelFile);
        formData.append("widthSize", data.widthSize);
        formData.append("heightSize", data.heightSize);
        formData.append("lengthSize", data.lengthSize);
        formData.append("price", data.price);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("downloadable", data.downloadable ? "true" : "false");

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
            <Title>도면 판매</Title>

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
                    <Step>카테고리</Step>
                    <select onChange={(e) => setData((prev) => ({ ...prev, category: e.target.value }))} defaultValue={"INTERIOR_DECORATION"}>
                        <option value={"INTERIOR_DECORATION"}>인테리어 & 장식용</option>
                        <option value={"PLANTER_GARDENING"}>플랜테리어 / 정원용</option>
                        <option value={"STORAGE_ORGANIZATION"}>보관 & 정리용</option>
                        <option value={"GIFTS_SOUVENIRS"}>선물 & 기념품</option>
                        <option value={"TOOLS_FUNCTIONALITY"}>도구 & 기능성</option>
                        <option value={"HOBBIES_PLAY"}>취미 & 놀이</option>
                        <option value={"COMMERCIAL_BRANDING"}>상업/브랜딩</option>
                    </select>
                    <Step>다운로드 가능</Step>
                    <input id="downloadable" type="checkbox" checked={data.downloadable} onChange={(e) => setData((prev) => ({ ...prev, downloadable: e.target.checked }))} />
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

const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
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
    align-items: start;
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
