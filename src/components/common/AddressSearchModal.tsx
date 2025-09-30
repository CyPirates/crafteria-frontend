import styled from "styled-components";
import DaumPostCode from "react-daum-postcode";

type ModalProps = {
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
    omitBackground?: boolean;
};

const AddressSearchModal = ({ setZipcode, setAddress, handleIsOpen, omitBackground }: ModalProps) => {
    const addressSearchCard = (
        <ModalContainer>
            <DaumPostCode
                style={{
                    width: "500px",
                    height: "500px",
                }}
                onComplete={(data) => {
                    setZipcode(data.zonecode);
                    setAddress(data.address);
                    handleIsOpen();
                }}
            />
        </ModalContainer>
    );
    return omitBackground ? addressSearchCard : <ModalOverlay>{addressSearchCard}</ModalOverlay>;
};

export default AddressSearchModal;

const ModalOverlay = styled.div<{ omitBackground?: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
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
