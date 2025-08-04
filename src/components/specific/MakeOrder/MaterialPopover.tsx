import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import styled from "styled-components";

type OwnProps = {
    color: string;
    imgUrl: string;
    price: string;
};
const MaterialPopover = ({ color, imgUrl, price }: OwnProps) => {
    return (
        <>
            <OverlayTrigger
                //trigger="hover"
                placement="bottom"
                overlay={
                    <Popover id={`popover-positioned-`}>
                        <Popover.Body style={{ textAlign: "center" }}>
                            <MaterialImg src={imgUrl} alt="x" />
                            <div>{price}원/1cm³</div>
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
    width: 16px;
    height: 16px;
    background-color: ${(props) => props.color};
    border: 1px solid #919191;
    border-radius: 50%;
`;
