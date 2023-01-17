import React from "react";
import styled from "styled-components";
import Status from "./Status";
import { Grid } from "@mui/material";
const Component = styled.div`
  background-color: #f7f8f9;
  padding: 8px 16px;
  border-radius: 3px;
//   justify-content: space-between;
  align-items: left;
  display: flex;
height:40px;
  :not(:last-child) {
    margin-bottom: 8px;
  }
`;

export default ({ component }) => {
 
  return (
    <Component>
        <Grid container textAlign={'left'} alignItems="center">
            <Grid item md={2} sx={{ fontWeight:500}}>
      {component.component}
      </Grid>
      <Grid item md={10}>
      <Status labels={component.status} />
      </Grid>
      </Grid>
    </Component>
  );
};
