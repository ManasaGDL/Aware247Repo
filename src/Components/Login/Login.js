import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue ,pink,green, lightBlue,cyan, red} from '@mui/material/colors';
import companylogo from "../../assets/data_axle.PNG"
import "./login.css"
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

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <div className="login">
    <ThemeProvider theme={theme}>
       
      <Container component="main" maxWidth="xs" className="login">
      <div style={{marginTop:10}}>
   <img src={companylogo} alt="data axle" />
   </div>
        <CssBaseline />
        <Paper elevation={24} variant="outlined">
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 6
          }}
        >
        
          <Typography component="h1" variant="h6" sx={{paddingTop:3}}>
           Login
          </Typography>
         
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1,pl:5,pr:5 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
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
        </Paper>
      </Container>
      
    </ThemeProvider>
     </div>
  );
}