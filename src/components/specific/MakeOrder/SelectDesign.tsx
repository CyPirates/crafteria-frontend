import styled from "styled-components";
import SelectDesignPopUp from "./SelectDesignPopUp";
import { useState } from "react";
import getStlModelSize from "../../../utils/getStlModelSize";
import { ModelFile } from "../../../types/FileType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { Company } from "../../../types/CompanyType";
import OrderInfoContainer from "./OrderInfoContainer";

type OwnProps = {
    selectedCompany: Company;
};

const SelectDesign = ({ selectedCompany }: OwnProps) => {
    const [isPop, setIsPop] = useState<boolean>(false);
    const [modelFiles, setModelFiles] = useState<ModelFile[]>([]);
    const [address, setAddress] = useState<string>("");

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
    return (
        <>
            <Step>
                <StepName>도면 선택</StepName>
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
                <OrderInfoContainer setUserAddress={setAddress} company={selectedCompany} />
            </Step>
        </>
    );
};

export default SelectDesign;

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
