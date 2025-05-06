import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Design } from "../../../types/DesignType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";

type DesignOutlineCardProps = {
    designData: Design;
    published: boolean;
};

const DesignOutlineCard = ({ designData, published }: DesignOutlineCardProps) => {
    const { name, widthSize, lengthSize, heightSize, price, downloadCount, modelFileUrl, id, downloadable } = designData;
    const navigate = useNavigate();

    const handleDownload = async (url: string, filename: string) => {
        const file = await fetch(url);
        const blob = await file.blob();
        const objectUrl = URL.createObjectURL(blob);
        const newName = filename + ".stl";
        const link = document.createElement("a");
        link.download = newName;
        link.href = objectUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleDelete = async () => {
        const letDelete = confirm("정말 삭제하시겠습니까?");
        if (!letDelete) return;
        try {
            const response = await newAxios.delete(`/api/v1/model/author/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            if (response.data.status === 200) {
                alert("삭제가 완료되었습니다.");
                window.location.reload();
            }
            if (response.data.status === 400) {
                alert(response.data.message);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <CardWrapper>
                <StlRenderContainer filePath={modelFileUrl} width="150px" height="150px" clickDisabled={true} />
                <InformationContainer>
                    <Information>도면명: {name}</Information>
                    <Information>
                        모델크기: {widthSize}mm x {lengthSize}mm x {heightSize}mm
                    </Information>
                    <Information>가격: {price}원</Information>
                    <Information>판매량: {downloadCount}</Information>
                </InformationContainer>
                <ButtonConatiner>
                    <Button onClick={() => navigate(`/design/${id}`)}>상세보기</Button>
                    {(published || downloadable) && <Button onClick={() => handleDownload(modelFileUrl, name)}>다운로드</Button>}
                    {published && <Button>수정</Button>}
                    {published && <Button onClick={handleDelete}>삭제</Button>}
                </ButtonConatiner>
            </CardWrapper>
        </>
    );
};

export default DesignOutlineCard;

const CardWrapper = styled.div`
    width: 700px;
    height: 180px;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 10px;
    border: 0.5px solid #dddddd;

    display: flex;
    align-items: center;

    position: relative;
`;

const InformationContainer = styled.div`
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 30px;

    flex: 1;
`;
const Information = styled.div`
    //color: #d2d2d2;
    font-size: 15px;
    font-weight: 400;
`;

const ButtonConatiner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    height: 100%;
    width: 160px;
    border-left: 0.5px solid #dddddd;
`;
const Button = styled.div`
    width: 120px;
    height: 28px;
    border-radius: 5px;
    border: 0.5px solid #dddddd;
    font-size: 12px;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        background-color: #dddddd;
        cursor: pointer;
    }
`;
