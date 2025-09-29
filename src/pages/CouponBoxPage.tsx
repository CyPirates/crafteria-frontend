import styled from "styled-components";
import Logo from "../assets/logoWithoutText.png";
import { useEffect, useState } from "react";
import { newAxios } from "../utils/axiosWithUrl";
import { Coupon } from "../types/CouponType";
import { Typography } from "../components/common/Typography";

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
                <img src={Logo} width="80px" alt="logo" />
                쿠폰
            </Headder>
            <Body>
                <RowContainer>
                    <StyledInput value={couponCode} placeholder="쿠폰 코드를 입력해주세요." onChange={(e) => setCouponCode(e.target.value)} />
                    <SubmitButton onClick={issuedCoupon}>쿠폰등록</SubmitButton>
                </RowContainer>
                <Title>사용 가능 쿠폰 {couponList.length}개</Title>
                <CardWrapper>
                    {couponList.map((coupon) => {
                        const expiredDate = coupon.expiredAt.split("T")[0];
                        return (
                            <CardContainer key={coupon.id}>
                                <CardHeader>
                                    {coupon.type === "MODEL_PURCHASE" ? `${coupon.discountRate}%` : `${coupon.discountRate}원`}
                                    <CouponCategory>
                                        <Typography variant="body.small_m" color="text.body">
                                            {coupon.type === "MODEL_PURCHASE" ? "도면 구매" : "프린트 주문"}
                                        </Typography>
                                    </CouponCategory>
                                </CardHeader>
                                <div>
                                    <Typography variant="body.medium_m" color="text.heading">
                                        {coupon.name}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body.small_m" color="text.body">
                                        {coupon.type === "MODEL_PURCHASE" ? "도면 구매 시" : "프린트 주문 시"} | 할인율: {coupon.discountRate}% | 최대 할인 금액: {coupon.maxDiscountAmount}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="body.small_m" color="text.body">
                                        {expiredDate} 까지
                                    </Typography>
                                </div>

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
    height: 72px;
    background-color: ${({ theme }) => theme.grayScale[600]};
    color: white;
    font-size: 24px;
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
    width: 360px;
    height: 40px;
    margin-right: 8px;
    padding-left: 8px;
    border-radius: 8px;
`;

const SubmitButton = styled.button`
    width: 120px;
    background-color: #ffffff;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};
    border-radius: 8px;
`;

const Title = styled.div`
    width: 100%;
    height: 32px;
    border-bottom: 1px solid black;
    font-size: 16px;
    font-weight: bold;
    margin: 16px 0;
`;

const CardWrapper = styled.div`
    width: 100%;
    height: 600px;
    overflow-y: auto;
`;

const CardContainer = styled.div`
    width: 100%;
    height: 128px;
    padding: 0 12px 0 12px;
    margin-bottom: 8px;
    border-radius: 8px;
    background-color: white;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    position: relative;
`;

const CardHeader = styled.div`
    width: 100%;
    height: 52px;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 4px;
    border-bottom: 1px solid ${({ theme }) => theme.grayScale[200]};

    display: flex;
    align-items: center;
`;

const CouponCategory = styled.div`
    width: 72px;
    height: 28px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.grayScale[100]};
    margin-left: 8px;

    display: flex;
    justify-content: center;
    align-items: center;
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
