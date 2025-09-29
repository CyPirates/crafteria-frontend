import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { Design } from "../../../types/DesignType";
import { Typography } from "../../common/Typography";

type OwnProps = {
    handlePopUpOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleFileUpload: (urls: string[]) => Promise<void>;
};

const SelectDesignPopUp = ({ handlePopUpOpen, handleFileUpload }: OwnProps) => {
    const [purchasedDesigns, setPurchasedDesigns] = useState<Design[]>([]);
    const [onSaleDesigns, setOnSaleDesigns] = useState<Design[]>([]);
    const [isPurchasedSelected, setIsPurchasedSelected] = useState<boolean>(true);
    const [openIndividual, setOpenIndividual] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const fetchPurchasedData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await newAxios.get("/api/v1/model/user/list/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data.data);
                setPurchasedDesigns(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchOnSaleData = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await newAxios.get("/api/v1/model/author/list/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data.data);
                setOnSaleDesigns(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPurchasedData();
        fetchOnSaleData();
    }, []);

    const handleSelectAll = async (urls: string[]) => {
        await handleFileUpload(urls);
        handlePopUpOpen(false);
    };
    const handleSelectIndividual = async (selectedUrls: string[]) => {
        if (selectedUrls.length === 0) {
            alert("도면을 선택해 주세요.");
            return;
        }

        await handleFileUpload(selectedUrls);
        handlePopUpOpen(false);
    };

    return (
        <Overlay onClick={() => handlePopUpOpen(false)}>
            <PopUpContainer onClick={(e) => e.stopPropagation()}>
                <FilterContainer>
                    <Filter isActive={isPurchasedSelected} onClick={() => setIsPurchasedSelected(true)}>
                        구매한 도면
                    </Filter>
                    <Filter isActive={!isPurchasedSelected} onClick={() => setIsPurchasedSelected(false)}>
                        판매중 도면
                    </Filter>
                </FilterContainer>
                <DesignContainer>
                    {(isPurchasedSelected ? purchasedDesigns : onSaleDesigns).length === 0 ? (
                        <Typography variant="body.medium_r">해당 항목이 없습니다.</Typography>
                    ) : (
                        (isPurchasedSelected ? purchasedDesigns : onSaleDesigns).map((design, i) => {
                            if (i > 4) return null;
                            return (
                                <DesignLayout
                                    key={i}
                                    design={design}
                                    handleSelectAll={handleSelectAll}
                                    openIndividual={openIndividual}
                                    setOpenIndividual={setOpenIndividual}
                                    handleSelectIndividual={handleSelectIndividual}
                                />
                            );
                        })
                    )}
                </DesignContainer>
            </PopUpContainer>
        </Overlay>
    );
};

type DesignLayoutProps = {
    design: Design;
    handleSelectAll: (urls: string[]) => void;
    openIndividual: string | null;
    setOpenIndividual: React.Dispatch<React.SetStateAction<string | null>>;
    handleSelectIndividual: (selectedUrls: string[]) => Promise<void>;
};

const DesignLayout = ({ design, openIndividual, setOpenIndividual, handleSelectAll, handleSelectIndividual }: DesignLayoutProps) => {
    const designUrls = design.modelFileUrls;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedUrlIndex, setSelectedUrlIndex] = useState<number[]>([]);

    const handleSelectedFiles = () => {
        const selectedUrls = selectedUrlIndex.map((index) => designUrls[index]);
        handleSelectIndividual(selectedUrls);
    };

    if (openIndividual && openIndividual !== design.id) return null;
    return (
        <>
            <DesignLayoutContainer>
                <StlRenderContainer filePath={designUrls[0]} width="100px" height="100px" clickDisabled />
                <DesignInfo>
                    <Typography variant="heading.h6">{design.name}</Typography>
                    <Typography variant="body.medium_r">구성 파일: {designUrls.length}개</Typography>
                    <ButtonRow>
                        <SelectButton onClick={() => handleSelectAll(designUrls)}>전체 선택</SelectButton>
                        <SelectButton
                            onClick={() => {
                                setOpenIndividual(design.id);
                            }}
                        >
                            개별 선택
                        </SelectButton>
                    </ButtonRow>
                </DesignInfo>
            </DesignLayoutContainer>
            {openIndividual === design.id && (
                <IndividualSelectContainer>
                    <CheckboxContainer>
                        {designUrls.map((url, i) => {
                            return (
                                <Label key={i}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUrlIndex.includes(i)}
                                        onChange={() => {
                                            setSelectedUrlIndex((prev) => (prev.includes(i) ? prev.filter((item) => item !== i) : [...prev, i]));
                                        }}
                                    />
                                    <StlRenderContainer filePath={url} width="50px" height="50px" clickDisabled />
                                    <Typography variant="body.medium_r">{url.split("/")[url.split("/").length - 1]}</Typography>
                                </Label>
                            );
                        })}
                    </CheckboxContainer>
                    <div style={{ display: "flex", gap: 8 }}>
                        <SelectButton onClick={handleSelectedFiles} style={{ marginTop: 8 }}>
                            선택
                        </SelectButton>
                        <SelectButton onClick={() => setOpenIndividual(null)} style={{ marginTop: 8 }}>
                            취소
                        </SelectButton>
                    </div>
                </IndividualSelectContainer>
            )}
        </>
    );
};
export default SelectDesignPopUp;

const slideUp = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-end; // 하단에서 팝업이 올라오도록 설정
    z-index: 999; // 팝업이 다른 요소들 위에 표시되도록 설정
    color: black;
`;

const PopUpContainer = styled.div`
    width: 600px;
    height: 700px;
    background-color: white;
    border-radius: 15px 15px 0 0;
    animation: ${slideUp} 0.3s ease-out forwards;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FilterContainer = styled.div`
    width: 500px;
    height: 60px;
    border-bottom: 1px solid #707074;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 8px;

    position: sticky;
    top: 0;
    background-color: white;
    z-index: 10;
`;

const Filter = styled.div<{ isActive: boolean }>`
    height: 100%;
    text-align: center;
    color: ${({ isActive, theme }) => (isActive ? theme.grayScale[600] : theme.grayScale[500])};
    font-weight: ${({ isActive }) => (isActive ? "bold" : 300)};
    border-bottom: ${({ isActive }) => (isActive ? "2px solid #111111" : "none")};
    cursor: pointer;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;

    &:hover {
        font-weight: bold;
    }
`;

const DesignContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    overflow-y: auto;
`;

const DesignLayoutContainer = styled.div`
    width: 500px;
    margin: 20px;
    height: 120px;
    border-bottom: 1px solid gray;

    display: flex;
    align-items: center;
`;

const DesignInfo = styled.div`
    margin-left: 20px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    position: relative;
    flex: 1;
    height: 100%;
`;

const ButtonRow = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;

    display: flex;
    gap: 8px;
`;
const SelectButton = styled.div`
    width: 80px;
    height: 28px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    color: white;
    font-size: ${({ theme }) => theme.typography.body.medium_r.fontSize};
    font-weight: ${({ theme }) => theme.typography.body.medium_r.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.medium_r.lineHeight};
    border-radius: 8px;
    margin-bottom: 10px;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: ${({ theme }) => theme.grayScale[200]};
    }
`;

const IndividualSelectContainer = styled.div`
    margin-top: 8px;
    margin-left: 20px;
`;
const CheckboxContainer = styled.div`
    height: 400px;
    margin-bottom: 8px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;
const Label = styled.label`
    display: flex;
    gap: 8px;
    align-items: center;
`;
