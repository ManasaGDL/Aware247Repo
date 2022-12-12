import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import theme from "../../theme";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import TextEditor from "../TextEditor";
import componentData from "./dummydata";
import ComponentList from "./ComponentList";
import ComponentList2 from "./ComponentList2";

const CreateIncident = () => {
  const [incidentStatus, setIncidentStatus] = useState("Investigating");
  const handleChange = (e) => {
    setIncidentStatus(e.target.value);
  };
  return (
    <>
      <div style={{ textAlign: "left" }}>
        <div style={{ margin: "20px 0 0 30px" }}>
          <h5>Create an Incident</h5>
        </div>
        <Paper sx={{ m: 4 }} elevation={3}>
          <Box sx={{ pl: 3, pr: 3, mt: 5, pt: 5, backgroundColor: "white" }}>
            <FormControl fullWidth>
              <Box>
                <TextField fullWidth id="outlined" label="Incident Name" />
              </Box>
            </FormControl>
            <br />
            <br />
            <FormLabel id="incidentstatus" sx={{fontWeight:"bold"}}>Incident Status</FormLabel>
            <br/>
            <RadioGroup
              row
              aria-labelledby="incidentstatus"
              name="incidentstatus"
              value={incidentStatus}
              onChange={handleChange}
            >
              <FormControlLabel
                default
                value="Investigating"
                control={<Radio />}
                label="Investigating"
              />
              <FormControlLabel
                value="Identified"
                control={<Radio />}
                label="Identified"
              />
              <FormControlLabel
                value="Monitoring"
                control={<Radio />}
                label="Monitoring"
              />
              <FormControlLabel
                value="Resolved"
                control={<Radio />}
                label="Resolved"
              />
            </RadioGroup>
            <FormLabel sx={{fontWeight:"bold"}}>Message</FormLabel>
            <br />
            <TextEditor></TextEditor>
            {/* <ComponentList /> */}
            <ComponentList2/>
          </Box>
          <br />
          <br />
          <br />
          <br />
        </Paper>
      </div>
    </>
  );
};
export default CreateIncident;
