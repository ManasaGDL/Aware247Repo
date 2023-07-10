import { AppBar , Toolbar , Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";
import companylogo from "../../assets/data_axle.PNG";
import { makeStyles } from "@material-ui/core/styles"
import bgLogo from "../../assets/body_bg.png"
const useStyles = makeStyles((theme) => ({
    header: {
      backgroundImage: `url(${bgLogo})`,
      height: "75px",
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
const BasicHeader = () =>{
    // simple Header with Data axle logo
const classes = useStyles();
    return <AppBar className={classes.header}>
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
  
}
export default BasicHeader;