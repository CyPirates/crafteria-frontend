import { StlViewer } from "react-stl-viewer";
import styled from "styled-components";

type StlRenderProps = {
    filePath: string;
    width: string;
    height: string;
};

const StlRenderContainer = ({ filePath, width, height }: StlRenderProps) => {
    const stlStyle = {
        width: width,
        height: height,
        top: 0,
        left: 0,
    };

    return (
        <StlContainer width={width} height={height}>
            <StlViewer
                url={filePath}
                style={stlStyle}
                orbitControls
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
    );
};

export default StlRenderContainer;

const StlContainer = styled.div<{ width: string; height: string }>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background-color: #e4e4e4;
    margin-top: 20px;
`;
