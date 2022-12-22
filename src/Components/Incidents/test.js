import React, { useState, useEffect } from "react";
import List from "@mui/material/List";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import componentData from "./dummydata";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FormControlLabel } from "@material-ui/core";
import { Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';

const ComponentList2= () => {
  const [components,setComponents] = useState([]); 
 const  [allChecked, setAllChecked]=useState(false) //selectAll
  const [checkedItems, setCheckedItems] = useState([]);
  const [componentLength,setComponentLength] = useState(7)
  const [status,setStatus]= useState('Operational')
  let newChecked = [...components];
useEffect(()=>{

console.log("com",components)
},[checkedItems])
useEffect(()=>{
 if(components.length<7)
 {
 setAllChecked(false)
 }
},[components])
useEffect(()=>{
  
if(allChecked)
{
  setComponents(['Adobe','API','Test2','Test1','Import','Export','Test'])//read all componentsnames 
}
},[allChecked])
  const handleAllChecked = (e) => {
    setAllChecked(e.target.checked);
    
    // setCheckedItems([]);
  };
  const handleToggle = (e) => {
    // let newChecked = [...checkedItems];
   
    // if (checkedItems.indexOf(e) === -1 ) {//if checked item not in the checkedItems array , push into the array
    //   newChecked.push(e);
    // } else {
    //   newChecked = checkedItems.filter((item) => item !== e); // remove item from checkedItems array(unchecking)
    // }
    if(components.indexOf(e)===-1)
    {
      newChecked.push(e)
    }
    else
{
 newChecked= components.filter(item=>item!==e)
}
    setCheckedItems(newChecked);
    setComponents(newChecked)  // changing selectAll status if any component is unchecked
  };
  const handleDropDownChange=(e) =>{
    setStatus(e.target.value)
  }
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={8}
      >
        <FormLabel sx={{ mt: 1, fontWeight:"bold" }}>Alert Users Subscribed To</FormLabel>
       
        <FormControlLabel
          control={
            <Checkbox
              checked={allChecked}
              name="selectall"
              onChange={handleAllChecked}
            ></Checkbox>
          }
          label="Select All"
        ></FormControlLabel>
      </Stack>
      <br />
      <List
        sx={{
          width: "100%",
          border: 1,
          borderRadius: "2px",
          borderColor: "#CFD2CF",
        }}
      >
        {componentData.map((component) => {
          return (
            <>
              {component["sub_component"].length > 0 ? (
                <>
                
                  <ListItem sx={{paddingTop:"2px"}}
                    key={component["component_name"]}
                    // secondaryAction={}
                  >
                    <ListItemIcon>
                      {/* <FiberManualRecordIcon className="greenIndicator" /> */}
                      <Checkbox
                        onChange={() =>
                          handleToggle(component["component_name"])
                        }
                        checked={
                          (allChecked && checkedItems.length===componentLength)
                            ? allChecked
                            :components.indexOf(
                                component["component_name"]
                              ) !== -1
                        }
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={component.component_name}
                    ></ListItemText>
                  </ListItem>
                  <Divider />
                  <List component="div">
                    {component["sub_component"].map((item) => {
                      return (
                        <>
                          <ListItem
                            sx={{ paddingLeft: "80px" ,paddingTop:"2px"}}
                            key={item["component_name"]}
                            secondaryAction={
                              <FormControl sx={{m:1,minWidth:160}} size="small">
                                <InputLabel id="demo-select-small">Status</InputLabel>
                                <Select label="status"labelId="demo-select-small" value={status}
                                onChange={handleDropDownChange}>
                              <MenuItem value="Operational">Operational</MenuItem>
                              <MenuItem value="Degraded Performance">Degraded Performance</MenuItem>
                              <MenuItem value="Degraded Performance">Partial Outage</MenuItem>
                              <MenuItem value="Degraded Performance">Major Outage</MenuItem>
                              <MenuItem value="Degraded Performance">Under Maintenance</MenuItem>
                              </Select></FormControl>
                            }
                          >
                            <ListItemIcon>
                              <Checkbox
                                checked={ //checkbox is selected based on "select All" or individual click
                                  allChecked
                                    ? allChecked
                                    : components.indexOf( //REPLACED CHECKEDITEMS WITH COMPONENTS
                                        item.component_name
                                      ) !== -1
                                }
                                onChange={() => {
                                  handleToggle(item["component_name"]);
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={item["component_name"]}
                              sx={{ pl: 4 }}
                            ></ListItemText>
                          </ListItem>

                          <Divider />
                        </>
                      );
                    })}
                  </List>
                </>
              ) : (
                <>
                  <ListItem sx={{paddingTop:"2px"}}
                    key={component["component_name"]}
                    secondaryAction={<div style={{color:"green",fontWeight:"bold"}}>{component.component_status}</div>}
                  >
                    <ListItemIcon>
                      {/* <FiberManualRecordIcon className="greenIndicator" /> */}
                      <Checkbox
                        checked={
                          allChecked
                            ? allChecked
                            :components.indexOf(component.component_name) !==
                              -1
                        }
                        onChange={() => {
                          handleToggle(component["component_name"]);
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={component.component_name}
                    ></ListItemText>
                  </ListItem>
                  <Divider />
                </>
              )}
            </>
          );
        })}
      </List>
    </>
  );
};
export default ComponentList2;
