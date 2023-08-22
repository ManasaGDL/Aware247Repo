import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import awarelogo from "../../assets/aware/Aware247Logo.png"
import awaresmall from "../../assets/aware/Aware247SmallIcon.png"
import api from '../../Api';
import { axiosInstance } from '../../axios';
import CustomDialogs from '../common/Dialogs/CustomDialogs';
// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
const initialLoginData = Object.freeze({
  username: "",
  password: ""
})
export default function Login() {
  const [loginData, setLoginData] = useState(initialLoginData)
  const navigate = useNavigate();
  const [ actionProgress ,setActionProgress] = useState(false)
  const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
  const [ resetActionProgress, setResetActionProgress]= useState(false)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionProgress(true)
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    setLoginData({
      username: data.get('email'),
      password: data.get('password'),
    })
    if (loginData) {
      try {
        const res = await api.login({
          username: data.get('email'),
          password: data.get('password')
        });
       
        if (res) {
          let { access, refresh } = res?.data;
          localStorage.setItem("access_token", access);
          localStorage.setItem("refresh_token", refresh);
          axiosInstance.defaults.headers["Authorization"] = "Bearer " + localStorage.getItem("access_token");
          const userResponse = await api.getUserProfile();
          const businessUnit = userResponse?.data?.Profile?.last_businessiunit_name
          localStorage.setItem("Privileges", userResponse?.data?.Privileges)
          localStorage.setItem("Profile", JSON.stringify(userResponse?.data?.Profile))
          localStorage.setItem("BU", businessUnit);
          localStorage.setItem("user", data.get("email").trim())
        setActionProgress(false)
          navigate("/admin/dashboard")
        }
      } catch (e) {
        setActionProgress(false)
      let keys;
     
        if(e.response?.data?.detail)
        {setOpenCustomDialog({open:true,message:e.response.data.detail,title:"Error"})
        
        }
      else{ keys= Object.keys(e.response.data);
        setOpenCustomDialog({open:true,message:keys.join(' , ')+" is required",title:"Error"})
      
      }
      }
    }
  };
  const stayOnSamePage = () => {
    setOpenCustomDialog({ open: false, message: "" });
    // window.location.reload(false)
  };
  const callToForgotPassword=async()=>{
   
    
 try{
  if(loginData?.username?.length>0)
{ setResetActionProgress(true)
  const res = await api.forgotPassword({"username":loginData?.username})
  setResetActionProgress(false)
setOpenCustomDialog({open:true,message:"Reset link has been sent to your mail",title:"Check your email"})
 }else{
  setOpenCustomDialog({open:true, message:"Enter username"})
 }
 }catch(e)
 {
  setResetActionProgress(false)
alert(e.response.data)
 }
  }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh', display: "flex", alignItems: "center" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
        >
          <img src={awarelogo} alt="awarelogo" />

        </Grid>
        <Grid item xs={12} sm={8} md={5}
          // component={Paper} elevation={6} 
          square>
          <Box
            sx={{
              width: "350px",
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: 90, height: 90, bgcolor: "white" }}>
              <img src={awaresmall} alt="small" height="90"
                width="135" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e)=>{
                  setLoginData({...loginData,username:e.target.value})
                }}
              />
           
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>{
                  setLoginData({...loginData,password:e.target.value})
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {actionProgress && <CircularProgress  sx={{marginLeft:0,color:"white",fontWeight:10}} size={20}/>}
                Sign In
              </Button>
              <Grid container>
                
                <Grid item xs>
                <label>{resetActionProgress && <CircularProgress  sx={{marginLeft:0,color:"blue",fontWeight:10}} size={20}/>} </label> 
                  <Link href="#" variant="body2" onClick={callToForgotPassword}>
                  Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>

            </Box>
          </Box>
        </Grid>
        <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
      </Grid>
    </ThemeProvider>
  );
}