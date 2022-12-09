import Header from "../Components/Header";
import React,{ useState} from "react"

import bglogo from "../assets/body_bg.png"
import { Grid } from "@mui/material";
import Box from '@mui/material/Box';
import NavPage from "../Components/NavPage";
import DashBoard from "../Components/DashBoard/Dashboard";
import { Route,Routes } from "react-router-dom";
import Incidents from "../Components/Incidents/Incidents";
import Sidebar2 from "../Components/TestSidebar/Sidebar2";
import Subscribers from "../Components/Subscribers/Subscribers";
import Header2 from "../Components/Header2";
import { ThemeProvider } from '@mui/material/styles'
import theme from "../theme";
// import "./containerStyles
const Container = ({match}) => {
    const [collapse,setCollapse]=useState(false)
    const handleCollapse=(collapse)=>{
       
setCollapse(!collapse)
    }
    return <ThemeProvider theme={theme}>
        <section>
            <div style={{ height: "60px" }}> 
            <Header></Header>
             {/* <Header2/> */}
             </div>
        </section>
        <section >
          
                <Grid container sx={{height:'100vh'}}>
                    <Grid item md={collapse?1:2}>
                   
                    <Sidebar2 handleCollapse={handleCollapse}></Sidebar2>
                 </Grid>
                    <Grid item md={collapse?11:10}> 
                        <Routes>
                    <Route path="/admin/dashboard" element={<DashBoard/>}/>
       <Route path="/admin/incidents" element={<Incidents/>}/> 
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