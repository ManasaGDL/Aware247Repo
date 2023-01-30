import CircularProgress from '@mui/material/CircularProgress';
import  Box  from '@mui/material/Box';

const LoadingPanel=()=>{
return  <Box sx={{display:"flex" ,justifyContent:"center",alignItems:"center"}}>
<CircularProgress />
</Box>

} 
export default LoadingPanel;