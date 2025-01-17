import { Company, Equipment } from "../../../types/CompanyType";
import styled from "styled-components";
import Star from "../../../assets/star.png";

type CompanyInfoProps = {
    data: Company;
    setSelectedCompany: React.Dispatch<React.SetStateAction<Company | undefined>>;
};

const CompanyInfoCard = ({ data, setSelectedCompany }: CompanyInfoProps) => {
    const checkPrintNow = () => {
        const equipments: Equipment[] = data.equipmentList;
        for (let i = 0; i < equipments.length; i++) {
            if (equipments[i].status === "Available") return true;
        }
        return false;
    };
    const isAvailable = checkPrintNow();

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
            <MaterialContainer></MaterialContainer>
            <StatusContainer>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: isAvailable ? "#4CAF50" : "#FF9800" }} />
                <div>{isAvailable ? "제작 가능" : "제작 대기"}</div>
            </StatusContainer>
            <RowGridButtonContainer>
                <Button
                    onClick={() => {
                        moveToAboutPage();
                    }}
                >
                    자세히
                </Button>
                <Button
                    onClick={() => {
                        setSelectedCompany(data);
                    }}
                >
                    선택
                </Button>
            </RowGridButtonContainer>
        </CompanyContainer>
    );
};

export default CompanyInfoCard;

const CompanyContainer = styled.div`
    width: 960px;
    height: 148px;
    margin-top: 20px;
    border: 1px solid #ececec;
    border-radius: 8px;
    padding-left: 10px;

    display: flex;
    align-items: center;

    position: relative;
`;

const CompanyImage = styled.img`
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    margin-right: 20px;
`;

const CompanyInfo = styled.div`
    width: 280px;
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
`;
