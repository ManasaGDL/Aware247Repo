import axios from "axios";
import {baseURL, axiosInstance} from "./axios";

const api = {
    login : (body) => {
      return  axiosInstance.post(`${baseURL}/auth/token/` , body);
    },
    refreshToken: (body) => {
        return axiosInstance.post(`${baseURL}/auth/refresh_token`, body);
      },
      getComponents : () => {
        return axiosInstance.get(`${baseURL}/api/common/components/components_list`)
      },
      getBussinessUnits : () =>{
        return axiosInstance.get(`${baseURL}/api/common/businessunits`)
      },
      getUserProfile: () =>{
        return axiosInstance.get(`${baseURL}/api/account/userprofile`)
      }
}
export default api;