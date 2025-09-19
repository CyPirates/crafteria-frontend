import { useEffect, useState } from "react";
import styled from "styled-components";
import FileDrop from "../components/common/FileDrop";
import { DesignFormData } from "../types/DesignType";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { newAxios } from "../utils/axiosWithUrl";
import { useNavigate, useSearchParams } from "react-router-dom";
import useLoginNavigation from "../hooks/useLoginNavigation";
import { Typography } from "../components/common/Typography";
import convertURLToFile from "../utils/convertUrlToFile";

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

const EditDesignPage = () => {
    const [searchParams] = useSearchParams();
    const modelId = searchParams.get("modelId");

    const navigate = useNavigate();
    const { moveToLogin } = useLoginNavigation();
    const [data, setData] = useState<DesignFormData>({
        name: "",
        modelFiles: [],
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
        const fetchData = async () => {
            try {
                const response = await newAxios.get(`/api/v1/model/user/view/${modelId}`);
                const data = response.data.data;
                if (data.author.id != localStorage.getItem("user-id")) {
                    alert("권한이 없습니다.");
                    navigate("/");
                }
                setData(data);
                const File = await convertURLToFile(data.modelFileUrl, 1);
                setData((prev) => ({ ...prev, modelFile: File }));
                console.log(response.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, []);

    if (!data) {
        return <div>loading..</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setData((prev) => ({ ...prev, [id]: value }));
    };

    const handleDescriptionChange = (value: string) => {
        setValue(value);
        setData((prev) => ({ ...prev, description: value }));
    };

    const handleSubmit = async () => {
        if (data.modelFiles.length === 0) {
            alert("파일을 선택해주세요.");
            return;
        }
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("widthSize", data.widthSize);
        formData.append("heightSize", data.heightSize);
        formData.append("lengthSize", data.lengthSize);
        formData.append("category", data.category);
        formData.append("downloadable", data.downloadable.toString());
        //formData.append("modelFiles", data.modelFiles);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await newAxios.put(`/api/v1/model/author/update/${modelId}`, formData, {
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
            <Typography variant="heading.h6">도면판매</Typography>

            <RowContainer>
                <InputContainer>
                    <FileDrop setData={setData} />
                </InputContainer>
                <InputContainer>
                    <Step>제목</Step>
                    <StyledInput id="name" value={data.name} onChange={handleInputChange} placeholder="제목을 입력해 주세요" />
                    <Step>카테고리</Step>
                    <StyledSelect onChange={(e) => setData((prev) => ({ ...prev, category: e.target.value }))} defaultValue={"INTERIOR_DECORATION"}>
                        <option value={"INTERIOR_DECORATION"}>인테리어 & 장식용</option>
                        <option value={"PLANTER_GARDENING"}>플랜테리어 / 정원용</option>
                        <option value={"STORAGE_ORGANIZATION"}>보관 & 정리용</option>
                        <option value={"GIFTS_SOUVENIRS"}>선물 & 기념품</option>
                        <option value={"TOOLS_FUNCTIONALITY"}>도구 & 기능성</option>
                        <option value={"HOBBIES_PLAY"}>취미 & 놀이</option>
                        <option value={"COMMERCIAL_BRANDING"}>상업/브랜딩</option>
                    </StyledSelect>
                    <Step>가격</Step>
                    <StyledInput id="price" value={data.price} onChange={handleInputChange} placeholder="가격을 입력해 주세요" />
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Step>다운로드 가능</Step>
                        <input id="downloadable" type="checkbox" checked={data.downloadable} onChange={(e) => setData((prev) => ({ ...prev, downloadable: e.target.checked }))} />
                    </div>
                </InputContainer>
            </RowContainer>
            <Step>작품 소개</Step>
            <QuillWrapper>
                <ReactQuill theme="snow" value={value} onChange={handleDescriptionChange} modules={modules} formats={formats} />
            </QuillWrapper>
            <SubmitButton onClick={handleSubmit}>
                <Typography variant="body.small_m" color="grayScale.0">
                    도면 수정
                </Typography>
            </SubmitButton>
        </PageWrapper>
    );
};

export default EditDesignPage;

const PageWrapper = styled.div`
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    width: 1120px;

    margin: 0 auto;
`;

const RowContainer = styled.div`
    margin: 20px 0 32px 0;
    display: flex;
    align-items: flex-start;
    gap: 20px;

    border-bottom: 1px solid ${({ theme }) => theme.grayScale[200]};
    padding-bottom: 32px;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
`;

const Step = styled.div`
    margin-bottom: 4px;
    color: ${({ theme }) => theme.text.heading};
    font-size: ${({ theme }) => theme.typography.misc.label.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.label.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.label.lineHeight};
`;

const StyledInput = styled.input`
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;
    width: 548px;
    height: 32px;
    padding-left: 12px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};

    outline: none;
`;

const QuillWrapper = styled.div`
    width: 100%;
    .ql-container {
        height: 608px; /* 에디터 최소 높이 */
    }

    .ql-editor {
        min-height: 608px; /* 편집 영역 최소 높이 */
    }
`;
const SubmitButton = styled.div`
    width: 1120px;
    height: 40px;
    margin: 32px 0 130px 0;
    background-color: ${({ theme }) => theme.grayScale[600]};
    color: white;
    border-radius: 8px;
    font-size: 20px;

    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.text.disabled};
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledSelect = styled.select`
    width: 548px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;
    padding-left: 12px;
    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
`;
