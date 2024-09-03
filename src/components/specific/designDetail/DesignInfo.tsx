import { useNavigate } from "react-router-dom";
import styled from "styled-components";

type DesignInfoProps = {
    name: string;
    artist: string;
    publishedDay: string;
    price: string;
    volume: string;
    size: string;
    fileType: string;
    id: string;
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
};

const DesignInfo = ({
    name,
    artist,
    publishedDay,
    price,
    volume,
    size,
    fileType,
    id,
    handleOnClick,
}: DesignInfoProps) => {
    const navigate = useNavigate();
    return (
        <InfoContainer>
            <Title>{name}</Title>
            <ArtistName>작가: {artist}</ArtistName>
            <DetailContainer>
                <Detail>
                    <DetailTitle>등록일</DetailTitle>
                    <DetailContent>{publishedDay}</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>가격</DetailTitle>
                    <DetailContent>{price}원</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>판매량</DetailTitle>
                    <DetailContent>{volume}</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>파일크기</DetailTitle>
                    <DetailContent>{size}</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>파일형식</DetailTitle>
                    <DetailContent>{fileType}</DetailContent>
                </Detail>
            </DetailContainer>
            <ButtonContainer>
                <Button
                    onClick={() => {
                        handleOnClick(true);
                    }}
                >
                    구매하기
                </Button>
                <Button>문의하기</Button>
            </ButtonContainer>
        </InfoContainer>
    );
};

export default DesignInfo;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    font-weight: bold;
    font-size: 40px;
`;

const ArtistName = styled.div`
    color: #9d9d9f;
    font-size: 15px;
    border-bottom: 5px solid #464649;
    margin-bottom: 10px;
`;

const DetailContainer = styled.div`
    flex: 1;
`;

const Detail = styled.div`
    font-size: 20px;
    color: #c0c0c0;
    display: flex;
    margin-bottom: 5px;
`;

const DetailTitle = styled.div`
    width: 100px;
    font-weight: bold;
`;

const DetailContent = styled.div`
    flex: 1;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    //margin-top: 30px;
`;

const Button = styled.button`
    width: 250px;
    height: 40px;
    color: white;
    background-color: #818181;
    box-shadow: none;
    border: none;
    border-radius: 10px;

    cursor: pointer;
`;
