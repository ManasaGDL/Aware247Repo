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
// import "./containerStyles
const Container = ({ user }) => {
    const [collapse, setCollapse] = useState(false)
    const [dynamicSideBarData, setDynamicSideBarData] = useState([])
    const [businessUnit, setBusinessUnit] = useState(localStorage.getItem("BU"))//passing BU to components 
    const handleCollapse = (collapse) => {
        setCollapse(!collapse)
    }
  
    if (localStorage.getItem("access_token")) {
        axiosInstance.defaults.headers["businessunit"] = localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token")
    }

    return <ThemeProvider theme={theme}>
        <section>
            <div style={{ height: "60px" }}>
                {/* pass sidebar data from Header to container to SidebarComponent  */}
                <Header user={user} setDynamicSideBarData={setDynamicSideBarData} businessunit={setBusinessUnit}></Header>

            </div>
        </section>
        <section >

            <Grid container sx={{ height: '100vh' }}>
                <Grid item md={collapse ? 1 : 2}>
                    <SidebarComponent handleCollapse={handleCollapse} dynamicSideBarData={dynamicSideBarData}></SidebarComponent>
                </Grid>
                <Grid item md={collapse ? 11 : 10}>
                    <Routes>
                        <Route path="/admin" element={<Navigate to="/admin/dashboard"/>}/>
                        <Route path="/admin/dashboard" element={<DashBoard />} />
                        <Route path="/admin/create_incident" element={<EditIncident bu={businessUnit} />} />
                        <Route path="/admin/create_incident/:action/:id" element={<EditIncident bu={businessUnit}/>}/>
                        <Route path="/admin/incidents" element={<IncidentPage bu={businessUnit} />} />
                        <Route path="/admin/subscribers" element={<Subscribers />} />
                    </Routes>
                </Grid>
            </Grid>
            <div>
            </div>

        </section>


    </ThemeProvider>
}
export default Container;