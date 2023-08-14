import React, { useState , useEffect,useRef , useContext} from "react";
import { AppBar,Toolbar,Typography ,Grid, TextField,Avatar,List,ListItem, ListItemText,ListItemButton} from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";

import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate, useSearchParams } from "react-router-dom"
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import api from "../Api";
import Box from "@mui/material/Box";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import { axiosInstance } from "../axios";
import businessUnitContext from "../context/businessUnitContext";
import awarelogo from "../assets/aware/Aware247Logo.png"

const useStyles = makeStyles( theme =>({
 
    abRoot: {
      // backgroundImage : `url(${bgLogo})`,
      height:"65px",
      backgroundColor:"white"
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
     const styles = {
      flex: {
        flex: 1,
      },
    };
const Header=({user,setDynamicSideBarData,businessunit,setLoading,loading})=>{
  const classes = useStyles();
  const navigate= useNavigate();
  const [businessunitdata,setBusinessunitdata]= useState([])
  const [selectedBU,setSelectedBU] =useState(localStorage.getItem("BU"))
  const [anchor,setAnchor] =useState(null)
const [ anchor2, setanchor2]= useState(null);
  const open = Boolean(anchor);
  const openAvatar= Boolean(anchor2)
  const [ searchParams , setSearchParams] = useSearchParams();
  const prevBU = useRef();
  const [ bu , setBu]= useContext(businessUnitContext);
  const [ openDialog , setOpenDialog]= useState(false);
  const [ newbusinessunit , setNewBusinessUnit] = useState('')
 const [ userData, setUserData]= useState([])
useEffect(()=>{
  if(searchParams.get("token"))
  {
   
  localStorage.setItem("access_token",searchParams.get("token"));
  localStorage.setItem("refresh_token",searchParams.get("token"));
  
  axiosInstance.defaults.headers["Authorization"]="Bearer "+localStorage.getItem("access_token");
  axiosInstance.defaults.headers["businessunit"]=localStorage.getItem("BU");
  
  }
  callBusinessUnits();
},[])
useEffect(()=>{
const data=JSON.parse(localStorage.getItem('Profile'));

  setUserData(JSON.parse(localStorage.getItem('Profile')))
},[])

    const callBusinessUnits=async()=>{
   try{
   
     const response= await api.getBusinessUnits();  
    setBusinessunitdata(response?.data?.BusinessUnits)

   }catch(e)
   {

   }
    }


  
  useEffect(()=>{
setLoading(true)
   const callSideBarAPI = async()=>{
    try{
   const res =await  api.getSideBarData()
   const user= JSON.parse(localStorage.getItem('Profile'))
 
  const last_login_BU = (localStorage.getItem('BU'))

   const switchUserApi = await api.switchBusinessUnit(user.user_id,{"last_businessiunit_name":last_login_BU});
   setDynamicSideBarData(res?.data);
   setLoading(false);
    }catch(e)
    {

    }
   }
  callSideBarAPI()
  },[selectedBU,bu])
  const handleChange =(e) =>{
   
    setAnchor(e.currentTarget)
    
  }
  const handleClose=(e)=>{ 
   
   if(e.target.innerText )
   { 
    prevBU.current = e.target.innerText
    setSelectedBU(e.target.innerText)
    businessunit(e.target.innerText)
    localStorage.setItem("BU",e.target.innerText)
   }
 else{
 setOpenDialog(true)
 }
    setAnchor(null)
  }

  const  createBussinessUnit=async()=>{
  try{

   setOpenDialog(false)
   setNewBusinessUnit('')
  }catch(e)
  {

  }

  }
  const handleAvatarClick=(e)=>{
setanchor2(e.currentTarget);
  }
  const handleCloseAvatar=()=>{
   setanchor2(null)
  }
    return <>
    <AppBar   sx={{ backgroundColor:"#FBFCFC"}}> 
       <Toolbar  sx={{ }}>
       <Typography variant="h2" component="div" sx={{ flex:"1",width:"300", display: {flexDirection:'column' } }}>
        <Grid container display={'flex'}>
          <Grid item md={2} xs={2} sx={{ display: { xs:"none", md: "flex" }}} >
          <img src={awarelogo} align="left" alt="data axle" width="280px" style={{paddingTop:10}}/>
          </Grid>
       <Grid item md={8} xs={2} justifyContent="center" >
        <FormLabel sx={{ color: "white",fontSize:30,marginLeft:25,color:"#1976d"}}>{localStorage.getItem("BU")}</FormLabel>
        </Grid>
        <Grid item md={2} xs={2} justifyContent="right" sx={{ display:{md:"flex"}}}>
        <IconButton onClick={ handleChange}>
        <MenuOpenIcon sx={{color:"white"}} fontSize="large"/>
        </IconButton>
        <Menu open={open} anchorEl={anchor} onClose={handleClose} onChange={e=>{console.log(e,"Mnu")}}>

          {businessunitdata?.map(bu=>{
            return <MenuItem key={bu} value={bu} onClick={handleClose}>{bu}</MenuItem>
          })}
        </Menu>
        </Grid>
        </Grid>
        </Typography>
        
      
        
        <div><Button variant="contained" sx={{mr:3,fontWeight:"",fontSize:"12px"}}
         onClick={()=>navigate("/admin/create_incident")}>Create Incident</Button>
         </div>
         {/* <Typography><FormLabel sx={{color:"grey",mr:2,fontWeight:600}} disableTypography='true'>{localStorage.getItem('user')}</FormLabel></Typography> */}
         <IconButton onClick={handleAvatarClick}>
         
         <Avatar   src="/broken-image.jpg" sx={{ bgcolor:"grey" }}>{JSON.parse(localStorage.getItem("Profile"))?.first_name?.charAt(0)+JSON.parse(localStorage.getItem("Profile"))?.last_name?.charAt(0)}</Avatar>
         </IconButton>
       </Toolbar > 
       <Menu open={openAvatar} anchorEl={anchor2} sx={{ display:"flex"}}
     onClose={handleCloseAvatar} 
       onChange={e=>{console.log(e,"Mnu")}}>


 <MenuItem key={1}  value={localStorage.getItem("user")} sx={{ fontWeight:300,color:"grey",textAlign:"center",
 ":hover":{"color":"#1798ff"}}}
//  value={bu}
  // onClick={handleClose}
  >
    {localStorage.getItem("user")}</MenuItem>
<MenuItem key={2} sx={{ fontWeight:300,color:"grey", ":hover":{"color":"#1798ff"}}} onClick={()=>{
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
  navigate("/admin/login")
}}>Log Out</MenuItem>
</Menu>
         </AppBar> 
 {/* <Box sx={styles.flex}>
        <AppBar position='fixed' disablegutters='true'sx={{ height:"70px"}}>
          <Toolbar>
          
            <img src={awarelogo} width="280px"/>
       
            <Typography variant='title' color='inherit' sx={styles.flex}>
            <Typography><FormLabel sx={{color:"black",mr:2}} disableTypography='true'>{localStorage.getItem('user')}</FormLabel></Typography>
            </Typography>
           
          </Toolbar>
        </AppBar>
      </Box> */}
     
        </>
}
export default Header;