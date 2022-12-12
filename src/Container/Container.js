import Header from "../Components/Header";
import React,{ useState} from "react"

import bglogo from "../assets/body_bg.png"
import { Grid } from "@mui/material";
import Box from '@mui/material/Box';
import NavPage from "../Components/NavPage";
import DashBoard from "../Components/DashBoard/Dashboard";
import { Route,Routes } from "react-router-dom";
import CreateIncident from "../Components/Incidents/CreateIncident";
import Sidebar from "../Components/TestSidebar/SidebarComponent";
import Subscribers from "../Components/Subscribers/Subscribers";
import IncidentPage from "../Components/Incidents/IncidentPage";
import { ThemeProvider } from '@mui/material/styles'
import theme from "../theme";
import SidebarComponent from "../Components/TestSidebar/SidebarComponent";
// import "./containerStyles
const Container = ({user}) => {
    const [collapse,setCollapse]=useState(false)
    const handleCollapse=(collapse)=>{       
     setCollapse(!collapse)
    }
    
    return <ThemeProvider theme={theme}>
        <section>
            <div style={{ height: "60px" }}> 
            <Header user={user}></Header>
            
             </div>
        </section>
        <section >
          
                <Grid container sx={{height:'100vh'}}>
                    <Grid item md={collapse?1:2}>
                   
                    <SidebarComponent handleCollapse={handleCollapse}></SidebarComponent>
                 </Grid>
                    <Grid item md={collapse?11:10}> 
                        <Routes>
                    <Route path="/admin/dashboard" element={<DashBoard/>}/>
                    <Route path="/admin/create_incident" element={<CreateIncident/>}/>
              <Route path="/admin/incidents" element={<IncidentPage/>}/> 
            <Route path="/admin/subscribers" element={<Subscribers/>}/> 
     </Routes>
                    </Grid>
                    </Grid>
                <div>
                </div>
          
        </section>


    </ThemeProvider>
}
export default Container;