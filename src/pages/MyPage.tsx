import { useEffect, useState } from "react";
import styled from "styled-components";
import { User } from "../types/UserType";
import { newAxios } from "../utils/axiosWithUrl";
import { PiUserCircleLight } from "react-icons/pi";

import levelImagesArray from "../components/common/LevelImagesArray";
import BlackButton from "../components/common/BlackButton";

const MyPage = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [isNameEdited, setIsNameEdited] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>("");
    const [newAddress, setNewAddress] = useState<string>("");
    const userLevelImg = userData && levelImagesArray[userData.userLevel];
    const sellerLevelImg = userData && levelImagesArray[userData.sellerLevel];
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
                    { username: newName, realname: userData?.realname, address: userData?.address },
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
        <>
            <PageTitle>마이페이지</PageTitle>

            <ColoumnContainer>
                <PiUserCircleLight size={"12em"} />
                {isNameEdited ? (
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={12} />
                ) : (
                    <div style={{ fontWeight: "bold" }}>{userData.username ? userData.username : userData.realname}</div>
                )}
                <div style={{ color: "#707074" }}>{userData.oauth2Id}</div>

                <BlackButton style={{ width: "60px", height: "24px", fontSize: "14px" }} onClick={handleNameEditButtonClick}>
                    {isNameEdited ? "저장" : "수정"}
                </BlackButton>
            </ColoumnContainer>
            <Category>구매 현황</Category>
            <ContentsContainer>
                <ColoumnContainer style={{ width: "320px" }}>
                    <img src={userLevelImg} alt="x" width={"100px"} height={"100px"} />
                    <div>Lv.{userData.userLevel}</div>
                </ColoumnContainer>
                <VerticalLine />
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
                        <div>{userData.totalPrintedCount}</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>프린트 의뢰 총액</div>
                        <div>{userData.totalPrintedAmount}</div>
                    </ColoumnContainer>
                </SpaceContainer>
            </ContentsContainer>
            <Category>판매 현황</Category>
            <ContentsContainer>
                <ColoumnContainer style={{ width: "320px" }}>
                    <img src={sellerLevelImg} alt="x" width={"100px"} height={"100px"} />
                    <div>Lv.{userData.sellerLevel}</div>
                </ColoumnContainer>
                <VerticalLine />
                <SpaceContainer>
                    <ColoumnContainer>
                        <div>도면 판매 수</div>
                        <div>{userData.totalSalesCount}</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>도면 판매 총액</div>
                        <div>{userData.totalSalesAmount}</div>
                    </ColoumnContainer>
                </SpaceContainer>
            </ContentsContainer>
            <Category>기본 주소</Category>
            <ContentsContainer>
                {userData.address ? userData.address : "설정된 주소가 없습니다"}
                <EditAddressButton>수정</EditAddressButton>
            </ContentsContainer>
            <div style={{ marginBottom: "16px" }} />
        </>
    );
};

export default MyPage;

const PageTitle = styled.div`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
`;

const Category = styled.div`
    margin-top: 16px;
    font-size: 24px;
    font-weight: bold;
`;
const ContentsContainer = styled.div`
    width: 1260px;
    height: 140px;
    margin-top: 20px;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding-left: 10px;

    display: flex;
    align-items: center;
    //justify-content: space-around;

    position: relative;
`;

const SpaceContainer = styled.div`
    width: 940px;
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
    height: 90%;
    border-left: 1px solid #ececec;
`;

const EditAddressButton = styled(BlackButton)`
    width: 60px;
    height: 24px;
    font-size: 14px;

    position: absolute;
    bottom: 12px;
    right: 12px;
`;
