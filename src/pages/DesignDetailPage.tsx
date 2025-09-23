import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

import { Design } from "../types/DesignType";
import StlRenderContainer from "../components/specific/designDetail/StlRenderContainer";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/axiosWithUrl";
import { useCart } from "../hooks/useCart";
import getStlModelVolume from "../utils/getStlModelVolume";
import BuyDesignPopUp from "../components/specific/designDetail/BuyDesignPopUp";
import { Typography } from "../components/common/Typography";
import PersonIcon from "../assets/images/icons/person.png";
import SizeIcon from "../assets/images/icons/open_in_full.png";
import BuyIcon from "../assets/images/icons/buy.png";
import DownloadIcon from "../assets/images/icons/download-gray.png";
import getStlModelSize from "../utils/getStlModelSize";

type DesignMeasureData = {
    volume: number;
    width: number;
    height: number;
    length: number;
};

const DesignDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [design, setDesign] = useState<Design | undefined>(undefined);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
    const [selectedFileMeasureData, setSelectedFileMeasureData] = useState<DesignMeasureData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const headers: Record<string, string> = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
            try {
                const response = await newAxios.get(`/api/v1/model/user/view/${id}`, {
                    headers: headers,
                });
                let data = response.data.data;
                console.log(data);
                setDesign(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const measureModelVolume = async () => {
            if (!design) return;
            const url = design.modelFileUrls[selectedFileIndex];
            const volume = await getStlModelVolume(url);
            const { width, length, height } = await getStlModelSize(url);
            setSelectedFileMeasureData({ volume: volume, width: width, length: length, height: height });
        };
        measureModelVolume();
    }, [design, selectedFileIndex]);

    const handleDownload = async (url: string, filename: string) => {
        const file = await fetch(url);
        const blob = await file.blob();
        const objectUrl = URL.createObjectURL(blob);
        const newName = filename + ".stl";
        const link = document.createElement("a");
        link.download = newName;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (!design) {
        return <div>Loading...</div>;
    }

    const { author, name, description, price, downloadCount, modelFileUrls, purchaseAvailability, category, downloadable } = design;
    const handleButtonClick = async () => {
        if (!purchaseAvailability) {
            if (!downloadable) {
                navigate("/print-order");
                return;
            }
            handleDownload(modelFileUrls[0], name); // todo
            return;
        }
        if (price == "0") {
            try {
                const response = await newAxios.post(
                    `/api/v1/model/user/purchase/${id}`,
                    { modelId: id },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        },
                    }
                );
                if (response.data.status === 200 || response.data.status === 201) {
                    navigate("/my-design");
                } else {
                    alert(response.data.message);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            //handlePurchase();
            setIsOpen(true);
        }
    };

    return (
        <PageWrapper>
            {isOpen && <BuyDesignPopUp handleOnClick={setIsOpen} name={name} price={+price} filePath={modelFileUrls[0]} id={id} />}
            <OutlineContainer>
                <RowContainer>
                    {modelFileUrls ? <StlRenderContainer filePath={modelFileUrls[selectedFileIndex]} width="548px" height="439px" /> : <div style={{ width: "500px", height: "500px" }} />}
                    <OutlineContentContainer>
                        <Typography variant="heading.h6">{name}</Typography>
                        <DetailTable>
                            <tbody>
                                <tr>
                                    <DetailTitle>
                                        <IconContainer src={PersonIcon} />
                                        작가
                                    </DetailTitle>
                                    <td>{author.name}</td>
                                </tr>
                                <tr>
                                    <DetailTitle>
                                        <IconContainer src={SizeIcon} />
                                        현재 모델 크기
                                    </DetailTitle>
                                    <td>
                                        {selectedFileMeasureData?.volume}mm³ ({selectedFileMeasureData?.width}mm x {selectedFileMeasureData?.length}mm x {selectedFileMeasureData?.height}mm)
                                    </td>
                                </tr>
                                <tr>
                                    <DetailTitle>
                                        <IconContainer src={BuyIcon} />
                                        판매량
                                    </DetailTitle>
                                    <td>{downloadCount}</td>
                                </tr>
                                <tr>
                                    <DetailTitle>
                                        <IconContainer src={DownloadIcon} />
                                        다운로드
                                    </DetailTitle>
                                    <td>{downloadable ? "가능" : "불가능"}</td>
                                </tr>
                            </tbody>
                        </DetailTable>
                        <Price>{Math.round(+price * 1.1)}원 (VAT포함)</Price>
                        <ButtonContainer>
                            <Button onClick={handleButtonClick}>{purchaseAvailability ? "구매하기" : downloadable ? "다운로드" : "프린트하기"}</Button>
                            <Button onClick={() => addToCart(id!)}>장바구니 담기</Button>
                        </ButtonContainer>
                    </OutlineContentContainer>
                </RowContainer>
                <FilePreviewContainer>
                    {modelFileUrls.map((url, i) => {
                        return (
                            <FilePreviewBox key={i} isSelected={i === selectedFileIndex} onClick={() => setSelectedFileIndex(i)}>
                                <StlRenderContainer filePath={url} width="100%" height="100%" clickDisabled={true} />
                            </FilePreviewBox>
                        );
                    })}
                </FilePreviewContainer>
            </OutlineContainer>
            <Divider />
            <Typography variant="heading.h6">작품 소개</Typography>
            <Typography variant="body.small_r">
                <div style={{ padding: 0, marginTop: "8px" }} className="ql-editor" dangerouslySetInnerHTML={{ __html: description }} />
            </Typography>
        </PageWrapper>
    );
};

export default DesignDetailPage;

const PageWrapper = styled.div`
    width: 1120px;
    margin: 0 auto;
    padding-top: 32px;
`;

const OutlineContainer = styled.div`
    padding-bottom: 10px;
`;

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
`;

const FilePreviewContainer = styled.div`
    width: 100%;
    overflow-y: auto;
    margin-top: 28px;

    display: flex;
    gap: 20px;
`;

const FilePreviewBox = styled.div<{ isSelected: boolean }>`
    width: 180px;
    height: 140px;
    border-radius: 8px;

    border: ${({ isSelected, theme }) => (isSelected ? `1px solid ${theme.grayScale[500]}` : "none")};
`;

const Divider = styled.div`
    width: 100%;
    margin: 28px 0;
    border-bottom: 1px solid ${({ theme }) => theme.grayScale[200]};
`;

const OutlineContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: end;
`;

const DetailTable = styled.table`
    width: 100%;
    margin: 16px 0 24px 0;
    border-collapse: collapse;
`;

const DetailTitle = styled.td`
    color: ${({ theme }) => theme.text.body};

    display: flex;
    align-items: center;
    gap: 4px;
`;

const IconContainer = styled.img`
    width: 16px;
    height: 16px;
    alt: "x";
`;

const Price = styled.div`
    width: 100%;
    text-align: end;
    color: ${({ theme }) => theme.text.body};
    font-size: 19.2px;
    font-weight: bold;
    margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Button = styled.button`
    width: 548px;
    height: 40px;
    color: white;
    font-weight: 600;
    background-color: ${({ theme }) => theme.grayScale[600]};
    box-shadow: none;
    border: none;
    border-radius: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.grayScale[100]};
        color: ${({ theme }) => theme.text.body};
        border: 1.4px solid ${({ theme }) => theme.grayScale[200]};
    }

    cursor: pointer;
`;
