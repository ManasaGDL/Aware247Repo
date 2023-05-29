import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Status from "./Status";
import { Grid } from "@mui/material";
const Component = styled.div`
  background-color: #f7f8f9;
  padding: 8px 16px;
 padding-left:30px;
  border-radius: 3px;
  //   justify-content: space-between;
  align-items: left;
  display: flex;
  font-weight:600;
  height: 30px;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export default ({
  component,
  status,
  showLink = true,
  isSubComponent = false,
  id,
  bu,
  incidentCauseData,
}) => {
  const [incident, setIncident] = useState({});

  useEffect(() => {
    if (incidentCauseData?.length > 0) {
      setIncident(
        Object.values(incidentCauseData).find((item) => {
          return item.component_id === id;
        })
      );
    }
  }, [id, incidentCauseData]);

  return (
    <>
     
        <Grid container textAlign={"left"} alignItems="center" spacing={0}>
      
          <Grid item md={3} sx={{ fontWeight: "bold", padding:"8px 16px" ,fontWeight: "bold",
                            color: "rgb(101, 101, 101)",
                            fontSize: "14px" }}
                            sm={3}
                            >
                 <Component>           
            {component}
            </Component> 
          </Grid>
          <Grid item md={9} sm={9}>
          <Component>
            <Status isDashboardPage={true}
              labels={status}
              showLink={showLink}
              isSubComponent={isSubComponent}
              bu={bu}
              id={id}
              incidentId={incident?.incident_id}
            />
          </Component>
          </Grid>
          
        </Grid>
     </>
  );
};
