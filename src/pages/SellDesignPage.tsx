import styled from "styled-components";
import SellDesignInputField from "../components/specific/sellDesign/SellDesignInputField";

const SellDesignPage = () => {
    return (
        <>
            <PageWrapper>
                <UploadDesignContiner>
                    <Header>도면 판매</Header>
                    <SellDesignInputField />
                </UploadDesignContiner>
            </PageWrapper>
        </>
    );
};

export default SellDesignPage;

const PageWrapper = styled.div`
    display: flex;
    height: 850px;
    justify-content: center;
`;

const UploadDesignContiner = styled.div`
    width: 1200px;
    //background-color: #d9d9d9;
`;

const Header = styled.div`
    height: 50px;
    padding: 0px 30px;
    border-bottom: 0.5px solid #dddddd;
    font-size: 20px;
    font-weight: bold;

    display: flex;
    flex-direction: row;
    align-items: center;
`;
