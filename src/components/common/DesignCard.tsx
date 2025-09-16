import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Card } from "react-bootstrap";

import { Design } from "../../types/DesignType";
import StlRenderContainer from "../specific/designDetail/StlRenderContainer";
import categoryKeys from "../../types/Category";
import EyeIcon from "../../assets/images/icons/eye.png";
import CartIcon from "../../assets/images/icons/shopping-cart-fill.png";
import BuyIcon from "../../assets/images/icons/buy.png";
import { Typography } from "./Typography";

const DesignCard = ({ designData }: { designData: Design }) => {
    const navigate = useNavigate();
    const { id, name, author, description, rating, price, viewCount, downloadCount, modelFileUrl, category, downloadable } = designData;

    const handleOnClick = () => {
        navigate(`/design/${id}`);
    };

    return (
        <>
            <StyledCard onClick={handleOnClick}>
                {modelFileUrl ? (
                    <StlRenderContainer filePath={modelFileUrl} width="244px" height="195px" clickDisabled={true} />
                ) : (
                    <div style={{ width: "244px", height: "195px", backgroundColor: "#F3F4F5", borderRadius: "8px" }} />
                )}
                <Card.Body>
                    <Card.Title>
                        {name}
                        <HeaderInfoContainer>
                            <div>
                                <img src={EyeIcon} style={{ width: "12px", height: "12px" }} alt="x" />
                                {viewCount}
                            </div>
                            <div>
                                <img src={BuyIcon} style={{ width: "12px", height: "12px" }} alt="x" />
                                {downloadCount}
                            </div>
                        </HeaderInfoContainer>
                    </Card.Title>
                    <Card.Text>
                        <div>{author.name}</div>
                        <div>{categoryKeys[category]}</div>
                        <Typography variant="body.medium_m" color="text.body">
                            ₩{Math.round(+price * 1.1)}
                        </Typography>
                    </Card.Text>
                </Card.Body>
            </StyledCard>
        </>
    );
};

export default DesignCard;

const StyledCard = styled.div`
    width: 244px;
    height: 289px;
    color: black;
    border: none;

    &:hover {
        cursor: pointer;
    }

    .card-title {
        color: ${({ theme }) => theme.text.heading};
        font-size: 15px;
        font-weight: bold;
        margin: 12px 0 4px 0;

        display: flex;
        justify-content: space-between;
    }

    .card-text {
        color: ${({ theme }) => theme.grayScale[400]};
        font-size: 13px;
        margin-bottom: 4px;
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
`;

const HeaderInfoContainer = styled.div`
    width: auto;
    height: 12px;
    display: flex;
    gap: 8px;
    justify-content: start;

    & > div {
        width: auto;
        font-size: ${({ theme }) => theme.typography.body.xs_m.fontSize};
        font-weight: ${({ theme }) => theme.typography.body.xs_m.fontWeight};
        line-height: ${({ theme }) => theme.typography.body.xs_m.lineHeight};
        color: ${({ theme }) => theme.grayScale[400]};

        display: flex;
        gap: 2px;
        align-items: center;
    }
`;
