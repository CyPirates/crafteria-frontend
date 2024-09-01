import styled from "styled-components";

const SellDesignInputField = () => {
    return (
        <>
            <Container>
                <MenuContainer>asd</MenuContainer>
                <DescriptionContainer></DescriptionContainer>
            </Container>
        </>
    );
};

export default SellDesignInputField;

const Container = styled.div`
    width: 100%;
    height: calc(100% - 50px);

    display: flex;
    flex-direction: row;
`;

const MenuContainer = styled.div`
    width: 300px;
    padding: 50px;
    color: black;

    display: flex;
    justify-content: center;
`;

const DescriptionContainer = styled.div`
    width: calc(100% - 300px);
    height: 100%;
    background-color: white;
    //border-left: solid 3px ;
    box-shadow: -4px 0px 4px 0px #a1a1a7;
`;
