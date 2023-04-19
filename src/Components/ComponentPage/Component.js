import useFetch from "../../CustomHooks/useFetch";
import {
  Backdrop,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
  Typography,
  Divider,
  Grid,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import businessUnitContext from "../../context/businessUnitContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useContext, useState, useEffect } from "react";
import EditForm from "./Edit/EditForm";
import CustomDeleteDialog from "../common/Dialogs/CustomDeleteDialog";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import api from "../../Api";
import { SnackbarContext } from "../../context/SnackbarContext";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
const Component = () => {
  const bu = useContext(businessUnitContext);
  const { setSnackBarConfig } = useContext(SnackbarContext);

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    type: "",
    id: "",
  });
  const [openDialog, setOpenDialog] = useState({
    open: false,
    type: "",
    id: "",
  });
  const [callFetchApi, setCallFetchApi] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [state, makeApiCall] = useFetch(bu, callFetchApi); // make api for fetching component list for REUSABLITy
  const { data, loading, error } = state; 
 
  const [openCustomDialogs, setOpenCustomDialogs] = useState({
    open: false,
    message: "",
  });
  const [componentObj, setComponentObj] = useState({}); // get details of component obj
  const [selectedId, setSelectedId] = useState("");
  const [groupDataResult, setGroupDataResult] = useState([]);
  let groupArr = [];
 
  useEffect(() => { 
    getGroups();
  }, []);
  const getGroups = async () => {

    try {
        groupArr=[]
      const response = await api.getGroupComponents();
      if (response?.data) 
      {
        groupArr = response?.data?.map((item) => {
          return {
            name: item.component_name,
            id: item.component_id,
            group: item.group_no,
          };
        });
        
      }
      groupArr.push({
        name: "Create new component group",
        id: -3,
        group: -3,
      });
      groupArr.unshift({ name: "This Component doesn't belong to a group", id: -2, group: -2 })
     
      setGroupDataResult((() => {
        return [...groupArr];
      }));
    } catch (e) {}
  };
  useEffect(() => {
    if (selectedId) getComponentDetails(selectedId);
  }, [selectedId]);
  const handleOpenDialog = (id, type) => {
    setSelectedId(id);
    getComponentDetails(id);
    setOpenDialog({ open: true, type: type, id: id, action: "Edit" });
   
  };
  const getComponentDetails = async (id) => {
    try {
      setLoadingApi(true);
      const res = await api.getComponent(id);
      setComponentObj(res?.data);
    } catch (e) {
    } finally {
      setLoadingApi(false);
    }
  };

  const updateComponent = async (componentDetails) => {   
    let payload = {};
    try {
      if (componentDetails.action === "Create") {
        if (componentDetails.group === -2) {
          //To create a new independent component , send component name and description
          payload = {
            component_name: componentDetails.component_name,
            description: componentDetails.description,
          };
        } else if (componentDetails.group === -3 ) {
          payload = {
            component_name: componentDetails.component_name,
            description: componentDetails.description,
            new_group_name: componentDetails.newGroup,
          };
        } else {
          payload = {
            component_name: componentDetails.component_name,
            description: componentDetails.description,
            component_group: componentDetails.component_id,
          };
        }
        const response = await api.addComponent(payload);
        const message = `${componentDetails.component_name} ${componentDetails.type} succesfully Created`;
        setSnackBarConfig({
          open: true,
          message: message,
          severity: "success",
        });
        if (response.status === 201){
            makeApiCall();
             setGroupDataResult([])
             getGroups();
    }

      }
      if (componentDetails.action === "Edit") 
      {
        if (
          componentDetails.group === -3 &&
          componentDetails.newGroup.length > 0
        ) 
          payload = {
            component_name: componentDetails.component_name,
            description: componentDetails.description,
            new_group_name: componentDetails.newGroup,
          };
         else
          payload = {
            component_name: componentDetails.component_name,
            description: componentDetails.description,
            component_group: componentDetails.component_id,
          };
        const res = await api.editComponent(componentDetails.id, payload);
        const message = `${componentDetails.component_name} ${componentDetails.type} succesfully updated`;
        setSnackBarConfig({
          open: true,
          message: message,
          severity: "success",
        });
        if (res.status === 200) {
            makeApiCall();
            
            setGroupDataResult([])
              getGroups();
        }
      }
    } catch (e) {     
      if (e.response?.data) {
        const errordata = e.response.data.Error;
        setOpenCustomDialogs({
          open: true,
          message: errordata,
          title: "Error",
        });
      }
    } finally {
      setComponentObj({});
    }
    setOpenDialog({ open: componentDetails.open });
  };
  const deleteComponent = async (data) => {
    try {
      if (data.id) {
        const res = await api.deleteComponent(data.id);
        const message = `${data.name} ${data.type} succesfully deleted`;
        if (res.status === 200){ 
            makeApiCall();
         
        }
        setSnackBarConfig({
          open: true,
          message: message,
          severity: "success",
        });
      }
  
    } catch (e) {
    } finally {
      // makeApiCall(); // refresh
      setCallFetchApi(true);
    }
    setOpenDeleteDialog({ ...openDeleteDialog, open: data.open });
  };
  const stayOnSamePage = () => {
    setOpenCustomDialogs({ open: false, message: "" });

  };
  return (
    <div style={{ textAlign: "left" }}>
        {error && <h4>Error</h4>}
        {/* <h5 style={{ paddingTop: 20, marginLeft: 20 }}>Components</h5> */}
     
      <CustomDialogs
        open={openCustomDialogs.open}
        message={openCustomDialogs.message}
        title={openCustomDialogs.title}
        setOpenCustomDialog={setOpenCustomDialogs}
        hideButton={true}
        handleConfirmation={stayOnSamePage}
      />
      <Box
        sx={{
          
          height: "auto",
        }}
      >
      
        <Stack   direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={12}
            sx={{ height: 50, marginRight: 2 }}
      
        >
             <h5 style={{ paddingTop: 20, marginLeft: 20 }}>Components</h5>
          <StyledButton
            variant="contained"
            onClick={() =>
              setOpenDialog({ open: true, type: "Component", action: "Create" })
            }
          >
            {" "}
            + Add A Component
          </StyledButton>{" "}
        </Stack>
        <Box  sx={{
          pl: 2,
          pt: 2,
          pr: 3,
          mt: 0,
          backgroundColor: "white",
          height: "auto",
        }}>
         {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingPanel></LoadingPanel>
        </Backdrop>
      )}
        <br />
          
          {data.length === 0 && <div style={{  alignItems:"center" , display:"flex"}}><h5>No Components</h5></div>}
        {data.length > 0 && (
          <List
            sx={{
              width: "100%",
              border: 1,
              borderRadius: "2px",
              borderColor: "#CFD2CF",
            }}
          >
            {data.map((listItem) => {
              return (
                <>
                  {listItem["sub_component"]?.length > 0 ? (
                    <>
                      <ListItem
                        sx={{ paddingTop: 4 }}
                        key={listItem.component_id}
                      >
                        <ListItemText
                          disableTypography
                          sx={{
                            fontWeight: "bold",
                            color: "rgb(101, 101, 101)",
                            fontSize: "14px",
                            lineHeight: 1.2,
                          }}
                          primary={<>{listItem.component_name}</>}
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="text"
                            sx={{ fontWeight: "600" }}
                            onClick={() =>
                              handleOpenDialog(listItem.component_id, "Group")
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="text"
                            sx={{ fontWeight: "600" }}
                            onClick={() =>
                              setOpenDeleteDialog({
                                open: true,
                                id: listItem.component_id,
                                type: "Group",
                                name: listItem.component_name,
                              })
                            }
                          >
                            Deactivate
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>

                      <List component="div" disablePadding>
                        {listItem["sub_component"].map((item) => {
                          return (
                            <>
                              <ListItem
                                disableTypography
                                sx={{
                                  paddingLeft: "80px",
                                  paddingTop: "2px",
                                }}
                                key={item.component_id}
                              >
                                <ListItemText
                                  disableTypography
                                  sx={{
                                    fontWeight: "bold",
                                    color: "rgb(101, 101, 101)",
                                    fontSize: "14px",
                                    lineHeight: 1.2,
                                  }}
                                  primary={<>{item.component_name}</>}
                                />
                                <ListItemSecondaryAction
                                  sx={{ marginRight: 4 }}
                                >
                                  <Button
                                    variant="text"
                                    sx={{ fontWeight: "600" }}
                                    onClick={() =>
                                      handleOpenDialog(
                                        item.component_id,
                                        "Component"
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="text"
                                    sx={{ fontWeight: "600" }}
                                    onClick={() =>
                                      setOpenDeleteDialog({
                                        open: true,
                                        id: item.component_id,
                                        type: "Component",
                                        name: item.component_name,
                                      })
                                    }
                                  >
                                    Delete
                                  </Button>
                                </ListItemSecondaryAction>
                              </ListItem>
                            </>
                          );
                        })}
                      </List>
                      <Divider sx={{ ":last-child": { borderBottom: 0 } }} />
                    </>
                  ) : (
                    <>
                      <ListItem key={listItem.component_id}>
                        <ListItemText
                          disableTypography
                          sx={{
                            fontWeight: "bold",
                            color: "rgb(101, 101, 101)",
                            fontSize: "14px",
                            lineHeight: 1.2,
                          }}
                          primary={<>{listItem.component_name}</>}
                        />
                        <ListItemSecondaryAction sx={{ marginRight: 4 }}>
                          <Button
                            variant="text"
                            sx={{ fontWeight: "600" }}
                            onClick={() =>
                              handleOpenDialog(
                                listItem.component_id,
                                "Component"
                              )
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            variant="text"
                            sx={{ fontWeight: "600" }}
                            onClick={() =>
                              setOpenDeleteDialog({
                                open: true,
                                id: listItem.component_id,
                                type: "Component",
                                name: listItem.component_name,
                              })
                            }
                          >
                            Delete
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider sx={{ ":last-child": { borderBottom: 0 } }} />
                    </>
                  )}
                </>
              );
            })}
          </List>
        )}
        {/* To edit Component */}
        <Dialog
          open={openDialog.open}
          onClose={() => {
            setComponentObj({});

            setOpenDialog((prev) => {
              return { ...prev, open: false, id: prev.id };
            });
           
            setComponentObj({});
          }}
        >
          <DialogTitle>
            {openDialog.action === "Create"
              ? "Create Component"
              : `Edit ${openDialog.type}`}
          </DialogTitle>
          <DialogContent>
            <EditForm
              groupData={groupDataResult}
              loading={loadingApi}
              update={updateComponent}
              componentObj={componentObj}
              id={openDialog.id}
              type={openDialog.type}
              action={openDialog.action}
              getGroups={getGroups}
            />
          </DialogContent>
        </Dialog>
        <CustomDeleteDialog
          open={openDeleteDialog.open}
          id={openDeleteDialog.id}
          type={openDeleteDialog.type}
          deleteComponent={deleteComponent}
          name={openDeleteDialog.name}
        />
        <br />
        <br />
        <br />
        </Box>
      </Box>
    </div>
  );
};
export default Component;
