import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type DesignData = {
    published: boolean;
    publishedDay: string;
    name: string;
    size: string;
    price: number;
    volume: number;
    id: number;
    filePath: string;
    fileType: string;
    profileImage: string;
}

type DesignOutlineCardProps = {
    designData: DesignData;
}
const DesignOutlineCard = ({designData}:DesignOutlineCardProps) => {
    const { published, publishedDay, name, size, price, volume, id, filePath, fileType, profileImage } = designData;
    const navigate = useNavigate();
    const handleOnclick = () => {
        navigate(`/design/${id}`, {
            state: { publishedDay, name, size, price, volume, id, filePath, fileType }
        })
    }
    return (
        <>
            <CardWrapper onClick={handleOnclick}>
                <ImageContainer src={profileImage} alt="x"/>
                <InformationContainer>
                    <Information>{`등록일: ${publishedDay}`}</Information>
                    <Information>{`도면명: ${name}`}</Information>
                    <Information>{`파일용량: ${size}`}</Information>
                    <Information>{`가격: ${price}원`}</Information>
                    <Information>{`판매량: ${volume}`}</Information>
                </InformationContainer>
                <ButtonConatiner>
                    <Button>다운로드</Button>
                    {published && <Button>수정</Button>}
                    <Button>삭제</Button>
                </ButtonConatiner>
            </CardWrapper>
        </>
    )
}

export default DesignOutlineCard;

const CardWrapper = styled.div`
    width: 50vw;
    min-width: 800px;
    aspect-ratio: 1/0.2;
    padding: 1vw;
    margin-bottom: 20px;
    background-color: #5C5C60;
    border-radius: 10px;

    display: flex;
    align-items: center;

    position: relative;
`

const ImageContainer = styled.img`
    width: 8vw;
    min-width: 128px;
    aspect-ratio: 1/1;
    background-color: #E4E4E4;
    margin-right: 20px;
    object-fit: fill;
`

const InformationContainer = styled.div`
    height: 8vw;
    min-height: 128px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const Information = styled.div`
    color: #D2D2D2;
    font-size: 15px;
    font-weight: 600;
`

const ButtonConatiner = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;

    position: absolute;
    top: 10px;
    right: 10px;
`
const Button = styled.div`
    width: 100px;
    height: 20px;
    background-color: #393939;
    border-radius: 15px;
    font-size: 11px;

    display: flex;
    justify-content: center;
    align-items: center;
`