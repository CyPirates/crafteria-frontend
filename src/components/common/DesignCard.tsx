import { MdFileDownload, MdShoppingCart, MdRemoveRedEye, MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card } from "react-bootstrap";
import { Design } from "../../types/DesignType";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import categoryKeys from "../../types/Category";

const DesignCard = ({ designData }: { designData: Design }) => {
    const navigate = useNavigate();
    const { id, name, author, description, rating, price, viewCount, downloadCount, widthSize, lengthSize, heightSize, modelFileUrl, category, downloadable } = designData;

    const handleOnClick = () => {
        navigate(`/design/${id}`);
    };

    return (
        <>
            <StyledCard onClick={handleOnClick}>
                <StlRenderContainer filePath={modelFileUrl} width="230px" height="150px" clickDisabled={true} />
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        <DetailText>{author.name}</DetailText>
                        <DetailText>{categoryKeys[category]}</DetailText>
                        <div style={{ fontSize: "16px" }}>₩{+price * 1.1}</div>
                    </Card.Text>
                </Card.Body>
                <CardFooter>
                    <DetailText>
                        <MdShoppingCart /> {downloadCount}
                    </DetailText>
                    <DetailText>
                        <MdRemoveRedEye /> {viewCount}
                    </DetailText>
                    <DetailText>
                        <MdOutlineStar /> {rating}
                    </DetailText>
                </CardFooter>
            </StyledCard>
        </>
    );
};

export default DesignCard;

const StyledCard = styled(Card)`
    width: 248px;
    height: auto;
    color: black;
    margin-bottom: 4vw;
    padding-top: 10px;

    &:hover {
        //box-shadow: 5px 5px 5px black;
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

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`;

const CardFooter = styled(Card.Footer)`
    height: 36px;
    background-color: white;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DetailText = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
`;
