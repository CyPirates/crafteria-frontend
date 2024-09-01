import { useLocation } from "react-router-dom";
import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

type StlRenderProps = {
    filePath: string;
}
const DesignDetailPage = () => {
    const location = useLocation();
    const { published, publishedDay, name, size, price, volume, id, filePath, fileType } = location.state;



    return (
        <>
            <PageWrapper>
                <Title>{name}</Title>
                <Content>파일형식 : {fileType} 가격: {price}원</Content>
                <StlRenderContainer filePath={filePath} />
            </PageWrapper>
        </>
    )
}

const StlRenderContainer = ({ filePath }: StlRenderProps) => {
    const stlStyle = {
        width: '1000px',
        height: '500px',
        top: 0,
        left: 0,
    }
    return (
        <StlContainer>
            <StlViewer
                url={filePath}
                style={stlStyle}
                orbitControls={true}
                shadows
                showAxes
                cameraProps={
                    {
                        initialPosition: {
                            latitude: 0,
                            longitude: 0,
                            distance: 1.5
                        }
                    }
                }
            />
        </StlContainer >
    )
}

export default DesignDetailPage;

const PageWrapper = styled.div`
    margin: 20px 150px;
`

const Title = styled.div`
    width: 1000px;
    font-weight: bold;
    font-size: 40px;
    margin-bottom: 10px;
    border-bottom: 5px solid #464649;
`
const Content = styled.div`
    font-size: 15px;
`
const StlContainer = styled.div`
    width: 1000px;
    height: 500px;
    background-color: #E4E4E4;
    margin-top: 20px
`