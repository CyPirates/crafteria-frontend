import styled from "styled-components";

type DesignOutlineCardProps = {
    published: boolean;
}

const DesignOutlineCard = ({published}:DesignOutlineCardProps) => {
    return (
        <>
            <CardWrapper>
                <ImageContainer>이미지</ImageContainer>
                <InformationContainer>
                    <Information>등록일</Information>
                    <Information>도면명</Information>
                    <Information>파일용량</Information>
                    <Information>가격</Information>
                    <Information>판매량</Information>
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
    background-color: #5C5C60;
    border-radius: 10px;

    display: flex;
    align-items: center;

    position: relative;
`

const ImageContainer = styled.div`
    width: 8vw;
    min-width: 128px;
    aspect-ratio: 1/1;
    background-color: #E4E4E4;
    margin-right: 20px;
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