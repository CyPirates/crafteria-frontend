import { useEffect, useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { Company } from "../types/CompanyType";
import SelectCompany from "../components/specific/MakeOrder/SelectCompany";
import SelectDesign from "../components/specific/MakeOrder/SelectDesign";
import useLoginNavigation from "../hooks/useLoginNavigation";

const MakeOrderPage = () => {
    const { moveToLogin } = useLoginNavigation();
    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(undefined);

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log("asdf");
            moveToLogin();
        }
    }, []);
    return (
        <>
            <PageWrapper>
                <DesignArea>
                    <Title>주문하기</Title>
                    {selectedCompany ? <SelectDesign selectedCompany={selectedCompany} /> : <SelectCompany setSelectedCompany={setSelectedCompany} />}
                </DesignArea>
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
