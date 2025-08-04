import { Company, Equipment } from "../../../types/CompanyType";
import styled from "styled-components";
import Star from "../../../assets/star.png";
import MaterialPopover from "./MaterialPopover";
import classifyMaterial from "../../../utils/classifyMaterial";
import convertMaterialName from "../../../utils/convertMaterialName";
import React from "react";
import convertHoursToDHM from "../../../utils/convertHoursToDHM";

type CompanyInfoProps = {
    data: Company;
    setSelectedCompany?: React.Dispatch<React.SetStateAction<Company | undefined>>;
};

const CompanyInfoCard = ({ data, setSelectedCompany }: CompanyInfoProps) => {
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
            <CompanyInfo>
                <NameAndRating>
                    <CompanyName>{data.name}</CompanyName>
                    <Rating>
                        <img src={Star} alt="x" />
                        {data.rating}
                    </Rating>
                </NameAndRating>
                <Contents>{data.introduction}</Contents>
                <Contents>대표 장비: {data.representativeEquipment}</Contents>
                <Contents>누적 주문 수: {data.productionCount}</Contents>
            </CompanyInfo>
            <Divider />
            <MaterialContainer>
                <MaterialTable>
                    <thead>
                        <tr>
                            <th>보유 재료</th>
                            <th>1cm³당 시간</th>
                            <th>1cm³당 평균가격</th>
                            <th>색상</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(materials).map(([key, value]) => {
                            if (value.materials.length === 0) return null;

                            const avgPrice = Math.round(value.totalPrice / value.materials.length);

                            return (
                                <tr key={key}>
                                    <td>{convertMaterialName(key)}</td>
                                    <td>{convertHoursToDHM(+(100 / value.printSpeed).toFixed(2))}</td>
                                    <td>{avgPrice} 원</td>
                                    <td>
                                        <ColorContainer>
                                            {value.materials.map((e, index) => (
                                                <>
                                                    <MaterialPopover key={index} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 5} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 10} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
                                                    <MaterialPopover key={index * 15} color={e.colorValue} imgUrl={e.imageUrl} price={e.pricePerHour} />
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
                {setSelectedCompany ? (
                    <Button
                        onClick={() => {
                            setSelectedCompany(data);
                        }}
                    >
                        선택
                    </Button>
                ) : null}
            </RowGridButtonContainer>
        </CompanyContainer>
    );
};

export default CompanyInfoCard;

const CompanyContainer = styled.div`
    width: 1260px;
    height: 200px;
    margin-top: 20px;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding-left: 10px;

    display: flex;
    align-items: center;

    position: relative;
`;

const CompanyImage = styled.img`
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 20px;
`;

const CompanyInfo = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const NameAndRating = styled.div`
    display: flex;
    align-items: center;
`;
const CompanyName = styled.div`
    font-size: 20px;
    font-weight: 600;
`;
const Contents = styled.div`
    font-size: 12px;
    font-weight: 600;
`;
const Rating = styled.div`
    margin-left: 8px;
    color: #e54444;
    font-size: 20px;
    img {
        width: 16px;
        height: 16px;
        object-fit: cover;
        margin-right: 4px;
    }
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
    bottom: 10px;
    right: 10px;
`;
const Button = styled.div`
    width: 80px;
    height: 28px;
    background-color: #000000;
    color: #ffffff;
    border-radius: 4px;
    font-size: 16px;

    cursor: pointer;
    &:hover {
        background-color: #4682b4;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Divider = styled.div`
    height: 100%;
    border-left: 1px solid #ececec;
`;

const MaterialContainer = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const MaterialTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    text-align: center;

    th,
    td {
        border: 1px solid #ececec;
        padding: 8px;
    }

    th {
        background-color: #f9f9f9;
        font-weight: bold;
    }
`;

const ColorContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
`;
