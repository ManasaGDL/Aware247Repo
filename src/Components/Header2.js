import {AppBar,Typography,Toolbar} from '@mui/material';
import crosslogo from "../assets/da22.png"
import companylogo from "../assets/da2.png"
import crossWhite from "../assets/daX_white.png"
import bgLogo from "../assets/body_bg.png"
import { makeStyles } from '@material-ui/core';
const useStyles=makeStyles(theme=>({
    header:{
        backgroundColor:"white",
        backgroundImage : `url(${bgLogo})`,
        height:"60px",
        color:"white"
    }
}))
const Header2=()=>{
    const classes=useStyles();

    return <AppBar className={classes.header}>
        <Toolbar>
            <Typography>
                <img src={crossWhite} alt="da" height="60px"/>
            </Typography>
        </Toolbar>
        </AppBar>
}
export default Header2;