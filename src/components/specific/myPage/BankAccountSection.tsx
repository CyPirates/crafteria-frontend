import styled from "styled-components";
import { useState } from "react";
import { newAxios } from "../../../utils/axiosWithUrl";

import { Typography } from "../../common/Typography";
import { Address, User } from "../../../types/UserType";
import AddressSearchModal from "../../common/AddressSearchModal";
import { IoLocationSharp as LocationIcon } from "react-icons/io5";
import { bigLevelImagesArray as smallLevelImagesArray } from "../../common/LevelImagesArray";
import { BankMap } from "../../../utils/bankMap";

type OwnPrps = {
    userData: User;
    fetchUserData: () => Promise<void>;
};

const BankAccountSection = ({ userData, fetchUserData }: OwnPrps) => {
    const [bankAccountEditMode, setBankAccountEditMode] = useState<boolean>(false);

    return (
        <>
            <Typography variant="heading.h6" color="text.heading" style={{ display: "flex" }}>
                작가 정보
            </Typography>
            <div style={{ display: "flex", marginTop: "16px" }}>
                <Typography variant="body.medium_b" color="text.heading">
                    판매 현황
                </Typography>
                <GrayRoundContainer>
                    <img src={smallLevelImagesArray[userData.sellerLevel]} alt="x" />
                    <Typography variant="body.xs_m" color="grayScale.400">
                        LEVEL {userData.sellerLevel}
                    </Typography>
                </GrayRoundContainer>
            </div>
            <ContentsContainer>
                <SpaceContainer>
                    <ColoumnContainer>
                        <div>도면 판매 수</div>
                        <div>{userData.totalSalesCount}개</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>도면 판매 총액</div>
                        <div>{userData.totalSalesAmount} 원</div>
                    </ColoumnContainer>
                </SpaceContainer>
            </ContentsContainer>
            <Typography variant="body.medium_b" color="text.heading" style={{ display: "flex" }}>
                입금 계좌
            </Typography>
            <ContentsContainer style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                {!bankAccountEditMode &&
                    (userData.bankAccount ? (
                        <div style={{ width: "90%", display: "flex", gap: "12px" }}>
                            <Typography variant="body.medium_m">
                                {userData.accountType} {userData.bankAccount}
                            </Typography>
                            <Button onClick={() => setBankAccountEditMode(true)}>수정</Button>
                        </div>
                    ) : (
                        <Button
                            style={{ width: "120px", height: "32px" }}
                            onClick={() => {
                                setBankAccountEditMode(true);
                            }}
                        >
                            등록하기
                        </Button>
                    ))}
                {bankAccountEditMode && (
                    <EditBankAccountContainer
                        bankAccount={userData.bankAccount}
                        accountType={userData.accountType}
                        fetchUserData={fetchUserData}
                        setBankAccountEditMode={setBankAccountEditMode}
                        httpMethod="POST"
                    />
                )}
            </ContentsContainer>
        </>
    );
};

type EditBankAccountPops = {
    fetchUserData: () => Promise<void>;
    setBankAccountEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    bankAccount?: string;
    accountType?: string;
    httpMethod: "POST" | "PATCH";
};

const EditBankAccountContainer = ({ bankAccount, accountType, fetchUserData, setBankAccountEditMode: setEditAddressMode, httpMethod }: EditBankAccountPops) => {
    const [newAccountType, setNewAccountType] = useState<string>(accountType || "국민은행");
    const [newBankAccount, setNewBankAccount] = useState<string>(bankAccount || "");

    const handleSubmit = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await newAxios.patch(`/api/v1/users/me/bank-account`, { accountNumber: newBankAccount, accountType: newAccountType }, { headers: { Authorization: `Bearer ${token}` } });
            console.log(response);
        } catch (e) {
            console.log(e);
        }
        setEditAddressMode(false);
        fetchUserData();
    };

    return (
        <>
            <AddressContainer style={{ height: "auto", display: "flex", gap: "8px" }}>
                <Typography variant="heading.h6">계좌 등록</Typography>
                <div style={{ display: "flex", gap: "8px" }}>
                    <StyledSelect defaultValue={accountType || "국민은행"} onChange={(e) => setNewAccountType(e.target.value)}>
                        {Object.entries(BankMap).map(([key, value]) => (
                            <option>{value}</option>
                        ))}
                    </StyledSelect>
                    <StyledInput placeholder="계좌번호 ( '-' 생략 )" value={newBankAccount} onChange={(e) => setNewBankAccount(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "end", gap: "8px" }}>
                    <Button onClick={() => handleSubmit()}>저장</Button>
                    <Button onClick={() => setEditAddressMode(false)}>취소</Button>
                </div>
            </AddressContainer>
        </>
    );
};

export default BankAccountSection;

const StyledSelect = styled.select`
    width: 160px;
    height: 32px;
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;
    padding-left: 12px;
    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
`;

const ContentsContainer = styled.div`
    width: 100%;
    min-height: 80px;
    margin-bottom: 20px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: start;

    position: relative;
`;

const GrayRoundContainer = styled.div`
    width: 76px;
    height: 24px;
    margin-left: 12px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    border-radius: 30px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }
`;

const SpaceContainer = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
`;

const ColoumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const VerticalLine = styled.div`
    height: 60px;
    border-left: 1px solid ${({ theme }) => theme.grayScale[200]};
`;

const AbsoluteButton = styled.div`
    width: 48px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    border-radius: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.text.disabled};
    }
`;

const StyledInput = styled.input`
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;
    width: 100%;
    height: 32px;
    padding-left: 12px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};

    outline: none;
`;
const RowContainer = styled.div`
    display: flex;
    width: 272px;
    margin: 4px 0;
`;

const ZipcodeInput = styled.input`
    width: 168px;
    height: 32px;
    padding-left: 12px;
    margin-right: 8px;
    background-color: ${({ theme }) => theme.text.disabled};
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
`;
const Button = styled.button`
    width: 48px;
    height: 24px;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;

    background-color: ${({ theme }) => theme.grayScale[600]};
    border-radius: 8px;

    &:hover {
        background-color: ${({ theme }) => theme.text.disabled};
    }
`;

const AddressContainer = styled.div`
    width: 100%;
    height: 152px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;

    position: relative;
`;
