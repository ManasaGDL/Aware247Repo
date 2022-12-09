import { AppBar,Toolbar,Typography } from "@mui/material"
import { makeStyles } from "@material-ui/core/styles";
import companylogo from "../assets/data_axle.PNG"
import bgLogo from "../assets/body_bg.png"
import companylogo2 from "../assets/da2.png"
const useStyles = makeStyles( theme =>({
 
    header: {
      backgroundImage : `url(${bgLogo})`,
      height:"60px"
    //   backgroundRepeat:"repeat-x"

    }
     }))
const Header=()=>{
  const classes = useStyles();
    return <>
    <AppBar className={classes.header}> 
       <Toolbar disableGutters sx={{ pl: 3 }}>
       <Typography><img src={companylogo} alt="data axle" height="50px" style={{paddingTop:10}}/></Typography>
    
       </Toolbar >
            
        {/* <Typography>we</Typography> */}
          {/* <img src={bgLogo} width="1800px" height="100px" alt="data-axle" position="relative"></img> */}
            
      
         </AppBar> 

        </>
}
export default Header;