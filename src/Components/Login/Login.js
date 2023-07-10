import React,{ useState , useEffect , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import businessUnitContext from '../../context/businessUnitContext';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { cyan} from '@mui/material/colors';
import companylogo from "../../assets/data_axle.PNG"
import api from '../../Api';
import "./login.css"
import auth from '../../auth';
import { axiosInstance } from '../../axios';

import { baseURL } from '../../axios';
const theme = createTheme({
 
  palette: {
    primary: cyan,
    secondary:{
      main: '#00e5ff'
      //
    },
components: {
  MuiToolbar: {
      styleOverrides: {
          dense: {
              height: 32,
              minHeight: 32
          }
      }
  }
}}});

export default function Login(props) {
  const initialLoginData = Object.freeze({
    username:"",
    password:"",
    isAuthenticated:false
  })
  const [loginData , setLoginData] = useState(initialLoginData);
  const [ bu ,setBu] = useContext(businessUnitContext);
  
  useEffect(()=>{
   
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
        callOktaPage();
  },[])

  const callOktaPage = async()=>{
    try{
      delete axiosInstance.defaults.headers["Authorization"];
   const response = await axiosInstance.get(`${baseURL}/auth/token`) ;
   if(response?.status === 200)
   {  
    window.location.replace(response?.data?.redirect_url)
   }
    }catch(e)
    {

    }
  }
  let navigate= useNavigate();
  const handleSubmit = async(event) => {
    let response;
    event.preventDefault();
    const data = new FormData(event.currentTarget);  
    setLoginData({username: data.get('email').trim(),password:data.get('password').trim()})    
    if(loginData)
    {
   try{
   response = await api.login({username: data.get('email').trim(),password: data.get('password').trim()})
  //  const res2= await api.getBussinessUnits();
       
  if(response)
 {let { access,refresh} = response.data;
 localStorage.setItem("access_token",access);
 localStorage.setItem("refresh_token",refresh);
 axiosInstance.defaults.headers["Authorization"]="Bearer "+localStorage.getItem("access_token");
 const userResponse= await api.getUserProfile();
       const businessUnit= userResponse?.data?.Profile?.last_businessiunit_name
       setBu(userResponse?.data?.Profile?.last_businessiunit_name);
localStorage.setItem("Privileges",userResponse?.data?.Privileges)
localStorage.setItem("Profile",JSON.stringify(userResponse?.data?.Profile))
localStorage.setItem("BU",businessUnit)
// api.getBusinessUnits();
// api.getUserProfile();
setLoginData({...loginData,isAuthenticated:true});
 props.setUser({
  email:data.get('email').trim()
 })
localStorage.setItem("user",data.get('email').trim())
navigate("/admin");}
   }catch(e)
   {console.log(e)
alert(e.response.data.detail)
   }
    }
  };

  return (<></>
  //   <div className="login">
  //   {/* <ThemeProvider theme={theme}>
  //      <Container component="main" maxWidth="xs" className="login">
  //     <div style={{marginTop:10}}>
  //  <img src={companylogo} alt="data axle" />
  //  </div>
  //       <CssBaseline />
  //       <Paper elevation={24} variant="outlined">
  //       {/* <Box
  //         sx={{
  //           marginTop: 1,
  //           display: 'flex',
  //           flexDirection: 'column',
  //           alignItems: 'center',
  //           paddingBottom: 6
  //         }}
  //       >
        
  //         <Typography component="h1" variant="h6" sx={{paddingTop:3}}>
  //          Login
  //         </Typography>
         
  //         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1,pl:5,pr:5 }}>
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             id="email"
  //             label="Email Address"
  //             name="email"
  //             autoComplete="email"
  //             autoFocus
  //           />
  //           <TextField
  //             margin="normal"
  //             required
  //             fullWidth
  //             name="password"
  //             label="Password"
  //             type="password"
  //             id="password"
  //             autoComplete="current-password"
  //           />
  //           {/* <FormControlLabel
  //             control={<Checkbox value="remember" color="primary" />}
  //             label="Remember me"
  //           /> */}
  //           {/* <Button
  //             type="submit"
  //             fullWidth
  //             variant="contained"
  //             sx={{ mt: 3, mb: 2 }}
  //           >
  //             Sign In
  //           </Button> */}
  //           {/* <Grid container>
  //             <Grid item xs>
  //               <Link href="#" variant="body2">
  //                 Forgot password?
  //               </Link>
  //             </Grid> */}
  //             {/* <Grid item>
  //               <Link href="#" variant="body2">
  //                 {"Don't have an account? Sign Up"}
  //               </Link>
  //             </Grid> */}
  //           {/* </Grid>
  //         </Box>
  //       </Box> */}
  //       {/* </Paper> 
  //     </Container> */}
      
  //   {/* </ThemeProvider> */} 
  //    </div>
  );
}