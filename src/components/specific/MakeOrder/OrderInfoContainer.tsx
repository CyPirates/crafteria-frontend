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
import CouponBoxPage from "../../../pages/CouponBoxPage";
import { Coupon } from "../../../types/CouponType";

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
    const [isDesignSelectOpen, setIsDesignSelectOpen] = useState<boolean>(false);
    const [isCouponOpen, setIsCouponOpen] = useState<boolean>(false);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [zipcode, setZipcode] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [discountedPrice, setDiscountedPrice] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const [finalPrice, setFinalPrice] = useState<number>(0);
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
        setVat(Math.ceil(price * 0.1));
        const shipping = 3000;
        if (!coupon) {
            setFinalPrice(price + vat + shipping);
            return;
        }
        const newDiscountedPrice = price - Math.min(+coupon.maxDiscountAmount, Math.floor((price * +coupon.discountRate) / 100));
        const discountedVAT = Math.ceil(newDiscountedPrice * 0.1);
        setDiscountedPrice(newDiscountedPrice);
        setVat(discountedVAT);

        setFinalPrice(newDiscountedPrice + discountedVAT + shipping);
    }, [price, coupon]);

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
        setIsDesignSelectOpen((prev) => !prev);
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
                couponId: coupon ? coupon.id : null,
            })
        );
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
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
                const isPaymentSuccess = await initiatePortOnePayment(paymentId, orderId, finalPrice.toString(), "orderId");
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
            {isCouponOpen && (
                <CouponOverlay onClick={() => setIsCouponOpen(false)}>
                    <CouponModalContainer onClick={(e) => e.stopPropagation()}>
                        <CouponBoxPage isCouponUseMode={true} couponType="ORDER_PURCHASE" handleCouponSelect={setCoupon} price={price} setIsOpen={setIsCouponOpen} />
                    </CouponModalContainer>
                </CouponOverlay>
            )}
            <UserArea>
                <Title>배송지 입력</Title>
                <AddressInputContainer>
                    <RowContainer>
                        <ZipcodeInput placeholder="우편번호" disabled={true} value={zipcode} />
                        <Button style={{ width: "100px", height: "40px" }} onClick={handleIsOpen}>
                            주소 찾기
                        </Button>
                    </RowContainer>
                    <AddressInput placeholder="도로명 주소" disabled={true} value={address} />
                    <AddressInput placeholder="상세 주소" value={detailAddress} onChange={setDetailAddress} />
                </AddressInputContainer>
                {isDesignSelectOpen && <Modal setZipcode={setZipcode} setAddress={setAddress} handleIsOpen={handleIsOpen} />}
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
                <Title>
                    결제 정보{" "}
                    <Button style={{ width: "80px", height: "24px", fontSize: "14px" }} onClick={() => setIsCouponOpen(true)}>
                        쿠폰 사용
                    </Button>
                </Title>
                <InformationContainer>
                    <RowGrid>
                        <InfoTitle>프린트 가격</InfoTitle>
                        <InfoContent style={{ textDecoration: coupon ? "line-through" : "none", color: coupon ? "#858585" : "black" }}>{price} 원</InfoContent>
                        {coupon && <InfoContent style={{ color: "red" }}>{discountedPrice} 원</InfoContent>}
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>VAT</InfoTitle>
                        <InfoContent>{vat} 원</InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>배송비</InfoTitle>
                        <InfoContent>3000 원</InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <InfoTitle>총 가격</InfoTitle>
                        <InfoContent>{finalPrice} 원</InfoContent>
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

    display: flex;
    align-items: center;
`;

const AddressInputContainer = styled.div``;

const RowContainer = styled.div`
    display: flex;
`;

const ZipcodeInput = styled.input`
    width: 120px;
    height: 40px;
    font-size: 15px;
    margin-bottom: 12px;
`;

const Button = styled.button`
    background-color: #000000;
    color: white;
    border-radius: 3px;
    margin-left: 12px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #2e2e2e;
    }
`;

const AddressInput = styled.input`
    width: 360px;
    height: 40px;
    font-size: 15px;
    margin-bottom: 12px;
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
        background-color: #2e2e2e;
    }
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    bottom: 20px;
`;

const CouponOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999; // BuyDesignPopUp보다 높게
`;

const CouponModalContainer = styled.div`
    background-color: white;
    width: 520px;
    height: 860px;
`;
