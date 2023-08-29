import Header from "../Components/Header";
import React, { useState, useEffect ,useContext} from "react"
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
import { ProSidebarProvider } from "react-pro-sidebar";
import UpdateSubscriber from "../Components/Subscribers/UpdateSubscriber";
import TeamMembers from "../Components/TeamMembers/TeamMembers";
import CreateScheduleMaintenance from "../Components/Incidents/CreateScheduleMaintenance";
import ViewScheduleMaintenance from "../Components/Incidents/ViewScheduleMaintenance";
import { Dashboard } from "@mui/icons-material";
import Login from "../Components/Login/Login";
import Security from "../Components/Security/Security";
import { Outlet } from "react-router-dom";

// import "./containerStyles
const Container = ({ user, setLoggedInUser}) => {
    const [collapse, setCollapse] = useState(false)
    const [dynamicSideBarData, setDynamicSideBarData] = useState([])
    const [loading,setLoading] = useState(false)
    const [ containerWidth , setContainerWidth]= useState({width:window.innerWidth})
    const [bu,setBu]=useContext(businessUnitContext);
   

    useEffect(()=>{
        const handleResize=()=>{
            setContainerWidth({width:window.innerWidth})
        }
   window.addEventListener("resize",handleResize)
   return ()=>{
    window.removeEventListener("resize",handleResize)
   }
    },[])

    const handleCollapse = (collapse) => {
    
        setCollapse(!collapse)
    }
  

    return <>   
     <ProSidebarProvider> 
     {/* <businessUnitContext.Provider value={[bu , setBu]}>      */}
        <section>
        
            <div style={{ height: "60px" }}>
                {/* pass sidebar data from Header to container to SidebarComponent  */}
                <Header user={user} setLoggedInUser={setLoggedInUser} setDynamicSideBarData={setDynamicSideBarData} setLoading={setLoading} loading={loading}businessunit={setBu} ></Header>
              
            </div>
        </section>
        <section >
        
           { <Grid container sx={{ height: '100vh' }} spacing={1}>
                <Grid item 
                 md={collapse ? 1 : 2}
                 sm={collapse?1:2}
                 xs={12}
                >
                    <SidebarComponent width={window.innerWidth} handleCollapse={handleCollapse} setLoading={setLoading} collapse={collapse} loading={loading} dynamicSideBarData={dynamicSideBarData}></SidebarComponent>
                </Grid>
                <Grid item 
               sm={collapse?11:10}
                 md={collapse ? 11 : 10}
                 xs={12} 
               >
                <Paper sx={{mr: 4,ml:2 ,mt:4,mb:4, height:'auto'}} elevation={3}>
     <Box sx={{width:"100%",height:"100%"}}>
        <Outlet />
                  
                    </Box>
                    </Paper>
                </Grid>
            </Grid>}
            <div>
            </div>
             
          
        </section>
   
        </ProSidebarProvider>
    </>
}
export default Container;