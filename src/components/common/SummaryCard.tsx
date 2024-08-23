import styled from "styled-components";

//TODO: 내용물들 props처리, 누르면 세부정보로 라우팅

const SummaryCard: React.FC = () => {
    return(
        <>
        <CardContainer>
        <ImageContainer></ImageContainer>
        <div>asdf</div>
        <div>asdf</div>
        <div>asdf</div>
        <div>asdf</div>
        <div>asdf</div>
        </CardContainer>
        
        </>
    )
}

export default SummaryCard;

const CardContainer = styled.div`
    width: 10vw;
    height: auto;
    margin-bottom: 1vw;
    display: flex;
    flex-direction: column;
    font-size: 16px;
`

const ImageContainer = styled.div`
    width: 10vw;
    height: 10vw;
    border-radius: 10px;
    background-color: #E5E5E5;
`

