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