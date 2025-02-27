import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

type StlRenderProps = {
    filePath: string;
    width: string;
    height: string;
    clickDisabled?: boolean;
};

const StlRenderContainer = ({ filePath, width, height, clickDisabled }: StlRenderProps) => {
    const stlStyle = {
        width: width,
        height: height,
        top: 0,
        left: 0,
    };

    return (
        <>
            <StlContainer width={width} height={height}>
                <StlViewer
                    key={filePath}
                    url={filePath}
                    style={stlStyle}
                    orbitControls={!clickDisabled}
                    shadows
                    showAxes
                    // cameraProps={{
                    //     initialPosition: {
                    //         latitude: 0,
                    //         longitude: 0,
                    //         distance: 2,
                    //     },
                    // }}
                />
            </StlContainer>
        </>
    );
};

export default StlRenderContainer;

const StlContainer = styled.div<{ width: string; height: string }>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background-color: #ffffff;
`;
