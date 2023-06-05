import { useState, useEffect } from "react";
import {
  TextField,
  Select,
  FormControl,
  Box,
  InputLabel,
  MenuItem,
  Button,
  Backdrop,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { StyledButton } from "../../../CustomStyles/StyledComponents";
import api from "../../../Api";
import LoadingPanel from "../../common/TabPanel/LoadingPanel";
const EditForm = ({
  id,
  groupData,
  update,
  componentObj = {},
  type,
  action,
  loading,
  getGroups,
}) => {
  // for non categoryCOmponents(child components ) we are showing Group dropdown for which "type" prop is used
  const [componentName, setComponentName] = useState(
    (action === "Edit" && componentObj?.component_name) || ""
  );
  const [description, setDescription] = useState(
    (action === "Edit" && componentObj?.description) || ""
  );
  const [group, setGroup] = useState(componentObj?.group_no || -2);
  const [componentIdSelected, setComponentIdSelected] = useState("");
  // const [ groupData , setGroupData] = useState(groupData)
  //useState([{name:"This Component doesn't belong to a group",id:-2,group:-2}])
  const [prevGroup, setPrevGroup] = useState();
  const [newGroup, setNewGroup] = useState("");
  const [enableUpdateButton, setEnableUpdateButton] = useState(false);
  const [ actionProgress , setActionProgress ] = useState(false);

  useEffect(() => {
    setComponentName("");
    setDescription("");
  }, []);
  useEffect(() => {
    if (Object.keys(componentObj).length > 0) {
      setComponentName(componentObj?.component_name);
      setDescription(componentObj?.description);
      setGroup(componentObj?.group_no);
    }
  }, [componentObj]);
  useEffect(() => {
    let arr = groupData?.filter((item) => {
      // for mapping the Select we are using group_no ... so if its standalone component we need to show "doenst belong to any group" ,
      // so in groupData if no match is found we are setting group to -2
      return item.group === group;
    });
    if (arr?.length === 0) {
      setGroup(-2);
    }
  }, [group]);
  useEffect(() => {
    let val;
    if (groupData?.length > 0) {
      val = groupData?.filter((item) => {
        if (item.group === componentObj.group_no) {
          return item;
        }
      });
      setComponentIdSelected(val[0]?.id);
    }
  }, [groupData,componentObj]);


  const handleSetGroup = (e) => {
    setEnableUpdateButton(true);
    let val = groupData?.filter((item) => {     
      if (item.group === e.target.value) {
        return item.id;
      }
    });
    setComponentIdSelected(val[0]?.id);
    setGroup(e.target.value);

    // setGroup()
  };
  const handleUpdate = () => {
    let data;
    setActionProgress(true)
    if (action === "Edit")
      data =
        type === "Component"
          ? {
              id: id,
              component_name: componentName,
              description: description,
              open: false,
              group: group,
              action: action,
              component_id: componentIdSelected,
              type: type,
              newGroup: newGroup, // component id of group selected
            }
          : {
              id: id,
              component_name: componentName,
              description: description,
              open: false,
              action: action,
              type: type,
              component_id: componentIdSelected,
            };
    if (action === "Create")
      data = {
        open: false,
        component_name: componentName,
        description: description,
        open: false,
        group: group,
        component_id: componentIdSelected, // we need component_id of Parent COmponent, to create subcomponent under it
        type: type,
        action: action,
        newGroup: newGroup,
      };

    update(data); // passing data to Parent ie.Component
  };
  return (
    <Box sx={{ textAlign: "center", margin: 2 }}>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingPanel></LoadingPanel>
        </Backdrop>
      )}
      <form>
        <div>
          <FormControl>
            <TextField
              type="text"
              label="Component Name"
              variant="outlined"
              sx={{ minWidth: "300px" }}
              value={componentName}
              onChange={(e) => {
                setComponentName(e.target.value);
                setEnableUpdateButton(true);
              }}
            />
          </FormControl>
        </div>
        <div>
          <br />
          <FormControl>
            <TextField
              type="text"
              label="Description (optional)"
              sx={{ minWidth: "300px" }}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setEnableUpdateButton(true);
              }}
            />
          </FormControl>
        </div>
        <label style={{ color: "grey", fontSize: 10 }}>
          Give a helpful description of what this component does.
        </label>
        <br />
        <br />
        {type === "Component" && (
          <FormControl>
            <InputLabel id="Component-Group">Component Group</InputLabel>
            <Select
              sx={{ minWidth: "300px" }}
              labelId="Component-Group"
              id="group"
              label="Component Group"
              onChange={handleSetGroup}
              value={group}
            >
              {groupData?.map((item) => {
                return <MenuItem value={item.group}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
        )}

        <br />
        <br />
        {/* if new group(-3) , display textfiedl*/}
        {group === -3 && (
          <div>
            <FormControl>
              <TextField
                type="text"
                label="Group Name"
                sx={{ minWidth: "300px" }}
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
              />
            </FormControl>
            <br />
            <br />
            <Button
              variant="outlined"
              onClick={() => {
                setGroup(-2);
                setNewGroup("");
              }}
            >
              Cancel New Group Creation
            </Button>

            <br />
            <br />
          </div>
        )}

        <div>
          <StyledButton
            variant="contained"
            onClick={handleUpdate}
            disabled={action !== "Create" && enableUpdateButton === false}
          >
             { actionProgress && <CircularProgress size={20} sx={{color:"white"}}/>}
            {action === "Create" ? "Create Component" : "Update Component"}
          </StyledButton>
        </div>
      </form>
    </Box>
  );
};
export default EditForm;
