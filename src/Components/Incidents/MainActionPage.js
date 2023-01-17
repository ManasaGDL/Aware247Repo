import React,{useState , useRef, useEffect} from "react";

import EditIncident from "./EditIncident";
import HeaderTabs from "../common/HeaderTabs";
import  Paper  from "@mui/material/Paper";
import  Box  from "@mui/system/Box";

import { useParams ,useNavigate } from "react-router-dom";
import ActivityHistory from "./ActivityHistory";
const MainActionPage = ({bu}) =>{
    const { id } =useParams();
    const incident_id = useRef(id)
  const prevbusinessunit = useRef(bu)
  const navigate = useNavigate();
const [tabValue , setTabValue] = useState(0)
useEffect(()=>{
if(prevbusinessunit.current!==bu)
{
    navigate("/admin/incidents") 
}
},[bu])
    const tabs = [{
        title:"Main Page",
        content : <EditIncident bu={bu}/>
    },{
    title : "Activity History",
    content:<ActivityHistory id={incident_id.current} bu={bu}/>
    }]
    return <div style={{textAlign:"left" }}>
   
     <h4 style={{ paddingTop: 20 , marginLeft:20 }}>{id?`Incident Id:  ${incident_id.current}`:''}</h4>
     {id && <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>}
     {typeof id === "undefined" && <EditIncident bu={bu}/>
    
    }
     {/* </Box>
     </Paper> */}
 </div>
}
export default MainActionPage;