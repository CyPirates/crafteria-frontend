import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

type StlRenderProps = {
    filePath: string;
};

const StlRenderContainer = ({ filePath }: StlRenderProps) => {
    const stlStyle = {
        width: "500px",
        height: "500px",
        top: 0,
        left: 0,
    };

    return (
        <StlContainer>
            <StlViewer
                url={filePath}
                style={stlStyle}
                orbitControls
                shadows
                showAxes
                cameraProps={{
                    initialPosition: {
                        latitude: 0,
                        longitude: 0,
                        distance: 2,
                    },
                }}
            />
        </StlContainer>
    );
};

export default StlRenderContainer;

const StlContainer = styled.div`
    width: 500px;
    height: 500px;
    background-color: #e4e4e4;
    margin-top: 20px;
`;
