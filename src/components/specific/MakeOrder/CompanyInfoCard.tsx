import { Company, Equipment } from "../../../types/CompanyType";
import styled from "styled-components";
import Star from "../../../assets/star.png";
import MaterialPopover from "./MaterialPopover";
import classifyMaterial from "../../../utils/classifyMaterial";
import convertMaterialName from "../../../utils/convertMaterialName";
import React from "react";
import convertHoursToDHM from "../../../utils/convertHoursToDHM";
import { Typography } from "../../common/Typography";
import { useNavigate } from "react-router-dom";

type CompanyInfoProps = {
    data: Company;
    renderMaterial: boolean;
    selectMode: boolean;
};

const CompanyInfoCard = ({ data, renderMaterial, selectMode }: CompanyInfoProps) => {
    const navigate = useNavigate();
    const materials = classifyMaterial(data);
    const isMaterialsEmpty = Object.keys(materials).length === 0;
    if (isMaterialsEmpty) return null;
    console.log(data);
    console.log(materials);
    // const checkPrintNow = () => {
    //     const equipments: Equipment[] = data.equipmentList;
    //     for (let i = 0; i < equipments.length; i++) {
    //         if (equipments[i].status === "Available") return true;
    //     }
    //     return false;
    // };
    // const isAvailable = checkPrintNow();
    const moveToAboutPage = () => {
        window.open(`/company-detail/${data.id}`);
    };
    return (
        <CompanyContainer>
            <CompanyImage src={data.imageFileUrl} />
            <InfoContainer>
                <Typography variant="body.medium_b" color="text.heading">
                    {data.name}
                </Typography>
                <Information>
                    <img src={Star} alt="x" />
                    <Typography variant="body.small_r">
                        {data.rating} | 대표장비: {data.representativeEquipment} | 누적 주문 수: {data.productionCount}
                    </Typography>
                </Information>
                {renderMaterial && (
                    <MaterialContainer>
                        <Typography variant="body.small_b" color="text.heading">
                            보유재료
                        </Typography>

                        <MaterialTable>
                            <tbody>
                                {Object.entries(materials).map(([key, value]) => {
                                    if (value.materials.length === 0) return null;

                                    const avgPrice = Math.round(value.totalPrice / value.materials.length);

                                    return (
                                        <tr key={key}>
                                            <td>
                                                <Typography variant="body.small_r" color="text.body">
                                                    {convertMaterialName(key)}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body.small_r" color="grayScale.400">
                                                    1cm³당
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body.small_r" color="grayScale.400">
                                                    {convertHoursToDHM(+(100 / value.printSpeed).toFixed(2))}
                                                </Typography>
                                            </td>
                                            <td>
                                                <Typography variant="body.small_r" color="grayScale.400">
                                                    {avgPrice} 원
                                                </Typography>
                                            </td>
                                            <td style={{ flex: 1 }}>
                                                <ColorContainer>
                                                    {value.materials.map((e, index) => (
                                                        <>
                                                            <MaterialPopover key={index} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                        </>
                                                    ))}
                                                </ColorContainer>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </MaterialTable>
                    </MaterialContainer>
                )}
            </InfoContainer>

            {/* <StatusContainer>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isAvailable ? "#4CAF50" : "#FF9800" }} />
                <div>{isAvailable ? "제작 가능" : "제작 대기"}</div>
            </StatusContainer> */}
            <RowGridButtonContainer>
                {/* <Button
                    onClick={() => {
                        moveToAboutPage();
                    }}
                >
                    자세히
                </Button> */}
                {selectMode && (
                    <Button
                        onClick={() => {
                            navigate(`/print-order?company=${data.id}`);
                        }}
                    >
                        선택
                    </Button>
                )}
            </RowGridButtonContainer>
        </CompanyContainer>
    );
};

export default CompanyInfoCard;

const CompanyContainer = styled.div`
    width: 1280px;
    height: auto;
    margin-top: 16px;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding: 16px;

    display: flex;
    align-items: center;

    position: relative;
`;

const CompanyImage = styled.img`
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 20px;
`;

const InfoContainer = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Information = styled.div`
    display: flex;
    align-items: center;

    > img {
        width: 14px;
        height: 14px;
        object-fit: cover;
        margin-right: 4px;
    }

    color: ${({ theme }) => theme.grayScale[400]};
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    position: absolute;
    top: 10px;
    right: 10px;
`;

const RowGridButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    position: absolute;
    top: 10px;
    right: 10px;
`;
const Button = styled.div`
    width: 80px;
    height: 28px;
    background-color: #000000;
    color: #ffffff;
    border-radius: 8px;
    font-size: 16px;

    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.primaryColor.blue1};
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MaterialContainer = styled.div`
    width: 1192px;
    border-radius: 8px;
    padding: 12px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const MaterialTable = styled.table`
    border-collapse: collapse;
    font-size: 12px;
    text-align: start;
    margin-top: 8px;

    table-layout: auto;
    width: 100%;

    td {
        white-space: nowrap;
        padding: 0 8px 4px 0;
    }

    /* 마지막 컬럼은 flexible */
    td:last-child {
        width: 100%;
    }
`;

const ColorContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: start;
`;
