import styled from "styled-components";

const BottomBar = () => {
    return (
        <BottomBarContainer>
            <TextContainer>
                <CompanyTitle>장성수 컴퍼니</CompanyTitle>
                <Text>대표 장성수 | 사업자등록번호: 189-58-00930 | 정보통신업 | 통신판매업신고번호 2025-인천부평-1130</Text>
                <Text>이메일 sungsujang99@gmail.com | 사업문의: 070-8028-3989 | 인천광역시 부평구 안남로 123번길 46 우성아파트 403-602</Text>
                <Footer>
                    <Text>Crafteria © 2025 Crafteria. All rights reserved.</Text>
                    <Text>
                        <a href="/policies/privacy">개인정보처리방침</a> | <a href="/policies/terms">이용약관</a> | <a href="/policies/refund">교환 및 반품 정보</a>
                    </Text>
                </Footer>
            </TextContainer>
        </BottomBarContainer>
    );
};

export default BottomBar;

const BottomBarContainer = styled.div`
    width: 100%;
    height: 208px;
    padding: 58px 80px;
    background-color: #191919;
    display: flex;
    align-items: center;
`;

const TextContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const CompanyTitle = styled.div`
    color: ${({ theme }) => theme.grayScale[400]};
    font-size: 14px;
    font-weight: 700;
`;
const Text = styled.div`
    color: ${({ theme }) => theme.grayScale[400]};
    font-size: 12px;

    a {
        color: ${({ theme }) => theme.grayScale[400]};
        text-decoration: none;
    }
`;

const Footer = styled.div`
    width: 100%;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
`;
