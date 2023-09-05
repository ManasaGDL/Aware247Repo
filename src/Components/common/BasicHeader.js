import { AppBar , Toolbar , Typography } from "@mui/material"
import  awarelogo from "../../assets/aware/Aware247Logo.png" 

const BasicHeader = () =>{
    return <AppBar sx={{ backgroundColor:"#FBFCFC"}}>
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
          src={awarelogo}
          align="left"
          alt="AWARE"
          height="60px"
          style={{ paddingTop: 10 }}
        />
      </Typography>
    
    </Toolbar>
  </AppBar>
  
}
export default BasicHeader;