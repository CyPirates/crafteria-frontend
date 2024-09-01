import styled from "styled-components";
import SellDesignInputField from "../components/specific/sellDesign/SellDesignInputField";

const SellDesignPage = () => {
  return (
    <>
      <PageWrapper>
        <UploadDesignContiner>
          <Header>판매 도면 등록</Header>
          <SellDesignInputField />
        </UploadDesignContiner>
      </PageWrapper>
    </>
  );
};

export default SellDesignPage;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const UploadDesignContiner = styled.div`
  width: 1200px;
  height: 100%;
  background-color: #d9d9d9;
`;

const Header = styled.div`
  width: 100%;
  height: 50px;
  padding: 0px 30px;
  background-color: #5c5c60;
  font-size: 20px;
  font-weight: bold;

  display: flex;
  flex-direction: row;
  align-items: center;
`;
