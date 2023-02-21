import React, { useState , useEffect,useRef} from "react";
import { AppBar,Toolbar,Typography } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import companylogo from "../assets/data_axle.PNG"
import bgLogo from "../assets/body_bg.png"
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom"
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import api from "../Api";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const useStyles = makeStyles( theme =>({
 
    header: {
      backgroundImage : `url(${bgLogo})`,
      height:"65px"
    //   backgroundRepeat:"repeat-x"

    },
    
    select: {
      color:"white",
      "&:after": {
        borderBottomColor: "darkred",
        
      },
      "& .MuiSvgIcon-root": {
        color: "cyan",
      },
    },
     }))
const Header=({user,setDynamicSideBarData,businessunit})=>{
  const classes = useStyles();
  const navigate= useNavigate();
  const [businessunitdata,setBusinessunitdata]= useState([])
  const [selectedBU,setSelectedBU] =useState(localStorage.getItem("BU"))
  const [anchor,setAnchor] =useState(null)
  const open = Boolean(anchor)
const [businessUnit,setBusinessUnit]=useState(localStorage.getItem("BU"))
 const prevBU = useRef();
  useEffect(()=>{
 
    const callBusinessUnits=async()=>{
   try{

     const response= await api.getBusinessUnits();
    setBusinessunitdata(response?.data?.BusinessUnits)
   }catch(e)
   {

   }
    }
    callBusinessUnits();
  },[])
  
  useEffect(()=>{
 
   const callSideBarAPI = async()=>{
    try{
   const res =await  api.getSideBarData()
   const user= JSON.parse(localStorage.getItem('Profile'))
  const last_login_BU = (localStorage.getItem('BU'))
 
   const switchUserApi = await api.switchBusinessUnit(user.user_id,{"last_businessiunit_name":last_login_BU});
   setDynamicSideBarData(res?.data)
    }catch(e)
    {

    }
   }
  callSideBarAPI()
  },[selectedBU])
  const handleChange =(e) =>{
   
    setAnchor(e.currentTarget)
    
  }
  const handleClose=(e)=>{ 
   
   if(e.target.innerText)
   {
    prevBU.current = e.target.innerText
    setSelectedBU(e.target.innerText)
    businessunit(e.target.innerText)
    localStorage.setItem("BU",e.target.innerText)
   }
 
    setAnchor(null)
  }
    return <>
    <AppBar className={classes.header}> 
       <Toolbar  sx={{ pl: 3 }}>
       <Typography variant="h2" component="div" sx={{ flex:"1",width:"300", display: { xs: 'none', sm: 'block' } }}>
        <img src={companylogo} align="left" alt="data axle" height="50px" style={{paddingTop:10}}/>
        <FormLabel sx={{ color: "white",fontSize:30,marginLeft:35}}>{localStorage.getItem("BU")}</FormLabel>
        </Typography>
        
        <IconButton onClick={ handleChange}>
        <MenuOpenIcon sx={{color:"white"}} fontSize="large"/>
        </IconButton>
        <Menu open={open} anchorEl={anchor} onClose={handleClose} onChange={e=>{console.log(e,"Mnu")}}>

          {businessunitdata?.map(bu=>{
            return <MenuItem key={bu} value={bu} onClick={handleClose}>{bu}</MenuItem>
          })}
        </Menu>
       <Typography><FormLabel sx={{color:"white",mr:2}} disableTypography='true'>{localStorage.getItem('user')}</FormLabel></Typography>
        <div><Button variant="contained" sx={{color:"white",mr:3,fontWeight:"bold"}} onClick={()=>navigate("/admin/create_incident")}>Create Incident</Button></div>
       
       </Toolbar >
         </AppBar> 

        </>
}
export default Header;