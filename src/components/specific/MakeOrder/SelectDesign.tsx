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
    const classifiedMaterials = useMemo(() => classifyMaterial(selectedCompany.technologies), []);

    return (
        <>
            <Container>
                <Step>
                    <StepName>도면 선택 및 결제</StepName>
                    <CompanyInfoCard data={selectedCompany} />
                    <SelectedFileDataGrid orderRows={orderRows} setOrderRows={setOrderRows} materials={classifiedMaterials} />
                </Step>
                <OrderInfoContainer printOrders={orderRows} company={selectedCompany} />
            </Container>
        </>
    );
};

export default SelectDesign;

const Container = styled.div`
    display: flex;
    flex-direction: row;
`;

const Step = styled.div`
    margin-top: 10px;

    display: flex;
    flex-direction: column;
    padding: 10px;
`;

const StepName = styled.div`
    font-size: 20px;
    font-weight: bold;
`;
