import React , { useState }  from "react"
import { AppBar , Checkbox, Divider, FormLabel, InputLabel, Toolbar, Typography  } from "@mui/material";
import companylogo from "../../assets/data_axle.PNG";
import { makeStyles } from "@material-ui/core/styles";
import bgLogo from "../../assets/body_bg.png";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
const useStyles = makeStyles((theme) => ({
    header: {
      backgroundImage: `url(${bgLogo})`,
      height: "80px",
      //   backgroundRepeat:"repeat-x"
    },
  
    select: {
      color: "white",
      "&:after": {
        borderBottomColor: "darkred",
      },
      "& .MuiSvgIcon-root": {
        color: "cyan",
      },
    },
  }));
 const SubscribePage = () =>{
    const classes = useStyles();
    const [ subscriptionType , setSubscriptionType ] = useState('Select Subsription Type')
    const [ email ,setEmail]= useState('')
    const handleChange =(e)=>{
    setSubscriptionType(e.target.value)
    }
    return  <div className="status">
    <AppBar className={classes.header}>
    <Toolbar sx={{ pl: 3 }}>
      <Typography
        variant="h2"
        component="div"
        sx={{
          flex: "1",
          width: "300",
          display: { xs: "none", sm: "block" },
        }}
      >
        <img
          src={companylogo}
          align="left"
          alt="data axle"
          height="60px"
          style={{ paddingTop: 10 }}
        />
      </Typography>
      
    </Toolbar>
  </AppBar>
<Container maxWidth = "sm" sx={{ marginTop:"120px"}}>
 <Box width={'800px'}>
 <Stack sx= {{
                    // margin: "auto",
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "50%",
                }}>
 <FormControl >
    <InputLabel>Subscription Type</InputLabel>
    <Select label = "Subscription Type" onChange = { handleChange } sx={{ minWidth:"300px"}}>
        <MenuItem value="Select Subsription Type">Select Subscription Type</MenuItem>
        <MenuItem value="email">Email</MenuItem>
        <MenuItem value="sms">SMS</MenuItem>
    </Select>
    <br/>
 </FormControl >
 {subscriptionType === "email" && <FormControl>
 <TextField type="email" value={ email||''} name="email" label =" Email Addess" onChange={(e)=>{
setEmail(e.target.value)
 }}></TextField>
 <label style={{ fontSize:10 , color:"grey"}}>This email address will be subscribed to future notifications</label>
 </FormControl>}
 <br/>
 { subscriptionType==="sms" &&
    <FormControl>
        <TextField label = "Phone"/>
        <br/>
        <FormControl/>
        <FormControl>
      <InputLabel>Select Network</InputLabel>
        <Select label = "Select Network">
            <MenuItem></MenuItem>
            </Select>
            <label style={{ fontSize:10 , color:"grey"}}>This Phone number will be subscribed to future notifications</label>
            </FormControl>
    </FormControl>
 }
 <br/>
 <Box  sx={{ display:"flex", alignItems:"flex-start" }}>

  <label style = {{ fontSize:"14px" ,fontWeight:"600", textAlign:"center",marginTop:"10px"}}>Alert Users Subscribed To</label>
 &nbsp;
 &nbsp;
 <FormControlLabel control={<Checkbox defaultChecked></Checkbox>} label="Check All"></FormControlLabel>

 </Box>
 <Divider/>
 </Stack>
 </Box>
</Container>
  </div>
 }
 export default SubscribePage;