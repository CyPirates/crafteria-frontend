import styled from "styled-components";

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
    width: 200px;
    height: 300px;
    display: flex;
    flex-direction: column;
    font-size: 16px;
`

const ImageContainer = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 10px;
    background-color: #E5E5E5;
`