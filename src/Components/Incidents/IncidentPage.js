import React from "react";
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import HeaderTabs from "../common/HeaderTabs";
import ViewIncidentWithDropDown from "./ViewIncidentWithDropDown";
import ScheduledMaintenance from "./ScheduledMaintenance";
const IncidentPage=({bu})=>{
    const [tabValue, setTabValue] = React.useState(0);
    const tabs= [
      { title: "View Incidents",
       content: <ViewIncidentWithDropDown bu={bu}></ViewIncidentWithDropDown>
      },
      { title: "Scheduled Maintenance",
      content:<ScheduledMaintenance/>
      },
      { title: "Incident Templates",
      content:<></>
      }
    ]
    return <div style={{textAlign:"left" }}>      
        <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>        
    </div>
}
export default IncidentPage;