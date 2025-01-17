import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SelectDesignPopUp from "../components/specific/MakeOrder/SelectDesignPopUp";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import getStlModelSize from "../utils/getStlModelSize";
import useInput from "../hooks/useInput";
import { Company, Equipment } from "../types/CompanyType";
import { newAxios } from "../utils/axiosWithUrl";
import { useNavigate } from "react-router-dom";
import { ModelFile } from "../types/FileType";
import SelectCompany from "../components/specific/MakeOrder/SelectCompany";

const MakeOrderPage = () => {
    const navigate = useNavigate();
    const [modelFiles, setModelFiles] = useState<ModelFile[]>([]);
    const [isPop, setIsPop] = useState<boolean>(false);
    const [address, setAddress] = useState<string>("");
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const { value: magnification, onChange: handleMagnificationChange } = useInput("1"); // 도면 배율
    const { value: quantity, onChange: handleQuantityChange } = useInput("1"); // 출력 수량

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file); // 파일을 URL로 변환
            try {
                const modelSize = await getStlModelSize(fileUrl);
                const fileData: ModelFile = {
                    fileUrl: fileUrl,
                    widthSize: modelSize.width.toString(),
                    lengthSize: modelSize.height.toString(),
                    heightSize: modelSize.depth.toString(),
                    magnification: "1",
                    quantity: "1",
                };
                setModelFiles((prev) => [...prev, fileData]);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const token = localStorage.getItem("accessToken");

        formData.append("manufacturerId", selectedCompany!.id);
        formData.append("deliveryAddress", address);
        formData.append("recipientName", "test");
        formData.append("recipientPhone", "010-0000-0000");
        formData.append("recipientEmail", "2@naver.com");
        formData.append("specialRequest", "testing..");

        modelFiles.map(async (files) => {
            const { fileUrl, ...fileData } = files;
            const file = (await fetch(fileUrl)).blob();
            const dataWithFile = { ...fileData, modelFile: file };
            //formData.append('orderItems', dataWithFile);
        });

        // if (ModelFileUrl) {
        //     const response = await fetch(ModelFileUrl);
        //     const file = await response.blob();
        //     formData.append("modelFiles", file);
        // }

        try {
            const response = await newAxios.post("/api/v1/order/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Design data submitted successfully:", response.data);
            if (response.data.status == 200) {
                navigate("/my-page");
            }

            return response.data;
        } catch (error) {
            console.error("Error submitting design data:", error);
            throw error;
        }
    };

    return (
        <>
            <PageWrapper>
                <DesignArea>
                    <Title>주문하기</Title>
                    <SelectCompany setSelectedCompany={setSelectedCompany} />
                    <Step>
                        <StepName>1.도면 선택</StepName>
                        <RowContainer>
                            <SelectFileButton onClick={() => setIsPop(true)}>구매한 도면에서 선택</SelectFileButton>
                            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                                <SelectFileButton>파일 직접 업로드</SelectFileButton>
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                style={{ display: "none" }}
                                onChange={handleFileUpload} // 파일 선택시 호출
                            />
                        </RowContainer>

                        {modelFiles.length > 0 ? (
                            modelFiles.map((file, index) => (
                                <div key={index}>
                                    <StlRenderContainer filePath={file.fileUrl} width="150px" height="150px" />
                                    <div>
                                        크기: {file.widthSize} x {file.lengthSize} x {file.heightSize} (mm)
                                    </div>
                                    <RowContainer>
                                        <div>
                                            배율:
                                            <Input
                                                value={file.magnification}
                                                onChange={(e) => {
                                                    const newModelFiles = [...modelFiles];
                                                    newModelFiles[index].magnification = e.target.value;
                                                    setModelFiles(newModelFiles);
                                                }}
                                            />
                                            배
                                        </div>
                                        <div>
                                            수량:
                                            <Input
                                                value={file.quantity}
                                                onChange={(e) => {
                                                    const newModelFiles = [...modelFiles];
                                                    newModelFiles[index].quantity = e.target.value;
                                                    setModelFiles(newModelFiles);
                                                }}
                                            />
                                            개
                                        </div>
                                    </RowContainer>
                                </div>
                            ))
                        ) : (
                            <EmptyDesign>도면을 선택해 주세요</EmptyDesign>
                        )}

                        {isPop ? <SelectDesignPopUp handleOnClick={setIsPop} setModelFiles={setModelFiles} /> : null}
                    </Step>
                </DesignArea>
                {/* <OrderInfoContainer setUserAddress={setAddress} company={selectedCompany} handleSubmit={handleSubmit} /> */}
            </PageWrapper>
        </>
    );
};

export default MakeOrderPage;

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
    border-bottom: 1px solid #707074;
`;

const Step = styled.div`
    margin-top: 10px;

    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid #707074;
`;

const StepName = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const RowContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const SelectFileButton = styled.div`
    width: 200px;
    height: 30px;
    background-color: #000000;
    color: white;
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
