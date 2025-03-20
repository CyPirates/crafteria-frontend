import { ErrorType } from "../types/ErrorType";
import useLoginNavigation from "./useLoginNavigation";
import { AxiosError } from "axios";

const useAuthErrorHandler = () => {
    const { moveToLogin } = useLoginNavigation();

    const handleAuthError = (error: unknown) => {
        const axiosError = error as AxiosError<ErrorType>;
        if (axiosError.response?.status === 401) {
            moveToLogin();
            return true; //로그인페이지로 이동했다는 것을 알리는 용도
        }
        return false; // 로그인페이지로 이동하지 않았다는 것을 알리는 용도
    };

    return { handleAuthError };
};

export default useAuthErrorHandler;
