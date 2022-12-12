import axios from "axios";
import {baseURL, axiosInstance} from "./axios";

const api = {
    login : (body) => {
      return  axiosInstance.post(`${baseURL}/auth/token/` , body);
    },
    refreshToken: (body) => {
        return axiosInstance.post(`${baseURL}/auth/refresh_token`, body);
      }
}
export default api;