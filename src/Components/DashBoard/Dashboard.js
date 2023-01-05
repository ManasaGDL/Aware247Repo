
import Header from "../Header";
import { Grid } from "@mui/material";
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import UnderConstruction from "../UnderConstructionComponent";


const DashBoard=()=>{
    return <>
    <div style={{textAlign:"left"}}>
    <Paper sx={{height:700,width:900,display:'flex', justifyContent: 'center', mr: 4, ml: 2, mt: 4, mb: 4  ,
    alignItems: 'center', width:'auto'}} elevation={3} >  
                   
     <Box sx={{ pl: 3, pr: 3, mt: 2,backgroundColor:"white",position:"absolute"}}>
          
    <UnderConstruction/>
    
                    </Box>   
                    </Paper>      
        </div>
        </>
}
export default DashBoard;