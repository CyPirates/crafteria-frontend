import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Design } from "../../../types/DesignType";
import StlRenderContainer from "../designDetail/StlRenderContainer";
import { newAxios } from "../../../utils/axiosWithUrl";
import { Typography } from "../../common/Typography";
import BuyIcon from "../../../assets/images/icons/buy.png";
import EyeIcon from "../../../assets/images/icons/eye.png";
import { useState } from "react";
import { useStlModelVolume } from "../../../hooks/useStlModelVolume";
import categoryKeys from "../../../types/Category";
type DesignOutlineCardProps = {
    designData: Design;
    published: boolean;
};

const DesignOutlineCard = ({ designData, published }: DesignOutlineCardProps) => {
    const { name, viewCount, downloadCount, modelFileUrls, id, downloadable, category, author } = designData;
    const navigate = useNavigate();
    const [volume, setVolume] = useState<number | undefined>(undefined);

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
                <StlRenderContainer filePath={modelFileUrls[0]} width="232px" height="186px" clickDisabled={true} />
                <InformationContainer>
                    <Typography variant="body.medium_b" color="text.heading">
                        {name}
                    </Typography>
                    <Information>
                        <img src={BuyIcon} className="img" alt="x" />
                        <Typography variant="body.small_m" color="grayScale.400">
                            {downloadCount}
                        </Typography>

                        <img src={EyeIcon} className="img" alt="x" />
                        <Typography variant="body.small_m" color="grayScale.400">
                            {viewCount}
                        </Typography>
                    </Information>
                    <Typography variant="body.small_r" color="grayScale.400">
                        {useStlModelVolume(modelFileUrls[0])}mm³ · {author.name} · {categoryKeys[category]}
                    </Typography>
                </InformationContainer>
                <ButtonConatiner>
                    <Button onClick={() => navigate(`/design/${id}`)}>상세보기</Button>
                    {(published || downloadable) && <Button onClick={() => handleDownload(modelFileUrls[0], name)}>다운로드</Button>}
                    {published && <Button onClick={() => navigate(`/edit-design?modelId=${id}`)}>수정</Button>}
                    {published && <Button onClick={handleDelete}>삭제</Button>}
                </ButtonConatiner>
            </CardWrapper>
        </>
    );
};

export default DesignOutlineCard;

const CardWrapper = styled.div`
    width: 1280px;
    height: 218px;
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.grayScale[200]};

    display: flex;
    align-items: center;

    position: relative;
`;

const InformationContainer = styled.div`
    margin-left: 32px;
    flex: 1;

    display: flex;
    flex-direction: column;
`;
const Information = styled.div`
    margin: 4px 0 12px 0;

    display: flex;
    align-items: center;

    .img {
        width: 12px;
        height: 12px;
        margin-right: 4px;
    }

    > ${Typography} {
        margin-right: 8px;
    }
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
