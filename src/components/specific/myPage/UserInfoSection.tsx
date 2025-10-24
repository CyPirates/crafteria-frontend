import styled from "styled-components";
import { PiUserCircleLight } from "react-icons/pi";

import { bigLevelImagesArray as smallLevelImagesArray } from "../../common/LevelImagesArray";
import { Typography } from "../../common/Typography";
import { User } from "../../../types/UserType";
import { useState } from "react";
import { newAxios } from "../../../utils/axiosWithUrl";
import BlackButton from "../../common/BlackButton";

type OwnProps = {
    userData: User;
    fetchUserData: () => Promise<void>;
};

const UserInfoSection = ({ userData, fetchUserData }: OwnProps) => {
    const [isNameEdited, setIsNameEdited] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>(userData.username || userData.realname);

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

    return (
        <>
            <Typography variant="heading.h6" color="text.heading">
                내 정보
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
                        <div>{userData.totalPurchaseCount} 개</div>
                    </ColoumnContainer>
                    <VerticalLine />
                    <ColoumnContainer>
                        <div>도면 구매 총액</div>
                        <div>{userData.totalPurchaseAmount} 원</div>
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
        </>
    );
};

export default UserInfoSection;

const ContentsContainer = styled.div`
    width: 100%;
    min-height: 80px;
    margin-top: 20px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;

    display: flex;
    align-items: center;
    justify-content: start;

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
    border-left: 1px solid ${({ theme }) => theme.grayScale[200]};
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
