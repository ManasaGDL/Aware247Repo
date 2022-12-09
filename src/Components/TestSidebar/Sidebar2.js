import React ,{useState} from "react";
import { Drawer, IconButton} from "@mui/material";
import { AiOutlineMenu ,AiOutlineArrowLeft,AiOutlineArrowRight} from "react-icons/ai";
import { Link, NavLink,useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu ,useProSidebar,SidebarHeader} from 'react-pro-sidebar';
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
 background-color:${props=>props.bg==="active"?"lightblue":""}
`;
// const useStyles = makeStyles({
//   // flexGrow: {
//   //   flex: '1',
//   // },
//   menuIcon: {
//      backgroundColor: '#3c52b2',
//     color: 'red',
//     float:"right",
//     margin: "10px",
//     padding:"20px",
//     fontSize:"10px",
//     '&:hover': {
//       backgroundColor: 'lightblue',
//        color: 'lightblue',
//   },
// }})
const Sidebar2=({handleCollapse})=>{
  // const classes = useStyles()
  const { collapseSidebar,toggleSidebar ,collapsed} = useProSidebar();
  const [toggled,setToggled]=useState(false)
  const location= useLocation();
  const styles = {
    sideBarHeight: {
      height: "145vh"
    },
    menuIcon : {
      float: "right",
      margin: "10px",
      fontSize:"15px",
    //   '&:hover':{
    //  backgroundColor:"lightblue"
    //   }
    },
    

  };
 const handleClick=()=>{
  collapseSidebar() 
  handleCollapse(collapsed)
 }
  return     <div style={{ display: 'flex', height: '100%',textAlign:"left"}}>
   <Paper elavation={3}>
    <Sidebar width="210px" className="hover">
     
    <IconButton onClick={()=>{handleClick()}

     }   sx={{ float: "right",
     marginTop: "5px",paddingTop:"5px",
     paddingBottom:"8px",
     fontSize:"15px",'&:hover':{color:'lightblue'}}}>
        
          {collapsed?<b><AiOutlineArrowRight style={{fontSize:"20px"}} /></b>:<b><AiOutlineArrowLeft style={{fontSize:"20px"}}/></b>}
       
        </IconButton>
        
  <Menu iconShape="square" >
    {/* <SubMenu label="Charts">
      <MenuItem> Pie charts </MenuItem>
      <MenuItem> Line charts </MenuItem>
    </SubMenu> */}
    {sidebardata.map(item=>{
  
      return  <Menuitem bg={`${item.path===location.pathname?"active":""}`}
      //className={` ${item.path==location.pathname?"active":""}`}
      
      icon={item.icon} routerLink={<NavLink to={item.path}/>}
      >
       <b style={{fontSize:"14px",color:"#656565"}}> {item.title}</b> 
        {/* <Link to={item.path}/>  */}
        
      {/* <NavLink className="link" to={item.path} >
        <div class="icon">{item.icon}</div>
        <div class="icon-text">{item.title}</div>
        </NavLink>  */}
        </Menuitem>
    })} 
  </Menu>
  </Sidebar>
  </Paper>
  </div>
}
export default Sidebar2;