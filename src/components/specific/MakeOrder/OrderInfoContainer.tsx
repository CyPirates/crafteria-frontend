import styled from "styled-components";
import DaumPostCode from "react-daum-postcode";
import { OrderItems, PrintOrderData, SubmittedOrder } from "../../../types/OrderType";
import { ChangeEvent, useEffect, useState } from "react";
import useInput from "../../../hooks/useInput";
import { Company } from "../../../types/CompanyType";
import { newAxios } from "../../../utils/axiosWithUrl";
import convertURLToFile from "../../../utils/convertUrlToFile";
import initiatePortOnePayment from "../../../utils/requestPayment";
import { useNavigate } from "react-router-dom";

type OrderInfoProps = {
    printOrders: PrintOrderData[];
    company: Company;
};

type ModalProps = {
    setZipcode: React.Dispatch<React.SetStateAction<string>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleIsOpen: () => void;
};

const OrderInfoContainer = ({ printOrders, company }: OrderInfoProps) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [zipcode, setZipcode] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const { value: detailAddress, onChange: setDetailAddress } = useInput("");
    const [submittedData, setSubmittedData] = useState<SubmittedOrder>({
        manufactureId: company.id,
        purchasedPrice: "0",
        status: "ORDERED",
        deliveryAddress: "",
        orderItems: [],
        recipientName: "",
        recipentPhone: "",
        recipientEmail: "",
        specialRequest: "",
        files: [],
    });

    useEffect(() => {
        console.log(printOrders);
        const orderData: OrderItems[] = [];
        const fileUrls: string[] = [];
        let price = 0;
        printOrders.map((item) => {
            if (item.price) price += item.price;
            orderData.push({
                widthSize: item.widthSize,
                lengthSize: item.lengthSize,
                heightSize: item.heightSize,
                magnification: item.magnification,
                quantity: item.quantity,
                technologyId: item.technologyId,
            });
            fileUrls.push(item.fileUrl);
        });
        setPrice(price);
        setSubmittedData((prevData) => ({
            ...prevData,
            orderItems: orderData,
            files: fileUrls,
        }));
    }, [printOrders]);

    useEffect(() => {
        setSubmittedData((prev) => ({ ...prev, deliveryAddress: address + " " + detailAddress }));
    }, [detailAddress, address]);

    const handleIsOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const tag = e.target.id;
        setSubmittedData((prev) => ({ ...prev, [tag]: value }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append(
            "request",
            JSON.stringify({
                manufacturerId: submittedData.manufactureId,
                //must price
                purchasePrice: price,
                status: "ORDERED",
                deliveryAddress: submittedData.deliveryAddress,
                orderItems: submittedData.orderItems,
                recipientName: submittedData.recipientName,
                recipientPhone: submittedData.recipentPhone,
                recipientEmail: "example@naver.com",
                specialRequest: submittedData.specialRequest,
            })
        );

        for (let i = 0; i < submittedData.files.length; i++) {
            const file = await convertURLToFile(submittedData.files[i], i);
            if (file) formData.append("files", file);
        }

        try {
            const token = localStorage.getItem("accessToken");
            const response = await newAxios.post("/api/v1/order/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            const { paymentId, orderId } = response.data.data;
            console.log(paymentId, orderId);
            if (paymentId && orderId) {
                const isPaymentSuccess = await initiatePortOnePayment(paymentId, orderId, (price * 1.1 + 3000).toString(), "orderId");
                if (isPaymentSuccess) {
                    navigate("/my-order");
                }
            }
        } catch (e) {
            console.log(e);
        }
    };

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
                <Title>구매자 정보</Title>
                <InformationContainer>
                    <RowGrid>
                        <InfoTitle>이름</InfoTitle>
                        <InformationInput id="recipientName" onChange={handleOnchange} />
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>전화번호</InfoTitle>
                        <InformationInput id="recipentPhone" onChange={handleOnchange} />
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>요청사항</InfoTitle>
                        <InformationInput id="specialRequest" onChange={handleOnchange} />
                    </RowGrid>
                </InformationContainer>
                <Title>결제 정보</Title>
                <InformationContainer>
                    <RowGrid>
                        <InfoTitle>프린트 가격</InfoTitle>
                        <InfoContent>{price} 원</InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>부가세</InfoTitle>
                        <InfoContent>{price * 0.1} 원</InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>배송비</InfoTitle>
                        <InfoContent>3000 원</InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>총 가격</InfoTitle>
                        <InfoContent>{price * 1.1 + 3000} 원</InfoContent>
                    </RowGrid>
                </InformationContainer>
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
    width: 400px;
    min-height: 800px;
    height: 100%;
    padding: 0 20px;
    //background-color: #5c5c60;
    //border-radius: 10px;
    border-left: 1px solid #707074;
    position: relative;
`;

const Title = styled.div`
    width: 100%;
    margin: 20px 0px;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #707074;
`;

const AddressInputContainer = styled.div``;

const ZipcodeAndButton = styled.div`
    display: flex;
    gap: 20px;
`;

const ZipcodeInput = styled.input`
    width: 120px;
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
    width: 360px;
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

const InformationContainer = styled.div``;
const RowGrid = styled.div`
    display: flex;
`;
const InformationInput = styled.input`
    width: 400px;
    height: 40px;
    font-size: 15px;
    margin-bottom: 10px;
`;
const InfoTitle = styled.div`
    font-size: 16px;
    width: 100px;
`;
const InfoContent = styled.div`
    font-size: 20px;
`;

const SubmitButton = styled.div`
    width: 360px;
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
