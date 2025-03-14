import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import styled from "styled-components";
import { Design } from "../../types/DesignType";
import { newAxios } from "../../utils/axiosWithUrl";
import { useState, useEffect } from "react";
import { Company } from "../../types/CompanyType";

type OwnProps = {
    id: string;
    resultType: string;
};

const SearchResultCard = ({ id, resultType }: OwnProps) => {
    const navigate = useNavigate();
    const [modelData, setModelData] = useState<Design | undefined>(undefined);
    const [manufacturerData, setManufacturerData] = useState<Company | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true); // Added loading state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const url = resultType === "model" ? `/api/v1/model/user/view/${id}` : `/api/v1/manufacturers/${id}`;
            try {
                const response = await newAxios.get(url);
                if (resultType === "model") {
                    setModelData(response.data.data);
                } else {
                    setManufacturerData(response.data.data);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, resultType]);

    // added conditional rendering
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCardClick = () => {
        if (resultType === "model") {
            navigate(`/design/${id}`);
        } else if (resultType === "manufacturer") {
            navigate(`/company-detail/${id}`);
        }
    };

    return (
        <>
            <StyledCard onClick={handleCardClick}>
                {resultType === "model" && modelData ? (
                    <StlRenderContainer filePath={modelData.modelFileUrl} width="230px" height="150px" clickDisabled={true} />
                ) : resultType === "manufacturer" && manufacturerData ? (
                    <img src={manufacturerData.imageFileUrl} alt={manufacturerData.name} />
                ) : (
                    <div>No Data</div>
                )}
                <Card.Body>
                    <Card.Title>{resultType === "model" && modelData ? modelData.name : resultType === "manufacturer" && manufacturerData ? manufacturerData.name : "No Name"}</Card.Title>
                    <Card.Text>
                        {resultType === "model" && modelData && (
                            <>
                                <DetailText>가격: {modelData.price}원</DetailText>
                                <DetailText>
                                    크기: {modelData.widthSize} x {modelData.lengthSize} x {modelData.heightSize}(mm)
                                </DetailText>
                                <DetailText>판매량: {modelData.downloadCount}</DetailText>
                                <DetailText>조회수: {modelData.viewCount}</DetailText>
                            </>
                        )}
                        {resultType === "manufacturer" && manufacturerData && (
                            <>
                                <DetailText>제조 수 : {manufacturerData.equipmentList.length}</DetailText>
                                <DetailText>주소: {manufacturerData.address}</DetailText>
                                <DetailText>평점: {manufacturerData.rating}</DetailText>
                            </>
                        )}
                    </Card.Text>
                </Card.Body>
            </StyledCard>
        </>
    );
};

export default SearchResultCard;

const StyledCard = styled(Card)`
    width: 248px;
    height: auto;
    color: black;
    margin-bottom: 4vw;
    padding-top: 10px;

    &:hover {
        cursor: pointer;
    }

    .card-img-top {
        width: 230px;
        aspect-ratio: 1.4/1;
        object-fit: cover;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
    }

    .card-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
`;
const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;
