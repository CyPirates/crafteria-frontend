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
    const [newAddress, setNewAddress] = useState<Address>({
        id: "",
        default: false,
        label: "",
        baseaddress: "",
        detailAddress: "",
    });
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
    const postUserData = async (editType: string) => {
        const token = localStorage.getItem("accessToken");
        if (editType === "name") {
            try {
                const response = await newAxios.patch(
                    `/api/v1/users/me`,
                    { username: newName, realname: userData?.realname, addresses: userData?.addresses },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (e) {
                console.log(e);
            }
        }
        if (editType === "address") {
            try {
                const response = await newAxios.patch(
                    `/api/v1/users/me`,
                    { username: userData?.username, realname: userData?.realname, address: newAddress },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (e) {
                console.log(e);
            }
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
            await postUserData("name");
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
                <LevelContainer>
                    <img src={smallLevelImagesArray[userData.userLevel]} alt="x" />
                    <Typography variant="body.xs_m" color="grayScale.400">
                        LEVEL {userData.userLevel}
                    </Typography>
                </LevelContainer>
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
                <LevelContainer>
                    <img src={smallLevelImagesArray[userData.sellerLevel]} alt="x" />
                    <Typography variant="body.xs_m" color="grayScale.400">
                        LEVEL {userData.sellerLevel}
                    </Typography>
                </LevelContainer>
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
                <AddressContainer>
                    <input value={newAddress.label} onChange={(e) => setNewAddress((prev) => ({ ...prev, label: e.target.value }))} />
                </AddressContainer>

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

const LevelContainer = styled.div`
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
    align-items: center;
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
