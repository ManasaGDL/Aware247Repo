import React,{useState} from "react";
import styled from "styled-components";
import useStatus from "./useStatus";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import useIncidentId from "./useIncidentId";
const Status = styled.div`
  color: ${(props) => props.colour};
 
  background-color: ${(props) => props.backgroundColour};
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 13px;
  transition: 0.3s;
  font-weight:600;
  text-align:center;
  width:200px
  
`;

export default ({ labels,showLink,isSubComponent,id,bu,incidentId,isDashboardPage=false}) => {
//reusing Status component in STatusPage (isDashboardPage prop)
  const [status] = useStatus(labels);
  // const [incidentId] = useIncidentId(id,bu)

  return (<>{isDashboardPage?<Grid container spacing={2} 
    alignItems="center"
    justifyContent="center" 
         >
     <Grid item md ={isSubComponent?5:4} 
     >
    <Status colour={status?.colour} backgroundColour={status?.backgroundColour}>
      {labels} 
    </Status>
    </Grid>
  {showLink && <Grid item md={7} textAlign="center"> 
       <div style={{paddingLeft: isSubComponent?'':'55px'}}>{status?.name!=="Operational" && <Link className="incident-link" href={`/admin/create_incident/edit/${incidentId}`}>Due to Incident {incidentId}</Link>}
       </div>
    </Grid>}
   
    </Grid>:<Status colour={status?.colour} backgroundColour={status?.backgroundColour}>
      {labels} 
    </Status>}
    </> );
};
