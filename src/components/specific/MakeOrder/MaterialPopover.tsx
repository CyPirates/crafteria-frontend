import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import styled from "styled-components";

type OwnProps = {
    color: string;
    imgUrl: string;
};
const MaterialPopover = ({ color, imgUrl }: OwnProps) => {
    return (
        <>
            <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                    <Popover id={`popover-positioned-`}>
                        <Popover.Body>
                            <MaterialImg src={imgUrl} alt="x" />
                        </Popover.Body>
                    </Popover>
                }
            >
                <ColorButton color={color} />
            </OverlayTrigger>
        </>
    );
};

export default MaterialPopover;

const MaterialImg = styled.img`
    width: 120px;
    height: 120px;
    object-fit: cover;
`;

const ColorButton = styled.div`
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.color};
    border: 1px solid #919191;
`;
