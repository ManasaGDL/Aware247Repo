import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import {componentData} from "./dummydata";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FormControlLabel } from "@material-ui/core";
import { Stack } from "@mui/material";

const ComponentList = () => {
  const [allChecked, setAllChecked] = useState(false); //selectAll
  const [checkedItems, setCheckedItems] = useState([]);

  const handleAllChecked = (e) => {
    setAllChecked(e.target.checked);
    setCheckedItems([]);
  };
  const handleToggle = (e) => {
    let newChecked = [...checkedItems];
    if (checkedItems.indexOf(e) === -1) {//if checked item not in the checkedItems array , push into the array
      newChecked.push(e);
    } else {
      newChecked = checkedItems.filter((item) => item !== e); // remove item from checkedItems array(unchecking)
    }

    setCheckedItems(newChecked);
  };
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
                    secondaryAction={
                      <Checkbox
                     
                        onChange={() =>
                          handleToggle(component["component_name"])
                        }
                        checked={
                          allChecked
                            ? allChecked
                            : checkedItems.indexOf(
                                component["component_name"]
                              ) !== -1
                        }
                      />
                    }
                  >
                    <ListItemIcon>
                      <FiberManualRecordIcon className="greenIndicator" />
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
                            sx={{ paddingLeft: "80px",paddingTop:"1px" }}
                            key={item["component_name"]}
                            secondaryAction={
                              <Checkbox
                                checked={ //checkbox is selected based on "select All" or individual click
                                  allChecked
                                    ? allChecked
                                    : checkedItems.indexOf(
                                        item.component_name
                                      ) !== -1
                                }
                                onChange={() => {
                                  handleToggle(item["component_name"]);
                                }}
                              />
                            }
                          >
                            <ListItemIcon>
                              <FiberManualRecordIcon className="yellowIndicator" />
                            </ListItemIcon>
                            <ListItemText
                              primary={item["component_name"]}
                              sx={{ pl: 4}}
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
                    secondaryAction={
                      <Checkbox
                        checked={
                          allChecked
                            ? allChecked
                            : checkedItems.indexOf(component.component_name) !==
                              -1
                        }
                        onChange={() => {
                          handleToggle(component["component_name"]);
                        }}
                      />
                    }
                  >
                    <ListItemIcon>
                      <FiberManualRecordIcon className="greenIndicator" />
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
export default ComponentList;
