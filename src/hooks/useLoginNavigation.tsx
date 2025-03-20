import { useNavigate } from "react-router-dom";

const useLoginNavigation = () => {
    const navigate = useNavigate();

    const moveToLogin = () => {
        localStorage.setItem("redirectPath", window.location.href);
        navigate("/login");
    };

    return { moveToLogin };
};

export default useLoginNavigation;
