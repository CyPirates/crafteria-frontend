import { useEffect, useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { Company } from "../types/CompanyType";
import SelectCompany from "../components/specific/MakeOrder/SelectCompany";
import SelectDesign from "../components/specific/MakeOrder/SelectDesign";
import useLoginNavigation from "../hooks/useLoginNavigation";
import { useLocation } from "react-router-dom";

const MakeOrderPage = () => {
    const { moveToLogin } = useLoginNavigation();
    const { search } = useLocation();
    const id = new URLSearchParams(search).get("company");
    console.log(id + "asdf");

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log("asdf");
            moveToLogin();
        }
    }, []);
    return (
        <>
            <PageWrapper>
                <DesignArea>{id ? <SelectDesign companyId={id} /> : <SelectCompany />}</DesignArea>
            </PageWrapper>
        </>
    );
};

export default MakeOrderPage;

const PageWrapper = styled.div`
    padding-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const DesignArea = styled.div`
    flex: 1;
`;
