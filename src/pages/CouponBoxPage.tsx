import styled from "styled-components";
import Logo from "../assets/logoWithoutText.png";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/axiosWithUrl";
import { Coupon } from "../types/CouponType";

type CouponUseModeProps = {
    isCouponUseMode: true;
    couponType: "MODEL_PURCHASE" | "ORDER_PURCHASE";
    handleCouponSelect: React.Dispatch<React.SetStateAction<Coupon | null>>;
    price: number;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type CouponViewOnlyProps = {
    isCouponUseMode?: false;
};

type CouponBoxProps = CouponUseModeProps | CouponViewOnlyProps;

const CouponBoxPage = (props: CouponBoxProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [couponList, setCouponList] = useState<Coupon[]>([]);
    const issuedCoupon = async () => {
        try {
            const response = await newAxios.post(`/api/v1/coupons/issue?code=${couponCode}`, null, { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
            if (response.data.status !== 201) {
                alert(response.data.message);
            } else {
                fetchCouponList();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchCouponList = async () => {
        try {
            const response = await newAxios.get("/api/v1/coupons/available", { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } });
            const coupons = response.data.data;
            console.log(coupons);
            if (props.isCouponUseMode) {
                setCouponList(coupons.filter((coupon: Coupon) => coupon.type === props.couponType));
            } else {
                setCouponList(coupons);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchCouponList();
    }, []);

    return (
        <>
            <Headder>
                <img src={Logo} width={120} alt="logo" />
                쿠폰함
            </Headder>
            <Body>
                <RowContainer>
                    <StyledInput value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                    <SubmitButton onClick={issuedCoupon}>쿠폰등록</SubmitButton>
                </RowContainer>
                <Title>사용 가능 쿠폰 {couponList.length}개</Title>
                <CardWrapper>
                    {couponList.map((coupon) => {
                        const expiredDate = coupon.expiredAt.split("T")[0];
                        return (
                            <CardContainer key={coupon.id}>
                                <CardTitle>
                                    {coupon.name}
                                    {coupon.id}
                                </CardTitle>
                                <div>
                                    {coupon.type === "MODEL_PURCHASE" ? "도면 구매 시" : "프린트 주문 시"} | 할인율: {coupon.discountRate}% | 최대 할인 금액: {coupon.maxDiscountAmount}
                                </div>
                                <div>만료일: {expiredDate}</div>

                                {props.isCouponUseMode && (
                                    <>
                                        <DiscountText style={{ color: "red" }}>-₩ {Math.min(Math.floor(+props.price * (+coupon.discountRate / 100)), +coupon.maxDiscountAmount)}</DiscountText>
                                        <SelectButton
                                            onClick={() => {
                                                props.handleCouponSelect && props.handleCouponSelect(coupon);
                                                props.setIsOpen(false);
                                            }}
                                        >
                                            적용하기
                                        </SelectButton>
                                    </>
                                )}
                            </CardContainer>
                        );
                    })}
                </CardWrapper>
            </Body>
        </>
    );
};

export default CouponBoxPage;

const Headder = styled.div`
    width: 520px;
    height: 80px;
    background-color: black;
    color: white;
    font-size: 28px;
    font-weight: 500;

    display: flex;
    align-items: center;
`;

const Body = styled.div`
    width: 520px;
    padding: 16px;
    background-color: #f6f6f6;
    min-height: 778px;
`;

const RowContainer = styled.div`
    display: flex;
`;
const StyledInput = styled.input`
    width: 320px;
    margin-right: 8px;
`;

const SubmitButton = styled.button`
    background-color: #ffffff;
    border: 0.1px solid #b6b6b6;
`;

const Title = styled.div`
    width: 100%;
    height: 32px;
    border-bottom: 1px solid black;
    font-size: 16px;
    font-weight: bold;
    margin: 12px 0;
`;

const CardWrapper = styled.div`
    width: 100%;
    height: 600px;
    overflow-y: scroll;
`;

const CardContainer = styled.div`
    width: 100%;
    height: 88px;
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 10px;
    background-color: white;
    border: 0.1px solid #b6b6b6;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    position: relative;
`;

const CardTitle = styled.div`
    font-size: 16px;
    font-weight: 600;

    display: flex;
`;

const SelectButton = styled.div`
    width: 80px;
    height: 100%;
    background-color: black;
    color: white;
    border-radius: 0 5px 5px 0;

    &:hover {
        cursor: pointer;
        background-color: #303030;
    }

    position: absolute;
    right: 0px;
    bottom: 0px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const DiscountText = styled.div`
    color: red;

    position: absolute;
    right: 88px;
    bottom: 8px;
`;
