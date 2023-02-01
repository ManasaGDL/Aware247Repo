import { axiosInstance , baseURL} from "../axios"

const clientApi = {
    getComponentStatus : (businessunit) =>{
        axiosInstance.defaults.headers["businessunit"]=businessunit;
       return axiosInstance.get(`${baseURL}/api/common/components/statuspage_components_list`);
    },
    getIncidents:() =>{
        return axiosInstance.get(`${baseURL}/api/common/status_page_incidents`)
    }
}
export default clientApi;