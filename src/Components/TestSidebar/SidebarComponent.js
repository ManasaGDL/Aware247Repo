import React, { useState  , useEffect} from "react";
import { IconButton } from "@mui/material";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { NavLink, useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { sidebardata } from "../sidebar/sidebardata";

import Paper from "@mui/material/Paper";
import "../../App.css"
import styled from "styled-components";
const Menuitem = styled(MenuItem)`
 &: hover {
    background-color: red;
    // cursor: pointer;
  //  padding:5px,
  //   border-radius: 10px;
  }
 background-color:${props => props.bg === "active" ? "lightblue" : ""}
`;

const SidebarComponent = ({ handleCollapse, dynamicSideBarData }) => {
  
  const { collapseSidebar, toggleSidebar, collapsed } = useProSidebar();
 
  // const [toggled, setToggled] = useState(false)
  const location = useLocation();
  const styles = {
    sideBarHeight: {
      height: "145vh"
    },
    menuIcon: {
      float: "right",
      margin: "10px",
      fontSize: "15px",
      //   '&:hover':{
      //  backgroundColor:"lightblue"
      //   }
    },
  };

  const handleClick = () => {
    collapseSidebar()
    handleCollapse(collapsed)
  }

  return <div style={{ display: 'flex', height: '100%', textAlign: "left" ,position:'fixed'}}>
    <Paper elevation={3}>
       <Sidebar width="210px" >
         <IconButton onClick={() => { handleClick() }
    } sx={{
          float: "right",
          marginTop: "5px", paddingTop: "5px",
          paddingBottom: "8px",
          fontSize: "15px", '&:hover': { color: 'lightblue' }
        }}>
            {collapsed ? <b><AiOutlineArrowRight style={{ fontSize: "20px", }} /></b> : <b><AiOutlineArrowLeft style={{ fontSize: "20px" }} /></b>}

        </IconButton>
      
        <Menu >
          {sidebardata.map(item => {
            if (dynamicSideBarData.includes(item.title))
              return <Menuitem key={item.title}
                bg={`${item.path === location.pathname ? "active" : ""}`}
                 icon={item.icon} routerLink={<NavLink to={item.path} />}
              >
                <b style={{ fontSize: "14px" }}> {item.title}</b>
                </Menuitem>
          })}
           </Menu>
         </Sidebar>
    </Paper>
  </div>
}
export default SidebarComponent;