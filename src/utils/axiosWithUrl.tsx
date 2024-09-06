import axios from "axios";

export const newAxios = axios.create({
    baseURL: `https://crafteria.co.kr/`,
});
