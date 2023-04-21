import React from "react";
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import HeaderTabs from "../common/HeaderTabs";
import ViewIncidentWithDropDown from "./ViewIncidentWithDropDown";
import ScheduledMaintenance from "./ScheduledMaintenance";
import IncidentTemplate from "./IncidentTemplate";
import { useLocation } from "react-router-dom";
const IncidentPage=({bu})=>{
  const location = useLocation();

    const [tabValue, setTabValue] = React.useState(location?.state?.tabValue?location?.state?.tabValue:0 );
    //(location?.state?.tabValue) directing to specific tab :example::Directing to ScheduleMaintenance grid once SM instance is created
    

    const tabs= [
      { title: "View Incidents",
       content: <ViewIncidentWithDropDown bu={bu}></ViewIncidentWithDropDown>
      },
      { title: "Scheduled Maintenance",
      content:<ScheduledMaintenance/>
      },
      { title: "Incident Templates",
      content:<IncidentTemplate/>
      }
    ]
    return <div style={{textAlign:"left" }}>      
        <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>        
    </div>
}
export default IncidentPage;