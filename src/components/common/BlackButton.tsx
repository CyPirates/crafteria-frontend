import styled from "styled-components";

const SubmitButton = styled.div`
    width: 360px;
    height: 50px;
    background-color: #000000;
    color: white;
    border-radius: 5px;
    font-size: 25px;

    cursor: pointer;
    &:hover {
        background-color: #2c2c2c;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default SubmitButton;
