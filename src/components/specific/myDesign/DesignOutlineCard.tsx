import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { DesignProps } from "../../../types/DesignType";
import StlRenderContainer from "../designDetail/StlRenderContainer";

type DesignOutlineCardProps = {
    designData: DesignProps;
    published: boolean;
};

const DesignOutlineCard = ({ designData, published }: DesignOutlineCardProps) => {
    const { name, widthSize, lengthSize, heightSize, price, downloadCount, modelFileUrl, id } = designData;
    const navigate = useNavigate();
    const handleOnclick = () => {
        navigate(`/design/${id}`);
    };
    return (
        <>
            <CardWrapper onClick={handleOnclick}>
                <StlRenderContainer filePath={modelFileUrl} width="150px" height="150px" clickDisabled={true} />
                <InformationContainer>
                    <Information>도면명: {name}</Information>
                    <Information>
                        모델크기: {widthSize}mm x {lengthSize}mm x {heightSize}mm
                    </Information>
                    <Information>가격: {price}원</Information>
                    <Information>판매량: {downloadCount}</Information>
                </InformationContainer>
                <ButtonConatiner>
                    <Button>다운로드</Button>
                    {published && <Button>수정</Button>}
                    <Button>삭제</Button>
                </ButtonConatiner>
            </CardWrapper>
        </>
    );
};

export default DesignOutlineCard;

const CardWrapper = styled.div`
    width: 700px;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 0.5px solid #dddddd;

    display: flex;
    align-items: center;

    position: relative;
`;

const InformationContainer = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 30px;
`;
const Information = styled.div`
    //color: #d2d2d2;
    font-size: 15px;
    font-weight: 400;
`;

const ButtonConatiner = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    position: absolute;
    top: 10px;
    right: 10px;
`;
const Button = styled.div`
    width: 100px;
    height: 20px;
    border-radius: 15px;
    border: 0.5px solid #dddddd;
    font-size: 11px;

    display: flex;
    justify-content: center;
    align-items: center;
`;
