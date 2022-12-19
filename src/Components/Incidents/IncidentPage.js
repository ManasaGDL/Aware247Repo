import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import HeaderTabs from "../common/HeaderTabs";
import ViewIncidents from "./ViewIncidents";
import ViewIncidentWithDropDown from "./ViewIncidentWithDropDown";
import ScheduledMaintenance from "./ScheduledMaintenance";
import  Stack  from "@mui/material/Stack";
import { Button } from "@mui/material";
const tabs= [
  { title: "View Incidents",
   content: <ViewIncidentWithDropDown></ViewIncidentWithDropDown>
   //<ViewIncidentWithDropDown></ViewIncidentWithDropDown>
   //<ViewIncidents/>
 
  // <ViewIncidentWithDropDown></ViewIncidentWithDropDown>
  },
  { title: "Scheduled Maintenance",
  content:<ScheduledMaintenance/>
  },
  { title: "Incident Templates",
  content:<></>
  }
]
const IncidentPage=()=>{
    const [tabValue, setTabValue] = React.useState(0);
    
    return <div style={{textAlign:"left" }}>
       {/* margin: "20px 0 0 30px" */}
       <Paper sx={{ mr: 4,ml:2 ,mt:4,mb:4,}} elevation={3}>
        <Box sx={{width:"100%",height:900}}>
        <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>
        </Box>
        </Paper>
    </div>
}
export default IncidentPage;