import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import HeaderTabs from "../common/HeaderTabs";
import ViewIncidents from "./ViewIncidents";
import ScheduledMaintenance from "./ScheduledMaintenance";
const tabs= [
  { title: "Incidents",
  content:<ViewIncidents/>
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
    
    return <div style={{ margin: "20px 0 0 30px" }}>
       <Paper sx={{ m: 4 }} elevation={3}>
        <Box sx={{width:"100%"}}>
          <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>
        {/* <Tabs
        value={value}
        onChange={handleChange}
        
      >
        <Tab sx={{fontWeight:"bold"}}
          value="one"
          label="Incidents"
         
        />
        <Tab value="two" sx={{fontWeight:"bold"}}label="Scheduled Maintenance" />
        <Tab value="three"  sx={{fontWeight:"bold"}} label="Incident Templates" />
      </Tabs> */}
        </Box>
        </Paper>
    </div>
}
export default IncidentPage;