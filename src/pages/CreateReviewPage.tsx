import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { GoStarFill } from "react-icons/go";
import { MdAddPhotoAlternate } from "react-icons/md";

import { Company } from "../types/CompanyType";
import { newAxios } from "../utils/axiosWithUrl";

const CreateReviewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [companyInfo, setCompanyInfo] = useState<Company | undefined>(undefined);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState<string>("");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    let isImageArrayFull = imageFiles.length >= 5;

    useEffect(() => {
        const fetchCompanyInfo = async () => {
            try {
                const response = await newAxios.get(`/api/v1/manufacturers/${id}`);
                console.log(response.data.data);
                setCompanyInfo(response.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCompanyInfo();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        setReviewContent(value);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files; // FileList
        if (files) {
            const newFiles = Array.from(files); // FileList를 배열로 변환

            // 중복된 파일 및 5개 초과 필터링
            const filteredFiles = newFiles.filter(
                (file) => !imageFiles.some((uploadedFile) => uploadedFile.name === file.name && uploadedFile.size === file.size && uploadedFile.lastModified === file.lastModified)
            );

            // 총 파일 개수 제한 (5개 초과 시 추가 차단)
            const totalFiles = [...imageFiles, ...newFiles];
            if (totalFiles.length > 5) {
                alert("이미지는 최대 5개까지 업로드할 수 있습니다.");
                setImageFiles(totalFiles.slice(0, 5)); // 5개까지만 저장
            } else {
                setImageFiles(totalFiles);
            }
        }
    };

    const renderStar = () => {
        const result = [];
        for (let i = 1; i < 6; i++) {
            let color = i <= rating ? "#ff9900" : "gray";
            result.push(<GoStarFill size={"2em"} color={color} id={i.toString()} onClick={() => setRating(i)} />);
        }
        result.push(<div>({rating}점)</div>);
        return result;
    };

    const renderImagePreviews = () => {
        return imageFiles.map((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            return <ImagePreview key={index} src={imageUrl} alt={`Uploaded ${index}`} onClick={() => handleImageDelete(index)} />;
        });
    };

    const handleImageDelete = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        const data = new FormData();

        data.append("manufacturerId", id!);
        console.log(id);
        console.log(reviewContent);
        console.log(rating);
        console.log(imageFiles[0]);
        data.append("content", reviewContent);
        data.append("rating", rating.toString());

        imageFiles.forEach((e) => {
            data.append("imageFiles", e);
        });

        for (let [key, value] of data.entries()) {
            if (value instanceof File) {
                console.log(`Key: ${key}, File Name: ${value.name}, File Size: ${value.size} bytes`);
            } else {
                console.log(`Key: ${key}, Value: ${value}`);
            }
        }

        try {
            const response = await newAxios.post("/api/v1/reviews", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            if (response.data.status == 200) {
                navigate("/");
            } else {
                alert("다시 시도해주세요");
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            <PageWrapper>
                <Title> 제조사 리뷰 작성</Title>
                <Line />
                <CompanyContainer>
                    <CompanyImage src={companyInfo?.imageFileUrl} alt="x" />
                    <InfoAndRating>
                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>{companyInfo?.name}</div>
                        <RatingContainer>
                            <div>배송 받으신 상품 및 서비스에 대해 얼마나 만족하시나요?</div>
                            {renderStar()}
                        </RatingContainer>
                    </InfoAndRating>
                </CompanyContainer>
                <Line />
                <ContentContainer>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>상세 리뷰</div>
                    <InputField value={reviewContent} onChange={handleInputChange} placeholder="후기를 남겨주세요"></InputField>
                </ContentContainer>
                <Line />
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>사진 첨부 ({imageFiles.length}/5)</div>
                <UploadedImageContainer>
                    <input id="uploadImage" accept="image/*" multiple type="file" style={{ display: "none" }} onChange={(e) => handleFileUpload(e)} />
                    <label htmlFor="uploadImage">
                        <UploadImageButton style={{ pointerEvents: isImageArrayFull ? "none" : "auto" }}>
                            <MdAddPhotoAlternate size={"3em"} />
                        </UploadImageButton>
                    </label>
                    {renderImagePreviews()}
                </UploadedImageContainer>
                <ButtonContainer>
                    <SubmitButton onClick={() => handleSubmit()}>제출하기</SubmitButton>
                </ButtonContainer>
            </PageWrapper>
        </>
    );
};

export default CreateReviewPage;

const PageWrapper = styled.div`
    margin-top: 50px;
    /* 
    display: flex;
    flex-direction: column;
    justify-content: center; */
`;
const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
`;
const Line = styled.div`
    width: 100%;
    margin: 30px 0px;
    border-bottom: 1px solid #464649;
`;
const CompanyContainer = styled.div`
    display: flex;
`;
const CompanyImage = styled.img`
    width: 200px;
    height: 200px;
    margin-right: 30px;
    object-fit: cover;
`;
const InfoAndRating = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const RatingContainer = styled.div``;
const ContentContainer = styled.div``;

const InputField = styled.textarea`
    width: 95%;
    height: 200px;
    padding: 10px;
    margin: 20px 0px;
    font-size: 16px;
    resize: none; /* 사용자가 크기를 조절하지 못하도록 설정 */
    overflow-y: auto; /* 내용이 넘칠 경우 세로 스크롤 활성화 */
    word-wrap: break-word; /* 단어를 강제로 줄바꿈 */
    white-space: pre-wrap; /* 공백과 줄바꿈을 유지하면서 줄바꿈 지원 */
    box-sizing: border-box; /* 패딩 포함 너비 계산 */
    border: 1px solid #ccc;
    border-radius: 5px;

    &:focus {
        outline: none;
    }
`;

const UploadedImageContainer = styled.div`
    display: flex;
    align-items: center;
`;

const UploadImageButton = styled.div`
    width: 152px;
    height: 152px;
    margin: 20px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImagePreview = styled.img`
    width: 152px;
    height: 152px;
    border-radius: 4px;
    object-fit: cover; /* 이미지를 버튼 크기에 맞게 조정 */
    margin-right: 10px; /* 이미지 간 간격 */
    border: 1px solid #ccc;
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SubmitButton = styled.div`
    width: 240px;
    height: 40px;
    margin: 20px;
    background-color: black;
    color: white;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        cursor: pointer;
    }
`;
