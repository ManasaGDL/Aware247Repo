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
import AddSubscriber from "../Components/Subscribers/AddSubscriber";
import MainActionPage from "../Components/Incidents/MainActionPage";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Component from "../Components/ComponentPage/Component";
import businessUnitContext from "../context/businessUnitContext";
import Subscribe from "../Components/Client/Subscribe"
import { useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import UpdateSubscriber from "../Components/Subscribers/UpdateSubscriber";
import TeamMembers from "../Components/TeamMembers/TeamMembers";
import CreateScheduleMaintenance from "../Components/Incidents/CreateScheduleMaintenance";
import ViewScheduleMaintenance from "../Components/Incidents/ViewScheduleMaintenance";
import { Dashboard } from "@mui/icons-material";
import Login from "../Components/Login/Login";
// import "./containerStyles
const Container = ({ user }) => {
    const [collapse, setCollapse] = useState(false)
    const [dynamicSideBarData, setDynamicSideBarData] = useState([])
    const [loading,setLoading] = useState(false)
    const [bu, setBu] = useState(localStorage.getItem("BU"))//passing BU to components 
    const handleCollapse = (collapse) => {
       
        setCollapse(!collapse)
    }
  
    if (localStorage.getItem("access_token")) {
        axiosInstance.defaults.headers["businessunit"] = localStorage.getItem("BU");
        axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token")
    }

    return <>   
     <ProSidebarProvider> 
     <businessUnitContext.Provider value={[bu , setBu]}>     
        <section>
        
            <div style={{ height: "60px" }}>
                {/* pass sidebar data from Header to container to SidebarComponent  */}
                <Header user={user} setDynamicSideBarData={setDynamicSideBarData} businessunit={setBu}></Header>
              
            </div>
        </section>
        <section >
{/*         
            // localStorage.getItem('BU') */}
        
           { <Grid container sx={{ height: '100vh' }} spacing={2}>
                <Grid item md={collapse ? 1 : 2} xs={12}>
                    <SidebarComponent width={window.innerWidth} handleCollapse={handleCollapse} setLoading={setLoading} dynamicSideBarData={dynamicSideBarData}></SidebarComponent>
                </Grid>
                <Grid item md={collapse ? 11 : 10} xs={12}>
                <Paper sx={{mr: 4,ml:2 ,mt:4,mb:4, height:'auto'}} elevation={3}>
     <Box sx={{width:"100%",height:"100%"}}>
                    <Routes>
                        <Route path="/login/*" element={<Dashboard />}/>
                       
                        <Route path="admin" element={<Navigate to="dashboard"/>}/>
                       
                        <Route path="admin/dashboard" element={<DashBoard bu={bu}/>} />
                        <Route path="/admin/teammembers" element={<TeamMembers/>}/>
                        <Route path="/admin/viewScheduleMaintenance/:id" element={<ViewScheduleMaintenance/>}/>
                        <Route path="/admin/scheduled/:action" element={<CreateScheduleMaintenance/>}/>
                        <Route path="/admin/scheduled/:action/:id" element={<CreateScheduleMaintenance/>}/>
                        <Route path="admin/create_incident" element={<MainActionPage bu={bu} />} />
                        <Route path="admin/create_incident/:action/:id" element={<MainActionPage bu={bu}/>}/>
                        <Route path="admin/incidents" element={<IncidentPage bu={bu} />} />
                        <Route path="admin/subscribers/manage/:id" element={<UpdateSubscriber/>}/>
                        <Route path="admin/subscribers/addSubscriber" element={<AddSubscriber/>}/>
                        <Route path="admin/subscribers" element={<Subscribers />} />
                        <Route path="admin/components" element ={<Component/>}/>
                        {/* <Route path="*" element={<Navigate to="/login"/>}/> */}
                        <Route path="*" element={<Navigate to="wrongurl"  />} />
                        <Route path="wrongurl" element={<h3>URL does not exists.</h3>}/>
                    </Routes>
                    </Box>
                    </Paper>
                </Grid>
            </Grid>}
            <div>
            </div>
             
          
        </section>
        </businessUnitContext.Provider>  
        </ProSidebarProvider>
    </>
}
export default Container;