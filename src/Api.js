
import axios from "axios";
import {baseURL, axiosInstance} from "./axios";

const api = {
  getToken:()=>{
    delete axiosInstance.defaults.headers["Authorization"];
return axiosInstance.post(`${baseURL}/auth/token/jwt_refresh`,{token:localStorage.getItem("access_token")});
  },
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
        axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"]="Bearer "+ localStorage.getItem("access_token")
        return axiosInstance.get(`${baseURL}/api/common/businessunits`)
      },
      getUserProfile: () =>{
        return axiosInstance.get(`${baseURL}/api/account/userprofile`)
      },
      createIncident : (body) =>{
        return axiosInstance.post(`${baseURL}/api/common/incidents/`,body)
      },
      viewIncidents : (obj) =>{ // do we need to suuply BU
        return axiosInstance.get(`${baseURL}/api/common/incidents/?limit=${obj.limit}&&offset=${obj.offset}`)
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
     getActivityLog : (body,obj) =>{
      return axiosInstance.put(`${baseURL}/api/common/incident_activity_log/incident_activity/
     
      `,body) // ?limit=${obj.limit}&&offset=${obj.offset}
     },
     getIncidentStatusDashBoard : () =>{
      axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
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
     getSubscribersList : (payload,obj) =>{
      return axiosInstance.put(`${baseURL}/api/common/subscribers/subscriberslist/?limit=${obj.limit}&&offset=${obj.offset}`,payload);
     },
     deleteSubscriber:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/common/subscribers/${id}/unsubscribe/`)
     },
     updateSubscriber:( id ,payload)=>{
      return axiosInstance.patch(`${baseURL}/api/common/subscribers/${id}/update_subscribers/`,payload)
     },
     getTeamMembers:(obj)=>{
    
      return axiosInstance.get(`${baseURL}/api/account/profile/?limit=${obj.limit}&&offset=${obj.offset}`)
     },
     getScheduleMaintenanceIncidents:(obj)=>{
      return axiosInstance.get(`${baseURL}/api/common/scheduled_maintanence/?limit=${obj.limit}&&offset=${obj.offset}`)
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
     getIncidentTemplateDropDown:()=>{
      return axiosInstance.get(`${baseURL}/api/common/incident_template/inc_temp_businessunit`)
     },
     getIncidentTemplates:(obj)=>{
      return axiosInstance.get(`${baseURL}/api/common/incident_template/?limit=${obj.limit}&&offset=${obj.offset}`)
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
      return axiosInstance.put(`${baseURL}/api/common/incident_template/${id}/`,payload);
     },
     getTemplateDetails:(id)=>{
      return axiosInstance.get(`${baseURL}/api/common/incident_template/${id}/`)
     },
     getSeverityList:()=>{
      return axiosInstance.get(`${baseURL}/api/common/incidents/impact_list`)
     }
     ,
     getBusinessUnit_Security:(obj)=>{
      return axiosInstance.get(`${baseURL}/api/common/businessunit/`)
     },
     createNewBusinessUnit:(payload)=>{
      return axiosInstance.post(`${baseURL}/api/common/businessunit/`,payload);
     },
     updateBusinessUnit:(id,payload)=>{//update and deactivate
      return axiosInstance.patch(`${baseURL}/api/common/businessunit/${id}/inactive_businessunit/`,payload)
     },
     deleteBusinessUnit:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/common/businessunit/${id}`)
     }
     ,
     addTeamMember:(payload)=>{
      return axiosInstance.post(`${baseURL}/api/account/profile/`,payload)
     },
     editTeamMember:(payload,id)=>{
      return axiosInstance.patch(`${baseURL}/api/account/profile/${id}/`,payload)
     },
     deleteTeamMember:(id)=>{
      return axiosInstance.delete(`${baseURL}/api/account/profile/${id}`)
     },
     changePassword:(payload)=>{
      return axiosInstance.put(`${baseURL}/api/account/password/change/`,payload)
     },
     forgotPassword:(payload)=>{
      return axiosInstance.post(`${baseURL}/api/account/password/reset/`,payload)
     },
     resetPassword:(payload)=>{
      return axiosInstance.put(`${baseURL}/api/account/password/reset/`,payload)
     }
}
export default api;