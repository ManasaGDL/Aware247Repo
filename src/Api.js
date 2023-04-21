
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
        return axiosInstance.get(`${baseURL}/api/common/incidents/?limit=600`)
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
     },
     getActivityLog : (body) =>{
      return axiosInstance.put(`${baseURL}/api/common/incident_activity_log/incident_activity/`,body)
     },
     getIncidentStatusDashBoard : () =>{
      return axiosInstance.get(`${baseURL}/api/common/dashboard_incident`)
     },
    //  Cmponents API
     deleteComponent : (id) =>{
      return axiosInstance.delete(`${baseURL}/api/common/components/${id}/delete_component/`)
     },
     addComponent : (payload) =>{
      return axiosInstance.post(`${baseURL}/api/common/components/create_component/`,payload)
     },
     getGroupComponents : () =>{
      return axiosInstance.get(`${baseURL}/api/common/components/group_components/`)
     },
     getComponent : (id) =>{
      return axiosInstance.get(`${baseURL}/api/common/components/${id}`)
     },
     editComponent : (id , payload) =>{
      return axiosInstance.patch(`${baseURL}/api/common/components/${id}/update_component/`,payload)
     },
     getSubscribersCount : () =>{
      return axiosInstance.get(`${baseURL}/api/common/subscribers/subsciberscount`)
     },
     getSubscribersList : (payload) =>{
      return axiosInstance.put(`${baseURL}/api/common/subscribers/subscriberslist/`,payload);
     },
     deleteSubscriber:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/common/subscribers/${id}/unsubscribe/`)
     },
     updateSubscriber:( id ,payload)=>{
      return axiosInstance.patch(`${baseURL}/api/common/subscribers/${id}/update_subscribers/`,payload)
     },
     getTeamMembers:()=>{
      return axiosInstance.get(`${baseURL}/api/account/profile/`)
     },
     getScheduleMaintenanceIncidents:()=>{
      return axiosInstance.get(`${baseURL}/api/common/scheduled_maintanence/`)
     },
     createScheduleMaintenance:(obj)=>{
      return axiosInstance.post(`${baseURL}/api/common/scheduled_maintanence/`,obj)
     },
     getScheduledIncident:(id)=>{
      return axiosInstance.get(`${baseURL}/api/common/scheduled_maintanence/components_list?id=${id}`)
     },
     updateScheduledIncident:(id,payload)=>{
    return axiosInstance.put(`${baseURL}/api/common/scheduled_maintanence/${id}/`,payload)
     },
     viewScheduleMaintenance:(id)=>{
return axiosInstance.get(`${baseURL}/api/common/scheduled_maintanence/activity_list?id=${id}`)
     },
     deleteScheduledIncident:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/common/scheduled_maintanence/${id}/sch_mnt_del/`)
     },
     getIncidentTemplates:()=>{
      return axiosInstance.get(`${baseURL}/api/common/incident_template/`)
     },
     createIncidentTemplate:(payload)=>{
      // axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
      // axiosInstance.defaults.headers["Authorization"]="Bearer "+ localStorage.getItem("access_token")
     
      return axiosInstance.post(`${baseURL}/api/common/incident_template/`,payload)
     },
     deleteTemplate:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/common/incident_template/${id}/inc_temp_del/`)
     },
     updateTemplate:(id , payload)=>{
      return axiosInstance.put(`${baseURL}/api/common/incident_template/${id}/`,payload)
     }
}
export default api;