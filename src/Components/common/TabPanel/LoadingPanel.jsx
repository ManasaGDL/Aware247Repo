import CircularProgress from '@mui/material/CircularProgress';
import  Box  from '@mui/material/Box';
const LoadingPanel=()=>{
return <Box sx={{display:"flex" ,justifyContent:"center",alignItems:"center",textAlign:"center"}}>
<CircularProgress />
</Box>
} 
export default LoadingPanel;