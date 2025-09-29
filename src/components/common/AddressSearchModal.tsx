import styled from "styled-components";
import DaumPostCode from "react-daum-postcode";

type ModalProps = {
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
};

const AddressSearchModal = ({ setZipcode, setAddress, handleIsOpen }: ModalProps) => {
    return (
        <ModalOverlay>
            <ModalContainer>
                <DaumPostCode
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    onComplete={(data) => {
                        setZipcode(data.zonecode);
                        setAddress(data.address);
                        handleIsOpen();
                    }}
                />
            </ModalContainer>
        </ModalOverlay>
    );
};

export default AddressSearchModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure the modal is on top of other content */
`;

const ModalContainer = styled.div`
    width: 500px;
    height: 500px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;
