import { AppBar,Toolbar,Typography } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import companylogo from "../assets/data_axle.PNG"
import bgLogo from "../assets/body_bg.png"
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom"
const useStyles = makeStyles( theme =>({
 
    header: {
      backgroundImage : `url(${bgLogo})`,
      height:"70px"
    //   backgroundRepeat:"repeat-x"

    }
     }))
const Header=({user})=>{
  const classes = useStyles();
  const navigate= useNavigate();
    return <>
    <AppBar className={classes.header}> 
       <Toolbar disableGutters sx={{ pl: 3 }}>
      
       <Typography variant="h6" component="div" sx={{ flex:"1", display: { xs: 'none', sm: 'block' } }}><img src={companylogo} align="left" alt="data axle" height="50px" style={{paddingTop:10}}/></Typography>
       <Typography><FormLabel sx={{color:"white",mr:2}} disableTypography>{localStorage.getItem('user')}</FormLabel></Typography>
        <div><Button variant="contained" sx={{color:"white",mr:3}} onClick={()=>navigate("/admin/create_incident")}>Create Incident</Button></div>
       
       </Toolbar >
            
        {/* <Typography>we</Typography> */}
          {/* <img src={bgLogo} width="1800px" height="100px" alt="data-axle" position="relative"></img> */}
            
      
         </AppBar> 

        </>
}
export default Header;