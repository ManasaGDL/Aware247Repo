import React, { useState, useEffect } from "react";
import List from "@mui/material/List";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import { componentData, componentData2 } from "./dummydata";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { FormControlLabel } from "@material-ui/core";
import { Stack } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import CustomDropDown from "./CustomDropDown";
import api from "../../Api";
const ComponentList2 = () => {
  const [components, setComponents] = useState([]); // maintains the current selected components
  const [allChecked, setAllChecked] = useState(false); //selectAll
  const [checkedItems, setCheckedItems] = useState([]);
  const [componentLength, setComponentLength] = useState();
  const [componentsData, setComponentsData] = useState([]); //read the response from api
  const [listComponents, setListComponents] = useState([]); //find the components(if component having sub components ignore the component and then read the subcomponents)
  const [status, setStatus] = useState("Operational");
  let newChecked = [...components];
  useEffect(() => {
    console.log("slec", components);
  }, [components]);
  // Here components array maintains the components selected,
  useEffect(() => {
    if (allChecked) {
      //if Select All selected, copy all the listComponents into components
      setComponents([...listComponents]);
      setComponentLength(listComponents.length);
    }
  }, [listComponents, allChecked]);
  // useEffect(() => {
  //   let subComponentsArray=[];
  //   // let componentsArray=componentsData.map(item=>{
  //   //      if(item.sub_component.length>0)
  //   //      {
  //   //        subComponentsArray=  item.sub_component.map(sub=>{ // read subcomponents
  //   //            return sub.component_name
  //   //          })

  //   //      }
  //   //      else{
  //   //        return item.component_name //reac components if sub component array is empty
  //   //      }
  //   //    })
  //   //  let newComponentsArray = componentsArray.filter(item=>{
  //   //    return item !== undefined  // filter undefined
  //   //  })
  //   //  setListComponents(newComponentsArray.concat(subComponentsArray));
  // },[componentsData])
  useEffect(() => {
    setComponents(checkedItems); // if any checkbox state changes(check or uncheck),
  }, [checkedItems]);
  useEffect(() => {
    async function getComponents() {
      try {
        const response = await api.getComponents();
        console.log(response?.data);
        setComponentsData(response?.data);
      } catch (e) {}
    }
    getComponents();
  }, []);
  useEffect(() => {
    if (components.length < 6) {
      setAllChecked(false);
    }
    if (components.length === componentLength) setAllChecked(true);
  }, [components]);
  useEffect(() => {
    if (allChecked) {
      let subComponentsArray = [];
      let componentsArray = componentsData.map((item) => {
        if (item.sub_component.length > 0) {
          subComponentsArray = item.sub_component.map((sub) => {
            // read subcomponents
            return sub.component_name;
          });
        } else {
          return item.component_name; //reac components if sub component array is empty
        }
      });
      let newComponentsArray = componentsArray.filter((item) => {
        return item !== undefined; // filter undefined
      });
      setListComponents(newComponentsArray.concat(subComponentsArray)); // concate components+ subcomponents
    } else if (!allChecked && componentLength === components.length) {
      setComponents([]); //clear COmponents array if SelectAll is cleared
    }
  }, [allChecked]);
  const handleAllChecked = (e) => {
    setAllChecked(e.target.checked);
  };
  const handleToggle = (e) => {
    if (components.indexOf(e) === -1) {
      //if component toggled is not present the components list--->add to list
      newChecked.push(e);
    } else {
      newChecked = components.filter((item) => item !== e); //if component toggled is already in component list then remove from the list
    }
    setCheckedItems(newChecked);
    // changing selectAll status if any component is unchecked
  };
  const handleDropDownChange = (e) => {
    setStatus(e.target.value);
  };
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={8}
      >
        <FormLabel sx={{ mt: 1, fontWeight: "bold" }}>
          Alert Users Subscribed To
        </FormLabel>

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
        {componentsData?.map((component) => {
          return (
            <>
              {component["sub_component"].length > 0 ? (
                <>
                  <ListItem
                    sx={{ paddingTop: "2px" }}
                    key={component["component_name"]}
                  >
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      Typography
                      sx={{
                        fontWeight: "bold",
                        color: "rgb(101, 101, 101)",
                        fontSize: "12px",
                      }}
                      primary={component.component_name}
                    ></ListItemText>
                  </ListItem>
                  <Divider />
                  <List component="div">
                    {component["sub_component"].map((item) => {
                      return (
                        <>
                          <ListItem
                            sx={{ paddingLeft: "80px", paddingTop: "2px" }}
                            key={item["component_name"]}
                            secondaryAction={
                              <CustomDropDown label={item["component_name"]} 
                            disabled={!components.includes(item.component_name)}
                                value={
                                  component.component_status
                                    .component_status_name
                                }
                              />
                            }
                          >
                            <ListItemIcon>
                              <Checkbox
                                checked={
                                  //checkbox is selected based on "select All" or individual click
                                  componentLength === components.length
                                    ? allChecked
                                    : components.indexOf(
                                        item.component_name
                                      ) !== -1
                                }
                                onChange={() => {
                                  handleToggle(item["component_name"]);
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              disableTypography
                              primary={item["component_name"]}
                              sx={{
                                pl: 4,
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "rgb(101, 101, 101)",
                              }}
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
                  <ListItem
                    sx={{ paddingTop: "2px" }}
                    key={component["component_name"]}
                    secondaryAction={
                      <CustomDropDown label={component["component_name"]} disabled={!components.includes(component.component_name)}
                        value={component.component_status.component_status_name}
                      />
                    }
                  >
                    <ListItemIcon>
                      {/* <FiberManualRecordIcon className="greenIndicator" /> */}
                      <Checkbox
                        checked={
                          componentLength === components.length
                            ? allChecked
                            : components.indexOf(component.component_name) !==
                              -1
                        }
                        onChange={() => {
                          handleToggle(component["component_name"]);
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      sx={{
                        fontWeight: "bold",
                        color: "rgb(101, 101, 101)",
                        fontSize: "12px",
                      }}
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
