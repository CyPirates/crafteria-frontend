import styled from "styled-components";

const BottomBar = () => {
    return (
        <BottomBarContainer>
            <TextContainer>
                <Text>
                    <a href="/policies/privacy">개인정보처리방침</a> | <a href="/policies/terms">이용약관</a> | <a href="/policies/refund">교환 및 반품 정보</a>
                </Text>
                <Text>
                    장성수 컴퍼니 | 대표: 장성수 | 사업자 등록번호: 189-58-00930 | 정보통신업 | 전자우편: sungsujang99@gmail.com | 사업문의: 070-8028-3989 | 주소: 인천광역시 부평구 안남로 123번길 46
                    우성아파트 403-602
                </Text>
            </TextContainer>
        </BottomBarContainer>
    );
};

export default BottomBar;

const BottomBarContainer = styled.div`
    width: 100%;
    height: 60px;
    background-color: #77777c;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Text = styled.div`
    color: white;
    font-size: 12px;

    a {
        color: white;
        //text-decoration: none;
    }
`;
