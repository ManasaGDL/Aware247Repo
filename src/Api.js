
import {baseURL, axiosInstance} from "./axios";

const api = {
    login : (body) => {
      return  axiosInstance.post(`${baseURL}/auth/token/` , body);
    },
    refreshToken: (body) => {
        return axiosInstance.post(`${baseURL}/auth/refresh_token`, body);
      },
      getComponents : () => {
        axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"]="Bearer "+ localStorage.getItem("access_token")
        return axiosInstance.get(`${baseURL}/api/common/components/components_list`)
      },
      getBusinessUnits : () =>{
        return axiosInstance.get(`${baseURL}/api/common/businessunits`)
      },
      getUserProfile: () =>{
        return axiosInstance.get(`${baseURL}/api/account/userprofile`)
      },
      createIncident : (body) =>{
        return axiosInstance.post(`${baseURL}/api/common/incidents/`,body)
      },
      viewIncidents : () =>{ // do we need to suuply BU
        return axiosInstance.get(`${baseURL}/api/common/incidents/?limit=300`)
      },
      getSideBarData : () =>{
        axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"]="Bearer "+ localStorage.getItem("access_token")
        return axiosInstance.get(`${baseURL}/api/common/sidebar`)
      },
     switchBusinessUnit : (id,body) => {
      return axiosInstance.patch(`${baseURL}/api/account/profile/${id}/update_lastlogin/`,body)
     },
     getIncident : (id) =>{
      return axiosInstance.get(`${baseURL}/api/common/incidents/${id}/`)
     },
     addComments : (id, body) => {
      return axiosInstance.patch(`${baseURL}/api/common/incidents/${id}/postmorterm/`, body)
     },
     deleteIncident : ( id ) =>{
      return axiosInstance.delete(`${baseURL}/api/common/incidents/${id}/delete_incident`)
     },
     updateIncident : ( id ,body) =>{
      return axiosInstance.put(`${baseURL}/api/common/incidents/${id}/update_incident/`, body)
     }
}
export default api;