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
const Container = ({ user}) => {
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
  
    // if (localStorage.getItem("access_token")) {
    //     axiosInstance.defaults.headers["businessunit"] = localStorage.getItem("BU");
    //     axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token")
    // }

    return <>   
     <ProSidebarProvider> 
     {/* <businessUnitContext.Provider value={[bu , setBu]}>      */}
        <section>
        
            <div style={{ height: "60px" }}>
                {/* pass sidebar data from Header to container to SidebarComponent  */}
                <Header user={user} setDynamicSideBarData={setDynamicSideBarData} setLoading={setLoading} loading={loading}businessunit={setBu} ></Header>
              
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
                    {/* <Routes>
                      <Route path="/login/*" element={<Dashboard />}/>
                       
                         <Route path="admin" element={<Navigate to="dashboard"/>}/> 
                      <Route path="admin">
                       <Route path="security" element={<Security/>}/>
                        <Route path="dashboard" element={<DashBoard bu={bu}/>} />
                        <Route path="teammembers" element={<TeamMembers/>}/>
                        <Route path="viewScheduleMaintenance/:id" element={<ViewScheduleMaintenance/>}/>
                        <Route path="scheduled/:action" element={<CreateScheduleMaintenance/>}/>
                        <Route path="scheduled/:action/:id" element={<CreateScheduleMaintenance/>}/>
                        <Route path="create_incident" element={<MainActionPage bu={bu} />} />
                        <Route path="create_incident/:action/:id" element={<MainActionPage bu={bu}/>}/>
                        <Route path="incidents" element={<IncidentPage bu={bu} />} />
                        <Route path="subscribers/manage/:id" element={<UpdateSubscriber/>}/>
                        <Route path="subscribers/addSubscriber" element={<AddSubscriber/>}/>
                        <Route path="subscribers" element={<Subscribers />} />
                        <Route path="components" element ={<Component/>}/>
                        </Route>
                        <Route path="*" element={<Navigate to="/login"/>}/>
                         <Route  element={<Navigate to="wrongurl"  />} />
                        <Route path="wrongurl" element={<h3>URL does not exists.</h3>}/>  
                        
                    </Routes> */}
                    </Box>
                    </Paper>
                </Grid>
            </Grid>}
            <div>
            </div>
             
          
        </section>
        {/* </businessUnitContext.Provider>   */}
        </ProSidebarProvider>
    </>
}
export default Container;