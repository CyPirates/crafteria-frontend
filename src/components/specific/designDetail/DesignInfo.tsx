import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { newAxios } from "../../../utils/axiosWithUrl";

type DesignInfoProps = {
    name: string;
    artist: string;
    price: string;
    volume: string;
    size: { width: string; length: string; height: string };
    id: string | undefined;
    isPurchased: boolean;
    handleOnClick: React.Dispatch<React.SetStateAction<boolean>>;
};

const DesignInfo = ({ name, artist, price, volume, size, id, isPurchased, handleOnClick }: DesignInfoProps) => {
    const navigate = useNavigate();
    const handleAddCart = async (id: any) => {
        const data = {
            manufacturerId: 0,
            modelId: id,
        };

        try {
            const response = await newAxios.post("/api/v1/carts/addModel", data, { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
            console.log(response.data);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <InfoContainer>
            <Title>{name}</Title>
            <ArtistName>작가: {artist}</ArtistName>
            <DetailContainer>
                <Detail>
                    <DetailTitle>가격</DetailTitle>
                    <DetailContent>{price}원</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>판매량</DetailTitle>
                    <DetailContent>{volume}</DetailContent>
                </Detail>
                <Detail>
                    <DetailTitle>모델 크기</DetailTitle>
                    <DetailContent>
                        {size.width} x {size.length} x {size.height} mm
                    </DetailContent>
                </Detail>
            </DetailContainer>
            <ButtonContainer>
                <Button
                    onClick={() => {
                        if (isPurchased) return;
                        handleOnClick(true);
                    }}
                >
                    {isPurchased ? "구매완료" : "구매하기"}
                </Button>
                <Button onClick={() => handleAddCart(id)}>장바구니 담기</Button>
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
    border-bottom: 1px solid #464649;
    margin-bottom: 10px;
`;

const DetailContainer = styled.div`
    flex: 1;
`;

const Detail = styled.div`
    font-size: 20px;
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
    width: 248px;
    height: 40px;
    color: white;
    font-weight: 600;
    background-color: #000000;
    box-shadow: none;
    border: none;
    border-radius: 8px;

    cursor: pointer;
`;
