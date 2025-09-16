import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { Company } from "../../../types/CompanyType";
import SelectedFileDataGrid from "./SelectedFileDataGrid";
import CompanyInfoCard from "./CompanyInfoCard";
import OrderInfoContainer from "./OrderInfoContainer";
import { PrintOrderData } from "../../../types/OrderType";
import classifyMaterial from "../../../utils/classifyMaterial";
import { Typography } from "../../common/Typography";
import { newAxios } from "../../../utils/axiosWithUrl";

type OwnProps = {
    companyId: string;
};

const SelectDesign = ({ companyId }: OwnProps) => {
    const [selectedCompany, setSelectedCompany] = useState<Company>();
    const [orderRows, setOrderRows] = useState<PrintOrderData[]>([]);
    const classifiedMaterials = useMemo(() => {
        if (selectedCompany) return classifyMaterial(selectedCompany);
        else return null;
    }, [selectedCompany]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await newAxios.get(`/api/v1/manufacturers/${companyId}`);
                console.log(response.data.data);
                setSelectedCompany(response.data.data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchCompanies();
    }, []);

    if (!selectedCompany || !classifiedMaterials) {
        return <div>loading...</div>;
    }
    return (
        <>
            <CompanyArea>
                <Typography variant="heading.h6" color="text.heading">
                    선택한 업체
                </Typography>
                <CompanyInfoCard data={selectedCompany} renderMaterial={false} selectMode={false} />
            </CompanyArea>
            <RowContainer>
                <DesignArea>
                    <Typography variant="heading.h6" color="text.heading">
                        도면 선택 및 결제
                    </Typography>

                    <SelectedFileDataGrid orderRows={orderRows} setOrderRows={setOrderRows} materials={classifiedMaterials} />
                </DesignArea>
                <OrderInfoArea>
                    <OrderInfoContainer printOrders={orderRows} company={selectedCompany} />
                </OrderInfoArea>
            </RowContainer>
        </>
    );
};

export default SelectDesign;

const CompanyArea = styled.div`
    width: 1440px;
    height: 249px;
    border-bottom: 8px solid #d0d4d9;
    padding: 0 0 0 80px;
`;

const RowContainer = styled.div`
    display: flex;
    height: 656px;
`;

const DesignArea = styled.div`
    width: 1000px;
    height: 100%;
    border-right: 8px solid #d0d4d9;
    padding: 32px 0 0 80px;
`;
const OrderInfoArea = styled.div`
    width: 432px;
    height: 100%;
    padding: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
`;
