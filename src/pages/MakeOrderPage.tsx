import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DesignProps } from "../types/DesignType";
import SelectDesignPopUp from "../components/specific/MakeOrder/SelectDesignPopUp";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import getStlModelSize from "../utils/getStlModelSize";
import useInput from "../hooks/useInput";
import OrderInfoContainer from "../components/specific/MakeOrder/OrderInfoContainer";
import { OrderData } from "../types/OrderType";
import { Company } from "../types/CompanyType";
import { newAxios } from "../utils/axiosWithUrl";
import Star from "../assets/star.png";
import { useNavigate } from "react-router-dom";

type Size = {
    width: number;
    height: number;
    depth: number;
};

type CompanyInfoProps = {
    data: Company;
    setSelectedCompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
};

const MakeOrderPage = () => {
    const navigate = useNavigate();
    const [ModelFileUrl, setModelFileUrl] = useState<string | undefined>(undefined);
    const [isPop, setIsPop] = useState<boolean>(false);
    const [size, setSize] = useState<Size | undefined>(undefined);
    const [address, setAddress] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const [companies, setCompanies] = useState<Company[] | undefined>(undefined);
    const { value: magnification, onChange: handleMagnificationChange } = useInput("1"); // 도면 배율
    const { value: quantity, onChange: handleQuantityChange } = useInput("1"); // 출력 수량

    // 파일 선택 핸들러
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file); // 파일을 URL로 변환
            setModelFileUrl(fileUrl); // URL을 상태에 저장
        }
    };

    useEffect(() => {
        const fetchSize = async () => {
            if (ModelFileUrl) {
                try {
                    const modelSize = await getStlModelSize(ModelFileUrl);
                    setSize(modelSize);
                } catch (error) {
                    console.error("Failed to fetch model size:", error);
                }
            }
        };

        fetchSize();
    }, [ModelFileUrl]);

    const fetchCompanies = async () => {
        try {
            const response = await newAxios.get("/api/v1/manufacturers");
            console.log(response.data.data);
            setCompanies(response.data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const token = localStorage.getItem("accessToken");

        formData.append("manufacturerId", selectedCompany!.id);
        formData.append("widthSize", size!.width.toString());
        formData.append("lengthSize", size!.height.toString());
        formData.append("heightSize", size!.depth.toString());
        formData.append("magnification", magnification);
        formData.append("deliveryAddress", address);
        formData.append("quantity", quantity);

        if (ModelFileUrl) {
            const response = await fetch(ModelFileUrl);
            const file = await response.blob();
            formData.append("modelFile", file);
        }

        try {
            const response = await newAxios.post("/api/v1/order/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Design data submitted successfully:", response.data);
            if (response.data.status == 200) {
                navigate("/");
            }

            return response.data;
        } catch (error) {
            console.error("Error submitting design data:", error);
            throw error;
        }
        return;
    };

    return (
        <>
            <PageWrapper>
                <DesignArea>
                    <Title>주문하기</Title>
                    <Step>
                        <StepName>1.도면 선택</StepName>
                        {ModelFileUrl ? (
                            <>
                                <StlRenderContainer filePath={ModelFileUrl} width="200px" height="200px" />
                                <div>
                                    크기: {size?.width}mm x {size?.height}mm x {size?.depth}mm
                                </div>
                                <div>
                                    배율: <Input value={magnification} onChange={handleMagnificationChange} />배
                                </div>
                                <div>
                                    수량: <Input value={quantity} onChange={handleQuantityChange} />개
                                </div>
                            </>
                        ) : (
                            <EmptyDesign>도면을 선택해 주세요</EmptyDesign>
                        )}
                        <RowButtonContainer>
                            <Button onClick={() => setIsPop(true)}>구매한 도면에서 선택</Button>
                            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                                <Button style={{ backgroundColor: "#FF7F00" }}>파일 직접 업로드</Button>
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: "none" }}
                                onChange={handleFileUpload} // 파일 선택시 호출
                            />
                        </RowButtonContainer>
                        {isPop ? <SelectDesignPopUp handleOnClick={setIsPop} setModelFileUrl={setModelFileUrl} /> : null}
                    </Step>
                    <Step>
                        <StepName>2. 제조사 선택</StepName>
                        <Button onClick={fetchCompanies}>제조사 검색</Button>
                        {companies && companies.map((e) => <CompanyInfoContainer data={e} setSelectedCompany={setSelectedCompany} />)}
                    </Step>
                </DesignArea>
                <OrderInfoContainer setUserAddress={setAddress} company={selectedCompany} handleSubmit={handleSubmit} />
                <button onClick={() => console.log(magnification)}>d</button>
            </PageWrapper>
        </>
    );
};

export default MakeOrderPage;

const CompanyInfoContainer = ({ data, setSelectedCompany }: CompanyInfoProps) => {
    const renderStars = () => {
        return Array.from({ length: +data.rating }, (_, index) => <img key={index} src={Star} alt="star" />);
    };

    return (
        <CompanyContainer>
            <CompanyImage src={data.imageFileUrl} />
            <CompanyInfo>
                <NameAndRating>
                    <CompanyName>{data.name}</CompanyName>
                    <Rating>
                        {renderStars()} ({data.rating})
                    </Rating>
                </NameAndRating>
                <Contents>{data.introduction}</Contents>
                <Contents>대표 장비: {data.representativeEquipment}</Contents>
                <Contents>누적 주문 수: {data.productionCount}</Contents>
            </CompanyInfo>
            <SelectCompanyButtonConatiner>
                <SelectCompanyButton
                    onClick={() => {
                        setSelectedCompany(data);
                    }}
                >
                    선택
                </SelectCompanyButton>
            </SelectCompanyButtonConatiner>
        </CompanyContainer>
    );
};

const PageWrapper = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
`;

const DesignArea = styled.div`
    flex: 1;
    padding-right: 20px;
`;

const Title = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 3px solid #707074;
`;

const Step = styled.div`
    margin-top: 10px;

    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 3px solid #707074;
`;

const StepName = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const RowButtonContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const Button = styled.div`
    width: 200px;
    height: 30px;
    background-color: #008ecc;
    border-radius: 5px;
    margin-top: 10px;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #4682b4;
    }
`;

const EmptyDesign = styled.div`
    width: 200px;
    height: 200px;
    background-color: #e0e0e0;
    color: black;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const Input = styled.input`
    width: 40px;
`;

const CompanyContainer = styled.div`
    width: 650px;
    height: 100px;
    margin-bottom: 20px;
    background-color: #5c5c60;
    border-radius: 10px;
    padding-left: 10px;

    display: flex;
    align-items: center;

    position: relative;
`;

const CompanyImage = styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 20px;
`;

const CompanyInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const NameAndRating = styled.div`
    display: flex;
`;
const CompanyName = styled.div`
    font-size: 15px;
    font-weight: 600;
`;
const Contents = styled.div`
    font-size: 12px;
    font-weight: 600;
`;
const Rating = styled.div`
    margin-left: 20px;
    color: #e54444;
    font-size: 15px;
    img {
        width: 13px;
        height: 13px;
        object-fit: cover;
    }
`;

const SelectCompanyButtonConatiner = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    position: absolute;
    bottom: 10px;
    right: 10px;
`;
const SelectCompanyButton = styled.div`
    width: 50px;
    height: 20px;
    background-color: #008ecc;
    border-radius: 5px;
    font-size: 11px;

    cursor: pointer;
    &:hover {
        background-color: #4682b4;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;
