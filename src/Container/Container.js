import Header from "../Components/Header";
import React, { useState, useEffect } from "react"
import { Grid } from "@mui/material";
import DashBoard from "../Components/DashBoard/Dashboard";
import { Route, Routes ,Navigate} from "react-router-dom";
import Subscribers from "../Components/Subscribers/Subscribers";
import IncidentPage from "../Components/Incidents/IncidentPage";
import { ThemeProvider } from '@mui/material/styles'
import theme from "../theme";
import SidebarComponent from "../Components/TestSidebar/SidebarComponent";
import { axiosInstance } from "../axios";
import EditIncident from "../Components/Incidents/EditIncident";
import LoadingPanel from "../Components/common/TabPanel/LoadingPanel";
import DashBoard_new from "../Components/DashBoard/Dashboard_new";
import MainActionPage from "../Components/Incidents/MainActionPage";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
// import "./containerStyles
const Container = ({ user }) => {
    const [collapse, setCollapse] = useState(false)
    const [dynamicSideBarData, setDynamicSideBarData] = useState([])
    const [loading,setLoading] = useState(false)
    const [businessUnit, setBusinessUnit] = useState(localStorage.getItem("BU"))//passing BU to components 
    const handleCollapse = (collapse) => {
        setCollapse(!collapse)
    }
  
    if (localStorage.getItem("access_token")) {
        axiosInstance.defaults.headers["businessunit"] = localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token")
    }

    return <>         
        <section>
            <div style={{ height: "60px" }}>
                {/* pass sidebar data from Header to container to SidebarComponent  */}
                <Header user={user} setDynamicSideBarData={setDynamicSideBarData} businessunit={setBusinessUnit}></Header>
              
            </div>
        </section>
        <section >
        
           { <Grid container sx={{ height: '100vh' }} spacing={2}>
                <Grid item md={collapse ? 1 : 2} xs={12}>
                    <SidebarComponent handleCollapse={handleCollapse} setLoading={setLoading} dynamicSideBarData={dynamicSideBarData}></SidebarComponent>
                </Grid>
                <Grid item md={collapse ? 11 : 10} xs={12}>
                <Paper sx={{ mr: 4,ml:2 ,mt:4,mb:4,}} elevation={3}>
     <Box sx={{width:"100%",height:"100%"}}>
                    <Routes>
                        <Route path="admin" element={<Navigate to="dashboard"/>}/>
                        <Route path="admin/dashboard" element={<DashBoard bu={businessUnit}/>} />
                        <Route path="admin/create_incident" element={<MainActionPage bu={businessUnit} />} />
                        <Route path="admin/create_incident/:action/:id" element={<MainActionPage bu={businessUnit}/>}/>
                        <Route path="admin/incidents" element={<IncidentPage bu={businessUnit} />} />
                        <Route path="admin/subscribers" element={<Subscribers />} />
                      
                    </Routes>
                    </Box>
                    </Paper>
                </Grid>
            </Grid>}
            <div>
            </div>
        </section>
    </>
}
export default Container;