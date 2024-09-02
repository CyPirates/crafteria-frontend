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
    artist: string;
    introduction: string;
};

type DesignOutlineCardProps = {
    designData: DesignData;
};
const DesignOutlineCard = ({ designData }: DesignOutlineCardProps) => {
    const {
        published,
        publishedDay,
        name,
        size,
        price,
        volume,
        id,
        filePath,
        fileType,
        profileImage,
        artist,
        introduction,
    } = designData;
    const navigate = useNavigate();
    const handleOnclick = () => {
        navigate(`/design/${id}`, {
            state: {
                publishedDay,
                name,
                size,
                price,
                volume,
                id,
                filePath,
                fileType,
                artist,
                introduction,
            },
        });
    };
    return (
        <>
            <CardWrapper onClick={handleOnclick}>
                <ImageContainer src={profileImage} alt="x" />
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
    );
};

export default DesignOutlineCard;

const CardWrapper = styled.div`
    width: 700px;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #5c5c60;
    border-radius: 10px;

    display: flex;
    align-items: center;

    position: relative;
`;

const ImageContainer = styled.img`
    width: 150px;
    aspect-ratio: 1/1;
    background-color: #e4e4e4;
    margin-right: 20px;
    object-fit: fill;
`;

const InformationContainer = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const Information = styled.div`
    color: #d2d2d2;
    font-size: 15px;
    font-weight: 600;
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
    background-color: #393939;
    border-radius: 15px;
    font-size: 11px;

    display: flex;
    justify-content: center;
    align-items: center;
`;
