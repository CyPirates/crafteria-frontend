import { useEffect, useState } from "react";
import styled from "styled-components";
import { Address, User } from "../types/UserType";
import { newAxios } from "../utils/axiosWithUrl";
import { PiUserCircleLight } from "react-icons/pi";

import { bigLevelImagesArray as levelImagesArray, smallLevelImagesArray } from "../components/common/LevelImagesArray";
import BlackButton from "../components/common/BlackButton";
import { Typography } from "../components/common/Typography";

const MyPage = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [isNameEdited, setIsNameEdited] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");

    const [addressEditMode, setAddressEditMode] = useState<boolean>(false);

    const fetchUserData = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await newAxios.get("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data.data;
            setUserData(data);
            console.log(data);
            setNewName(data.username || data.realname);
        } catch (e) {
            console.log(e);
        }
    };
    const postUserData = async () => {
        const token = localStorage.getItem("accessToken");

        try {
            const response = await newAxios.patch(
                `/api/v1/users/me`,
                { username: newName, realname: userData?.realname, addresses: userData?.addresses },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (e) {
            console.log(e);
        }
    };
    const handleNameEditButtonClick = async () => {
        if (isNameEdited) {
            if (newName.trim().length === 0) {
                alert("이름을 입력해주세요.");
                return;
            }
            if (newName.length > 12) {
                alert("이름은 12글자를 초과할 수 없습니다.");
                return;
            }
            await postUserData();
            fetchUserData();
        }
        setIsNameEdited(!isNameEdited);
    };

    useEffect(() => {
        fetchUserData();
    }, []);
    if (!userData) return null;
    return (
        <PageWrapper>
            <Typography variant="heading.h6" color="text.heading">
                마이페이지
            </Typography>

            <ColoumnContainer>
                {userData.profileImageUrl ? <img src={userData.profileImageUrl} alt="x" /> : <PiUserCircleLight size={"12em"} />}

                {isNameEdited ? (
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={12} />
                ) : (
                    <div style={{ fontWeight: "bold" }}>{userData.username ? userData.username : userData.realname}</div>
                )}
                <div style={{ color: "#707074" }}>{userData.oauth2Id}</div>

                <BlackButton style={{ width: "60px", height: "24px", fontSize: "14px" }} onClick={handleNameEditButtonClick}>
                    <Typography variant="body.small_m">{isNameEdited ? "저장" : "이름 수정"}</Typography>
                </BlackButton>
            </ColoumnContainer>
            <div style={{ display: "flex", marginTop: "16px" }}>
                <Typography variant="body.medium_b" color="text.heading">
                    구매 현황
                </Typography>
                <GrayRoundContainer>
                    <img src={smallLevelImagesArray[userData.userLevel]} alt="x" />
                    <Typography variant="body.xs_m" color="grayScale.400">
                        LEVEL {userData.userLevel}
                    </Typography>
                </GrayRoundContainer>
            </div>
            <ContentsContainer>
                <SpaceContainer>
                    <ColoumnContainer>
                        <div>구매한 도면</div>
                        <div>{userData.totalPurchaseCount}</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>도면 구매 총액</div>
                        <div>{userData.totalPurchaseAmount}</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>프린트 의뢰</div>
                        <div>{userData.totalPrintedCount} 개</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>프린트 의뢰 총액</div>
                        <div>{userData.totalPrintedAmount} 원</div>
                    </ColoumnContainer>
                </SpaceContainer>
            </ContentsContainer>

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
            <div style={{ marginTop: "16px" }} />
            <Typography variant="body.medium_b" color="text.heading">
                배송지 관리
            </Typography>
            <ContentsContainer style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {userData.addresses.map((address, i) => {
                    return (
                        <AddressContainer>
                            <div style={{ display: "flex" }}>
                                <Typography variant="heading.h6">{address.label}</Typography>
                                {address.default && (
                                    <GrayRoundContainer>
                                        <Typography variant="body.xs_m" color="grayScale.400">
                                            기본
                                        </Typography>
                                    </GrayRoundContainer>
                                )}
                            </div>
                            <Typography variant="body.medium_m">{address.postalCode}</Typography>
                            <Typography variant="body.medium_m">
                                {address.baseAddress} {address.detailAddress}
                            </Typography>
                        </AddressContainer>
                    );
                })}
                {addressEditMode && <EditAddressContainer />}

                <LongButton onClick={() => setAddressEditMode(true)}>
                    <Typography variant="body.medium_m" color="grayScale.0">
                        배송지 추가
                    </Typography>
                </LongButton>
            </ContentsContainer>

            <div style={{ marginBottom: "16px" }} />
        </PageWrapper>
    );
};

type EditAddressPops = {
    address?: Address;
};

const EditAddressContainer = ({ address }: EditAddressPops) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [newAddress, setNewAddress] = useState<Address>(
        address || {
            id: "",
            default: false,
            label: "",
            baseAddress: "",
            detailAddress: "",
            postalCode: "",
        }
    );

    return (
        <AddressContainer>
            <RowContainer>
                <ZipcodeInput placeholder="우편번호" disabled={true} value={newAddress.postalCode} />
                <Button style={{ width: "96px", height: "32px" }} onClick={() => setIsModalOpen(true)}>
                    주소 검색
                </Button>
            </RowContainer>
            <StyledInput placeholder="도로명 주소" disabled={true} value={newAddress.baseAddress} />
            <StyledInput placeholder="상세 주소" value={newAddress.detailAddress} onChange={(e) => setNewAddress({ ...newAddress, detailAddress: e.target.value })} />
        </AddressContainer>
    );
};
export default MyPage;

const PageWrapper = styled.div`
    width: 100%;
    padding: 32px 80px;
`;
const ContentsContainer = styled.div`
    width: 1280px;
    min-height: 80px;
    margin-top: 20px;
    border: 1px solid #ececec;
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
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
    border-left: 1px solid #ececec;
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

const AddressContainer = styled.div`
    width: 1120px;
    height: 80px;
    border: 1px solid #ececec;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;

    position: relative;
`;

const LongButton = styled.div`
    width: 1120px;
    height: 40px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.grayScale[600]};

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.text.disabled};
    }
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
const RowContainer = styled.div`
    display: flex;
    width: 272px;
    margin: 4px 0;
`;

const ZipcodeInput = styled.input`
    width: 168px;
    height: 32px;
    padding-left: 12px;
    background-color: ${({ theme }) => theme.text.disabled};
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
`;
const Button = styled.button`
    background-color: ${({ theme }) => theme.grayScale[100]};
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;

    text-align: center;
    &:hover {
        background-color: #2e2e2e;
    }
`;
