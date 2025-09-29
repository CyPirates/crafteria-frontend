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
import { Typography } from "../../common/Typography";
import AddressSearchModal from "../../common/AddressSearchModal";

type OrderInfoProps = {
    printOrders: PrintOrderData[];
    company: Company;
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
        const vat = Math.ceil(price * 0.1);
        const shipping = 3000;
        if (!coupon) {
            setVat(vat);
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
            {/* {isCouponOpen && (
                <CouponOverlay onClick={() => setIsCouponOpen(false)}>
                    <CouponModalContainer onClick={(e) => e.stopPropagation()}>
                        <CouponBoxPage isCouponUseMode={true} couponType="ORDER_PURCHASE" handleCouponSelect={setCoupon} price={price} setIsOpen={setIsCouponOpen} />
                    </CouponModalContainer>
                </CouponOverlay>
            )} */}
            <UserArea>
                <Typography variant="heading.h6">결제 정보</Typography>
                <TitleTypography variant="misc.label" color="text.body">
                    배송 정보
                </TitleTypography>
                <AddressInputContainer>
                    <RowContainer>
                        <ZipcodeInput placeholder="우편번호" disabled={true} value={zipcode} />
                        <Button style={{ width: "96px", height: "32px" }} onClick={handleIsOpen}>
                            주소 검색
                        </Button>
                    </RowContainer>
                    <StyledInput placeholder="도로명 주소" disabled={true} value={address} />
                    <StyledInput placeholder="상세 주소" value={detailAddress} onChange={setDetailAddress} />
                </AddressInputContainer>
                {isDesignSelectOpen && <AddressSearchModal setZipcode={setZipcode} setAddress={setAddress} handleIsOpen={handleIsOpen} />}
                <TitleTypography variant="misc.label" color="text.body">
                    구매자 정보
                </TitleTypography>
                <InformationContainer>
                    <StyledInput id="recipientName" onChange={handleOnchange} placeholder="이름" />

                    <StyledInput id="recipentPhone" onChange={handleOnchange} placeholder="전화번호" />

                    <StyledInput id="specialRequest" onChange={handleOnchange} placeholder="요청사항" />
                </InformationContainer>
                <TitleTypography variant="misc.label" color="text.body">
                    가격
                </TitleTypography>
                <InformationContainer>
                    <RowGrid>
                        <Typography variant="body.small_b" color="grayScale.500">
                            프린트 가격
                        </Typography>
                        <InfoContent style={{ textDecoration: coupon ? "line-through" : "none", color: coupon ? "#858585" : "black" }}>
                            <Typography variant="body.small_r" color="text.body">
                                {price} 원
                            </Typography>
                        </InfoContent>
                        {coupon && (
                            <InfoContent style={{ color: "red" }}>
                                <Typography variant="body.small_r" color="text.body">
                                    {discountedPrice} 원
                                </Typography>
                            </InfoContent>
                        )}
                    </RowGrid>
                    <RowGrid>
                        <Typography variant="body.small_b" color="grayScale.500">
                            VAT
                        </Typography>
                        <InfoContent>
                            <Typography variant="body.small_r" color="text.body">
                                {vat}원
                            </Typography>
                        </InfoContent>
                    </RowGrid>
                    <RowGrid>
                        <Typography variant="body.small_b" color="grayScale.500">
                            배송비
                        </Typography>
                        <InfoContent>
                            <Typography variant="body.small_r" color="text.body">
                                3000원
                            </Typography>
                        </InfoContent>
                    </RowGrid>
                    <Divider />
                    <RowGrid>
                        <Typography variant="body.medium_b" color="text.body">
                            총 가격
                        </Typography>
                        <InfoContent>
                            <Typography variant="body.medium_b" color="text.heading">
                                {finalPrice} 원
                            </Typography>
                        </InfoContent>
                    </RowGrid>
                </InformationContainer>
                <SubmitButton onClick={handleSubmit}>주문하기</SubmitButton>
            </UserArea>
        </>
    );
};

export default OrderInfoContainer;

const UserArea = styled.div`
    width: 272px;
    height: 100%;

    display: flex;
    flex-direction: column;
`;

const TitleTypography = styled(Typography)`
    margin-top: 16px;
`;

const AddressInputContainer = styled.div``;

const RowContainer = styled.div`
    display: flex;
    width: 272px;
    margin: 4px 0;
`;

const ZipcodeInput = styled.input`
    width: 168px;
    height: 32px;
    padding-left: 12px;
    background-color: ${({ theme }) => theme.text.disabled};
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};
`;

const StyledInput = styled.input`
    width: 272px;
    height: 32px;
    padding-left: 12px;
    margin: 4px 0;
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 8px;

    font-size: ${({ theme }) => theme.typography.misc.placeholder.fontSize};
    font-weight: ${({ theme }) => theme.typography.misc.placeholder.fontWeight};
    line-height: ${({ theme }) => theme.typography.misc.placeholder.lineHeight};

    &:disabled {
        background-color: ${({ theme }) => theme.text.disabled};
    }
`;

const Button = styled.button`
    background-color: ${({ theme }) => theme.grayScale[100]};
    border: 1px solid ${({ theme }) => theme.grayScale[300]};
    border-radius: 4px;
    margin-left: 8px;
    cursor: pointer;

    text-align: center;
    &:hover {
        background-color: #2e2e2e;
    }
`;

const InformationContainer = styled.div`
    margin-top: 8px;
`;
const RowGrid = styled.div`
    display: flex;
`;
const InfoContent = styled.div`
    font-size: 20px;
    flex: 1;
    text-align: right;
`;

const SubmitButton = styled.div`
    width: 272px;
    height: 40px;
    margin-top: 24px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    color: white;
    border-radius: 8px;
    font-size: ${({ theme }) => theme.typography.body.small_m.fontSize};
    font-weight: ${({ theme }) => theme.typography.body.small_m.fontWeight};
    line-height: ${({ theme }) => theme.typography.body.small_m.lineHeight};
    text-align: center;

    cursor: pointer;
    &:hover {
        background-color: #2e2e2e;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Divider = styled.div`
    width: 272px;
    border-top: 1px solid ${({ theme }) => theme.grayScale[200]};
    margin: 12px 0;
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
