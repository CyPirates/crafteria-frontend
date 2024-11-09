import styled from "styled-components";
import DaumPostCode from "react-daum-postcode";

import { OrderData } from "../../../types/OrderType";
import { useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { Company } from "../../../types/CompanyType";

type OrderInfoProps = {
    setUserAddress: React.Dispatch<React.SetStateAction<string>>;
    company: Company | undefined;
    handleSubmit: () => Promise<any>;
};

type ModalProps = {
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
};

const OrderInfoContainer = ({ setUserAddress, company, handleSubmit }: OrderInfoProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [zipcode, setZipcode] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const { value: detailAddress, onChange: setDetailAddress } = useInput("");

    const handleIsOpen = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        setUserAddress(address + " " + detailAddress);
    }, [detailAddress]);

    return (
        <>
            <UserArea>
                <Title>배송지 입력</Title>
                <AddressInputContainer>
                    <ZipcodeAndButton>
                        <ZipcodeInput placeholder="우편번호" disabled={true} value={zipcode} />
                        <SearchAddressButton onClick={handleIsOpen}>주소 찾기</SearchAddressButton>
                    </ZipcodeAndButton>
                    <AddressInput placeholder="도로명 주소" disabled={true} value={address} />
                    <AddressInput placeholder="상세 주소" value={detailAddress} onChange={setDetailAddress} />
                </AddressInputContainer>
                {isOpen && <Modal setZipcode={setZipcode} setAddress={setAddress} handleIsOpen={handleIsOpen} />}
                <Title>제조사 정보</Title>
                {company && (
                    <>
                        <CompanyInformation>
                            <InfoTitle>제조사 명</InfoTitle>
                            <InfoContent>{company.name}</InfoContent>
                        </CompanyInformation>
                        <CompanyInformation>
                            <InfoTitle>주소</InfoTitle>
                            <InfoContent>{company.address}</InfoContent>
                        </CompanyInformation>
                        <CompanyInformation>
                            <InfoTitle>전화번호</InfoTitle>
                            <InfoContent>{company.dialNumber}</InfoContent>
                        </CompanyInformation>
                    </>
                )}
                <Title>결제 정보</Title>
                <CompanyInformation>
                    <InfoTitle>총 가격</InfoTitle>
                    <InfoContent>0 원</InfoContent>
                </CompanyInformation>
                <SubmitButton onClick={handleSubmit}>주문하기</SubmitButton>
            </UserArea>
        </>
    );
};

const Modal = ({ setZipcode, setAddress, handleIsOpen }: ModalProps) => {
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

export default OrderInfoContainer;

const UserArea = styled.div`
    width: 500px;
    height: 800px;
    padding: 0 20px;
    //background-color: #5c5c60;
    //border-radius: 10px;
    border-left: 1px solid #707074;
    position: relative;
`;

const Title = styled.div`
    width: 100%;
    margin-top: 20px;
    font-size: 30px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
`;

const AddressInputContainer = styled.div`
    margin-top: 20px;
`;

const ZipcodeAndButton = styled.div`
    display: flex;
    gap: 20px;
`;

const ZipcodeInput = styled.input`
    width: 150px;
    height: 40px;
    font-size: 15px;
`;

const SearchAddressButton = styled.div`
    width: 100px;
    height: 40px;
    background-color: #000000;
    color: white;
    border-radius: 3px;
    margin-bottom: 10px;

    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #4682b4;
    }
`;

const AddressInput = styled.input`
    width: 400px;
    height: 40px;
    font-size: 15px;
    margin-bottom: 10px;
`;

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

const CompanyInformation = styled.div`
    display: flex;
`;
const InfoTitle = styled.div`
    font-size: 20px;
    width: 100px;
`;
const InfoContent = styled.div`
    font-size: 20px;
`;

const SubmitButton = styled.div`
    width: 460px;
    height: 50px;
    background-color: #000000;
    color: white;
    border-radius: 5px;
    font-size: 25px;

    cursor: pointer;
    &:hover {
        background-color: #4682b4;
    }
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    bottom: 20px;
`;
