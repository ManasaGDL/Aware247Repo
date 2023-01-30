import { useState , useEffect ,useMemo} from "react";
import api from "../../Api";
export default (id,bu) =>{
    const [data,setData] = useState();
    const [incidentId ,setIncidentId] = useState();
 
    useEffect(() => {
        getIncidentStatusDashBoard();
      },[bu])
      const getIncidentStatusDashBoard = async () =>{
       try{
      const data = await api.getIncidentStatusDashBoard();
     setData(data?.data)
       }catch(e)
       {
     
       }
      }
      useEffect(()=>{
           if(data)
           {
    setIncidentId(Object.values(data).find(item=>{
       
        return item.component_id === id 
    }))
           }
      },[data])
      return [incidentId]
 
}