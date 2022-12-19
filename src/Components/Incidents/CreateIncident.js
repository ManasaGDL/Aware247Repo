import React, { useState, useEFfect, useEffect ,useContext} from "react";
import { useNavigate } from "react-router-dom";
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
import Button from "@mui/material/Button";
import api from "../../Api";
import { SnackbarContext } from "../../context/SnackbarContext";

const CreateIncident = () => {
  const [incidentStatus, setIncidentStatus] = useState("Investigating");
  const [componentsSelected, setComponentsSelected] = useState([]); // maintains state of components Selected--->receiving from componentlist2 component
  const [callCreateIncidentAPI, setCallCreateIncidentAPI] = useState(false);
  const { setSnackBarConfig} = useContext(SnackbarContext)
  const [filteredComponents,setFilteredComponents] = useState([])
  const [incidentObject, setIncidentObject] = useState({
    status: "investigating",
    components: [],
  });
  const [error, setError] = useState({ name: "" });
  let filteredArray=[];
  const navigate = useNavigate();
  // useEffect(()=>{
  //   console.log("fltedredcom",filteredComponents)
  //   setIncidentObject({
  //     ...incidentObject,
  //     components: filteredComponents,
  //     // [...incidentObject.components]
  //   });
  // },[filteredComponents])
  useEffect(() => {
    callCreateIncidentAPI && callCreateIncident();
  }, [incidentObject, callCreateIncidentAPI]);
  useEffect(() => {
    console.log("Incident Obj", incidentObject);
  }, [incidentObject]);

  const handleChange = (e) => {   //monitors change in IncidentStatus
    //setIncidentStatus(e.target.value);
  
    setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value });
  };
  const handleIncidentName = (e) => {
    // monitors change in IncidentName
    if (e.target.value.length > 0) setError({ name: [] });
    setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value });
  };
  const handleMessage = (msg) => {
    setIncidentObject({ ...incidentObject, message: msg });
  };
  const handleComponentStatus = (val) => {
    
    // read the component status from child ComponentList2
   filteredArray= incidentObject?.components?.filter(item=>{//to filter the deafult selected Value passed from dropdown component.....if dropdown is changed
      return item.name!==val.name
      
     })
     filteredArray.push(val)//add new value to array
     setIncidentObject({
      ...incidentObject,
      components: [...filteredArray]
      //filteredArray,
      // [...incidentObject.components]
    });
    // console.log(filteredArray)
     setFilteredComponents(filteredArray)
    // setIncidentObject({ //**** */
    //   ...incidentObject,
    //   components: [...incidentObject.components,val]
      // [...incidentObject.components]
    // });
  };
  const handleCreateIncident = () => {
    if (incidentObject.components.length > 0) {
      let filteredComponents = incidentObject.components.filter((com) => {
        //filter those components from inciedentobjects when components checkbox(maintained in componentSelected)is unchecked

        return componentsSelected.includes(com.name);
      }); 
      filteredComponents.forEach((obj) => {
        return delete obj.name; //here name is used to identify the component selected as in incidentObjects only component id is maintained
      });
      setIncidentObject({ ...incidentObject, components: filteredComponents });
    }
    setCallCreateIncidentAPI(true);
  };
  const callCreateIncident = async () => {
    try {
      const res = await api.createIncident(incidentObject);
      navigate("/admin/incidents")
      setSnackBarConfig({open:"true",message:"Incident created successfully", severity:"success"})
    } catch (e) {
      if (e?.response?.data) setError(e.response.data);
      setCallCreateIncidentAPI(false);
    } finally {
      setCallCreateIncidentAPI(false);
    }
  };
  const readComponents = (components) => {
    setComponentsSelected(components);
  };
  return (
    <>
      <div style={{ textAlign: "left" }}>
        {/* {/* <div style={{ margin: "20px 0 0 30px" }}> */}
        {/* <h5>Create an Incident</h5> */}
        {/* </div>  */}
        <Paper sx={{ mr: 4, ml: 2, mt: 4, mb: 4 }} elevation={3}>
          {/* <div style={{ margin: "20px 0 0 30px" }}> */}
          <h5 style={{ marginLeft: 20, paddingTop: 20 }}>Create an Incident</h5>
          {/* </div>  */}
          <Box sx={{ pl: 3, pr: 3, mt: 2, backgroundColor: "white" }}>
            <FormControl fullWidth>
              <Box>
                <TextField
                  fullWidth
                  id="outlined"
                  label="Incident Name"
                  value={incidentObject?.name}
                  onChange={handleIncidentName}
                  name="name"
                />
                <br />
                <br />
                {error?.name?.length > 0 ? (
                  <div style={{ color: "red" }}>{error.name[0]}</div>
                ) : (
                  ""
                )}
              </Box>
            </FormControl>
            <br />
            <br />
            <FormLabel id="status" sx={{ fontWeight: "bold" }}>
              Incident Status
            </FormLabel>
            <br />
            <RadioGroup
              row
              aria-labelledby="status"
              name="status"
              value={incidentObject?.status}
              onChange={handleChange}
            >
              <FormControlLabel
                default
                value="investigating"
                control={<Radio />}
                label="Investigating"
              />
              <FormControlLabel
                value="identified"
                control={<Radio />}
                label="Identified"
              />
              <FormControlLabel
                value="monitoring"
                control={<Radio />}
                label="Monitoring"
              />
              <FormControlLabel
                value="resolved"
                control={<Radio />}
                label="Resolved"
              />
            </RadioGroup>
            <FormLabel sx={{ fontWeight: "bold" }}>Message</FormLabel>
            <br />
            <TextEditor message={handleMessage}></TextEditor>
            {/* <ComponentList /> */}
            <ComponentList2
              handleComponentStatus={handleComponentStatus}
              readComponents={readComponents}
            />
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{ ml: 2, mt: 6, color: "white" }}
                size="large"
                onClick={() => handleCreateIncident()}
              >
                Create Incident
              </Button>
            </div>
          </Box>
          <br />
        </Paper>
      </div>
    </>
  );
};
export default CreateIncident;
