import { useEffect, useState } from "react";
import styled from "styled-components";
import { User } from "../types/UserType";
import { newAxios } from "../utils/axiosWithUrl";

import UserInfoSection from "../components/specific/myPage/UserInfoSection";
import ManageAddressSection from "../components/specific/myPage/ManageAddressSection";
import SideBar from "../components/specific/myPage/SideBar";
import { useParams } from "react-router-dom";
import MyOrderSection from "../components/specific/myPage/MyOrderSection";
import BankAccountSection from "../components/specific/myPage/BankAccountSection";

const MyPage = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const fetchUserData = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await newAxios.get("/api/v1/users/me", { headers: { Authorization: `Bearer ${token}` } });
            const data = response.data.data;
            setUserData(data);
            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (!userData || !id) return null;
    return (
        <PageWrapper>
            <SideBar />
            <ContentsContainer>
                <MyPageContent userData={userData} fetchUserData={fetchUserData} id={id} />
                <div style={{ marginBottom: "16px" }} />
            </ContentsContainer>
        </PageWrapper>
    );
};

type ContentProps = {
    userData: User;
    fetchUserData: () => Promise<void>;
    id: string;
};

const MyPageContent = ({ userData, fetchUserData, id }: ContentProps) => {
    switch (id) {
        case "user-info":
            return <UserInfoSection userData={userData} fetchUserData={fetchUserData} />;
        case "address":
            return <ManageAddressSection userData={userData} fetchUserData={fetchUserData} />;
        case "order":
            return <MyOrderSection />;
        case "bank-account":
            return <BankAccountSection userData={userData} fetchUserData={fetchUserData} />;
        default:
            return null;
    }
};

export default MyPage;

const PageWrapper = styled.div`
    width: 100%;
    padding: 32px 80px;
    display: flex;
`;

const ContentsContainer = styled.div`
    width: 840px;
    margin-left: 60px;
`;
