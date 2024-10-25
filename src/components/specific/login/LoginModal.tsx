import Modal from "react-modal";

import GoogleLoginImage from "../../../assets/googleLogin.png";
import styled from "styled-components";

Modal.setAppElement("#root");

type ModalProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const LoginModal = ({ isOpen, setIsOpen }: ModalProps) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={modalStyles} shouldCloseOnOverlayClick={true}>
            <Container>간편로그인/회원가입</Container>
            <Line />
            <ImagesContainer>
                <img src={GoogleLoginImage} onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google")} />
                <img src={GoogleLoginImage} onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google")} />
                <img src={GoogleLoginImage} onClick={() => (window.location.href = "https://api.crafteria.co.kr/oauth2/authorization/google")} />
            </ImagesContainer>
        </Modal>
    );
};

export default LoginModal;

const modalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: " rgba(0, 0, 0, 0.4)",
        width: "100%",
        height: "100vh",
        zIndex: "10",
        position: "fixed",
        top: "0",
        left: "0",
    },
    content: {
        width: "300px",
        height: "140px",
        zIndex: "150",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "10px",
        boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
        backgroundColor: "white",
        justifyContent: "center",
        overflow: "auto",
        color: "black",
    },
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Line = styled.div`
    border: 1px solid #464649;
    width: 100%;
    margin: 5px 0px 20px;
`;

const ImagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
`;
