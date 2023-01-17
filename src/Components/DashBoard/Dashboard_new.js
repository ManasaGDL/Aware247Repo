import styled from "styled-components";
import { Paper } from "@mui/material";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DisplayComponents from "./DisplayComponents";
import { makeStyles, withStyles } from '@material-ui/core/styles';
const Container = styled.div`
max-width:1500px;
padding:32px;
margin:14px;
`

const dummydata=[
    {component:'API',status:'Operational'},{
    component:'Adobe',status:'DegradedPerformance'
  },
  {component:'Test2',status:'PartialOutage'
},
{ component:'Test1',status:'MajorOutage'
},{ component:'Import',status:'UnderMaintenance'
},{component:'Export',status:'DegradedPerformance'}]

const DashBoard_new = () =>{
   
return     <Container>
<Paper>
<Typography variant="h5" align="left" sx={{ paddingLeft:"20px",paddingTop:"10px",fontWeight:700 }}>Dashboard</Typography>
<Box>
    <br/><br/>
   <DisplayComponents data={dummydata}
// loading = {componentsLoading}
/>
</Box>
</Paper>
</Container>
}
export default DashBoard_new;