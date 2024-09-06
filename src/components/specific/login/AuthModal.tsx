// AuthModal.tsx
import React, { useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";

Modal.setAppElement("#root"); // 앱 루트 요소 설정

interface AuthModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onRequestClose }) => {
    // 메시지를 수신하고 accessToken을 처리하는 함수
    const handleMessage = (event: MessageEvent) => {
        if (event.origin === "https://crafteria.co.kr") {
            // 보안상의 이유로 오리진 체크
            const { data } = event;
            if (data.type === "ACCESS_TOKEN") {
                const { accessToken } = data;
                console.log(accessToken);
                localStorage.setItem("accessToken", accessToken);
                console.log("Access token saved to localStorage:", accessToken);
                onRequestClose(); // 인증 후 모달 닫기
            }
        }
    };

    useEffect(() => {
        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <StyledModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Google Authentication"
        >
            <CloseButton onClick={onRequestClose}>Close</CloseButton>
            <iframe
                src="https://crafteria.co.kr/oauth2/authorization/google"
                style={{ width: "100%", height: "100%" }}
                title="Google Authentication"
            />
        </StyledModal>
    );
};

const StyledModal = styled(Modal)`
    overlay {
        background-color: rgba(0, 0, 0, 0.75);
    }

    content {
        top: 50%;
        left: 50%;
        right: auto;
        bottom: auto;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        padding: 0;
        border: none;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #fff;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

export default AuthModal;
