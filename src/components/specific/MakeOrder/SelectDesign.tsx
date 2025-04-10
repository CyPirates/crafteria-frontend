import styled from "styled-components";
import { useMemo, useState } from "react";
import { Company } from "../../../types/CompanyType";
import SelectedFileDataGrid from "./SelectedFileDataGrid";
import CompanyInfoCard from "./CompanyInfoCard";
import OrderInfoContainer from "./OrderInfoContainer";
import { PrintOrderData } from "../../../types/OrderType";
import classifyMaterial from "../../../utils/classifyMaterial";

type OwnProps = {
    selectedCompany: Company;
};

const SelectDesign = ({ selectedCompany }: OwnProps) => {
    const [orderRows, setOrderRows] = useState<PrintOrderData[]>([]);
    const classifiedMaterials = useMemo(() => classifyMaterial(selectedCompany), []);

    return (
        <>
            <Step>도면 선택 및 결제</Step>
            <CompanyInfoCard data={selectedCompany} />
            <MarginAndFlexRowContainer>
                <SelectedFileDataGrid orderRows={orderRows} setOrderRows={setOrderRows} materials={classifiedMaterials} />
                <OrderInfoContainer printOrders={orderRows} company={selectedCompany} />
            </MarginAndFlexRowContainer>
        </>
    );
};

export default SelectDesign;

const Step = styled.div`
    margin-top: 10px;
    width: 900px;
    display: flex;
    flex-direction: column;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
`;

const MarginAndFlexRowContainer = styled.div`
    display: flex;
    margin-top: 20px;
`;
