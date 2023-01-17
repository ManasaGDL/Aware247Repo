import React,{useState} from "react";
import styled from "styled-components";
import useStatus from "./useStatus";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
const Status = styled.div`
  color: ${(props) => props.colour};
  background-color: ${(props) => props.backgroundColour};
  padding: 5px 12px;
  border-radius: 12px;
  font-size: 13px;
  transition: 0.3s;
  font-weight:600;
`;

export default ({ labels }) => {
   
  const [status] = useStatus(labels);
  return (<Grid container spacing={2} textAlign="center" alignItems="center">
    <Grid item md={7} > 
     <LinearProgress variant="buffer" sx={{backgroundColor:`${status?.backgroundColour}`,borderRadius:5,height:12, 
     "& .MuiLinearProgress-bar": {
      backgroundColor: `${status?.colour}`,
      
    }}}
    value={status?.value} backgroundColour={status?.backgroundColour}
    /> 
     </Grid>
    <Grid item md={3}>
    <Status colour={status?.colour} backgroundColour={status?.backgroundColour}>
      {labels} 
    </Status>
    </Grid>
    <Grid item md={2}>
       {/* Incident:789 */}
       {status?.name!=="Operational" && <Link className="custom-link" href={`/admin/create_incident/edit/388`}>due to Incident 789</Link>}
    </Grid>
   
    </Grid>
  );
};
