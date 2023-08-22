import React, { useState , useEffect,useRef , useContext} from "react";
import { AppBar,Toolbar,Typography ,Grid, TextField,Avatar,List,ListItem, ListItemText,ListItemButton,CircularProgress} from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate, useSearchParams } from "react-router-dom"
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import api from "../Api";
import Box from "@mui/material/Box";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Dialog from "@mui/material/Dialog";
import CustomDialogs from "./common/Dialogs/CustomDialogs";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { axiosInstance } from "../axios";
import businessUnitContext from "../context/businessUnitContext";
import awarelogo from "../assets/aware/Aware247Logo.png"
import { SnackbarContext } from "../context/SnackbarContext";
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
  const [ counter , setCounter]=useState(0)
  const openAvatar= Boolean(anchor2)
  const [ openCustomDialog ,setOpenCustomDialog]= useState({open:false})
  const { setSnackBarConfig} = useContext(SnackbarContext);
  const [ searchParams , setSearchParams] = useSearchParams();
  const prevBU = useRef();
  const [ bu , setBu]= useContext(businessUnitContext);
  const [ openDialog , setOpenDialog]= useState(false);
  const [ newbusinessunit , setNewBusinessUnit] = useState('')
 const [ userData, setUserData]= useState([])
 const [ resetPasswordError , setResetPasswordError]= useState({})
 const [ resetPasswordDialog , setResetPasswordDialog]= useState({open:false})
 const [ disableButton , setDisableButton]= useState(true)
 const [ profileUser, setProfileUser]= useState({})
 const [ actionProgress ,setActionProgress] = useState(false)
 const [ resetPasswordDetails , setResetPasswordDetails] = useState({
  // current_password:''
//  ,
 new_password:'',confirm_password:''})
useEffect(()=>{
  const profile = localStorage.getItem("Profile");
  setProfileUser(JSON.parse(profile))
  setResetPasswordDetails({})
  setResetPasswordError({})
  setCounter(0)
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
useEffect(()=>{

if(Object.keys(resetPasswordError).length===0 && counter>=1)
setDisableButton(false)
else setDisableButton(true)

},[resetPasswordError])
const handleChangePassword=async(payload)=>{
  try{
  const res= await api.changePassword({"password":payload?.new_password,user:profileUser?.user_id})

if(res?.status === 200)

setSnackBarConfig({open:true,message:"Password changed successfully",severity:"success"})
  setActionProgress(false)
  setResetPasswordDialog({open:false})
  setResetPasswordDetails({confirm_password:'',
  new_password:'',current_password:''})
  setOpenCustomDialog({open:false})
  }catch(e)
  {if (e.response?.data) {
    const errordata = Object.values(e.response.data);
    
    setOpenCustomDialog({ open: true, message: errordata, title: "Error" });
setResetPasswordDetails({})
  }}finally{
    setResetPasswordDialog({open:false}) 
    setResetPasswordDetails({})
    setActionProgress(false)
  }
  
}
const stayOnSamePage=()=>{
  setOpenCustomDialog({open:false})
  setResetPasswordDialog({open:false})
}
useEffect(()=>{
console.log(openCustomDialog)
},[openCustomDialog])

    return <>
    <AppBar   sx={{ backgroundColor:"#FBFCFC"}}> 
       <Toolbar  sx={{ }}>
       <Typography variant="h2" component="div" sx={{ flex:"1",width:"300", display: {flexDirection:'column' } }}>
        <Grid container display={'flex'}>
          <Grid item md={2} xs={2} sx={{ display: { xs:"none", md: "flex" }}} >
          <img src={awarelogo} align="left" alt="data axle" width="280px" style={{paddingTop:10}}/>
          </Grid>
       <Grid item md={8} xs={2} justifyContent="center" container>
        <Grid item >
        <FormLabel sx={{ color: "white",fontSize:30,marginLeft:25,color:"#1976d"}}>{localStorage.getItem("BU")}</FormLabel>
        </Grid>
      
        <Grid item  xs={2} justifyContent="left" sx={{ display:{md:"flex"}}}>
        <IconButton onClick={ handleChange} sx={{":hover":{ backgroundColor: 'inherit !important'}}}>
        <ArrowDropDownIcon sx={{color:"#1798ff",paddingTop:1}} fontSize="large"/>
        </IconButton>
        <Menu open={open} anchorEl={anchor} onClose={handleClose} onChange={e=>{console.log(e,"Mnu")}}>

          {businessunitdata?.map(bu=>{
            return <MenuItem key={bu} value={bu} onClick={handleClose}>{bu}</MenuItem>
          })}
        </Menu>
        
        </Grid>
        </Grid>
       
        </Grid>
        </Typography>      
      
        
        <div><Button variant="contained" sx={{mr:3,fontWeight:"",fontSize:"12px"}}
         onClick={()=>navigate("/admin/create_incident")}>Create Incident</Button>
         </div>
         {/* <Typography><FormLabel sx={{color:"grey",mr:2,fontWeight:600}} disableTypography='true'>{localStorage.getItem('user')}</FormLabel></Typography> */}
         <IconButton onClick={handleAvatarClick}>
         
         <Avatar   src="/broken-image.jpg" sx={{ bgcolor:"grey" }}>{JSON.parse(localStorage.getItem("Profile"))?.first_name?.charAt(0).toUpperCase()+JSON.parse(localStorage.getItem("Profile"))?.last_name?.charAt(0).toUpperCase()}</Avatar>
         </IconButton>
       </Toolbar > 
       <Menu open={openAvatar} anchorEl={anchor2} sx={{ display:"flex"}}
     onClose={handleCloseAvatar} 
       onChange={e=>{console.log(e,"Mnu")}}>


 

<MenuItem key={1}  value={localStorage.getItem("user")} sx={{ fontWeight:300,color:"grey",textAlign:"center",
 ":hover":{"color":"#1798ff"}}}
//  value={bu}
  onClick={handleCloseAvatar}
  >
    {localStorage.getItem("user")}</MenuItem>
    <MenuItem key={"reset"} sx={{ fontWeight:300,color:"grey", ":hover":{"color":"#1798ff"}}} onClick={e=>{
      setResetPasswordDialog({open:true})
    handleCloseAvatar()}}>
 Change Password
</MenuItem>
<MenuItem key={"user"} sx={{ fontWeight:300,color:"grey", ":hover":{"color":"#1798ff"}}} onClick={()=>{
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user")
 handleCloseAvatar()
  navigate("/admin/login")
}}>Log Out</MenuItem>
</Menu>


<Dialog open={ resetPasswordDialog?.open} onClose={() => {
    setResetPasswordDetails({})
    setActionProgress(false)
  setResetPasswordDialog({ open: false })}}>
  <DialogTitle>{"Change Password"}</DialogTitle>
  <DialogContent style={{ width: "350px" }}>
    <Box sx={{ textAlign: "center", margin: 2 }}>
      {/* <TextField
        name="current_password"
        fullWidth
        label="Current Password"
        onBlur={()=>setCounter(counter+1)}
        value={resetPasswordDetails?.current_password}
     onChange={(e)=>{
      
      setResetPasswordDetails(prev=>({...prev,current_password:e.target.value}))
      if(e.target.value===resetPasswordDetails?.new_password)
      {
        setResetPasswordError(prev=>({...prev,new_password:"New password shouldn't be same as current Password"}))
      }
      else
      {
        const newitems={...resetPasswordError};
        delete newitems?.new_password
        setResetPasswordError(newitems)
      }
     
     }}
      ></TextField> */}
      {/* {<div style={{ color: "red" }}>{error?.first_name}</div>} */}
     
      &nbsp;
      <TextField
        name="new_password"
        fullWidth
        label="New Password"
      value={resetPasswordDetails.new_password}
      onBlur={()=>setCounter(counter+1)}
      onChange={e=>{
        
        setResetPasswordDetails(prev=>({...prev,new_password:e.target.value}))
        // if(resetPasswordDetails.current_password === e.target.value)
        // {
        //   setResetPasswordError(prev=>({...prev,new_password:"New password shouldn't be same as current Password"}))
        // }
        // else{
       
          const newitems={...resetPasswordError};
        delete newitems?.new_password
        setResetPasswordError(newitems)
        // }
        if(resetPasswordDetails?.confirm_password!==e.target.value)
        {
          setResetPasswordError(prev=>({...prev,confirm_password_error:"Password didn't matched"}))
         
        }
        else{
          const newitems={...resetPasswordError};
        delete newitems?.confirm_password_error
        setResetPasswordError(newitems)
          
        }
      }}
      ></TextField>
        {<div style={{ color: "red" ,fontSize:"13px"}}>{resetPasswordError?.new_password}</div>}
         &nbsp;
      <TextField
        name="confirm_new_password"
        fullWidth
        label="Confirm New Password"
        type="text"
       value={resetPasswordDetails?.confirm_password}
       onBlur={()=>setCounter(counter+1)}
       onChange={e=>{
        // setCounter(counter+1)
        setResetPasswordDetails(prev=>({...prev,confirm_password:e.target.value}))
        if(resetPasswordDetails?.new_password!==e.target.value)
        setResetPasswordError(prev=>({...prev,confirm_password_error:"Password didn't matched"}))
      else
      {
        const newitems={...resetPasswordError};
        delete newitems?.confirm_password_error
        setResetPasswordError(newitems)
      }
     
       }}
      ></TextField>
       {<div style={{ color: "red",fontSize:"13px" }}>{resetPasswordError?.confirm_password_error}</div>}
      &nbsp;
      
    </Box>
  </DialogContent>
  <DialogActions>
    <Button
      variant="contained"
      type="submit"
      sx={{ color: "white", fontWeight: "600" }}
      disabled={disableButton}

      onClick={()=>{
        setActionProgress(true)
        handleChangePassword(resetPasswordDetails);
        
       
        // setCounter(0)
      }}
    >
      { actionProgress &&  <CircularProgress  sx={{marginLeft:0,color:"white",fontWeight:10}} size={20}/>}
Change Password
    </Button>
  </DialogActions>
</Dialog>
<CustomDialogs
            open={openCustomDialog?.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
         </AppBar> 
 
     
        </>
}
export default Header;