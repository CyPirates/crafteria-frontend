import axios from "axios";

export const newAxios = axios.create({
    baseURL: `https://api.crafteria.co.kr/`,
});
