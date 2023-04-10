import axios from "axios";
import { axiosInstance , baseURL} from "../axios"

const clientApi = {
    getComponentStatus : (businessunit) =>{
        axiosInstance.defaults.headers["businessunit"]=businessunit;
       return axiosInstance.get(`${baseURL}/api/common/components/statuspage_components_list`);
    },
    getIncidents:() =>{
        return axiosInstance.get(`${baseURL}/api/common/status_page_incidents`)
    },
    getNetworks:() =>{
        return axiosInstance.get(`${baseURL}/api/common/networks`)
    },
    createSubscriber : (data) => {
        return axiosInstance.post(`${baseURL}/api/common/subscribers/create_subscriber/`, data)
    },
    getSubscriberComponents :(token , businessunit) =>{
        axiosInstance.defaults.headers["businessunit"]=businessunit;
       
        return axiosInstance.get(`${baseURL}/api/common/subscribers/subscribercomponent?id=${token}`)

    },
    updateSubscriber : (payload)=>{
        return axiosInstance.patch(`${baseURL}/api/common/subscribers/subscribers_update/`,payload)
    },
    deleteSubscriber : (id,businessunit) => {
        axiosInstance.defaults.headers["businessunit"]=businessunit;
        return axiosInstance.delete(`${baseURL}/api/common/subscribers/unsubscribe_public/?id=${id}`)
    }
}
export default clientApi;