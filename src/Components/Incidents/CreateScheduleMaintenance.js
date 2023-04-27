import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FormControl, Typography, Box, TextField, Switch } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import { Editor } from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
import DOMPurify from "dompurify";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import dayjs from "dayjs";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import api from "../../Api";
import {
  Stack,
  Checkbox,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Backdrop,
} from "@mui/material";
import useFetch from "../../CustomHooks/useFetch";
import businessUnitContext from "../../context/businessUnitContext";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { SnackbarContext } from "../../context/SnackbarContext";
const getInitialState = (defaultValue) => {
  if (defaultValue) {
    const blocksFromHtml = htmlToDraft(defaultValue);
    const { contentBlocks, entityMap } = blocksFromHtml;

    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  } else {
    return EditorState.createEmpty();
  }
};
const CreateScheduleMaintenance = () => {
  const bu = useContext(businessUnitContext);
  const [startDateTime, setStartDateTime] = useState();
  const [endDateTime, setEndDateTime] = useState();
  const [callFetchApi, setCallFetchApi] = useState(false);
  const [state] = useFetch(bu, callFetchApi);
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [componentStatusList, setComponentStatusList] = useState([]);
  const location = useLocation();
  const [responseerror, setresponseError] = useState({});
  const [dateError, setDateError] = useState();
  const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
  const [initialObj, setInitialObj] = useState({
    name: "",
    message: "",
    schstartdate: "",
    schenddate: "",
    components: [],
  });
  const [obj, setObj] = useState({
    name: "",
    message: "",
    schstartdate: "",
    schenddate: "",
    components: [],
  });
  const [finalObject, setFinalObject] = useState({ message: "" });

  const [selectedAllEnabled, setSelectedAllEnabled] = useState(false);
  const [allComponentsList, setAllComponentsList] = useState([]); // storing components id of all the "components"
  const [businessUnit, setBusinessUnit] = useState(bu);
  const { action, id } = useParams();
  const Sm_id = useRef(id);
  const [editorState, setEditorState] = useState(
    getInitialState(initialObj?.message)
  );

  useEffect(() => {
    if (typeof id !== undefined && action === "update") {
      // setFinalObject({...finalObject,message:location.state.message})
      setInitialObj({
        components: location?.state?.components,
        name: location?.state?.name,
        message: location?.state?.message,
        schstartdate: location?.state?.schstartdate || "",
        schenddate: location?.state?.schenddate || "",
      });
      setObj({
        components: location?.state?.components,
        name: location.state.name,
        message: location.state.message,
        schstartdate: location.state.schstartdate || "",
        schenddate: location.state.schenddate || "",
      });

      setComponentStatusList(
        location.state.components.map((item) => {
          return { component_id: item.component_id };
        })
      );
    }
  }, [id]);
  useEffect(() => {
    if (action === "update") {
      setObj({ ...initialObj });
    }
  }, [action]);
  useEffect(() => {
    if (action === "update") {
      setEditorState(() => {
        const contentBlock = htmlToDraft(initialObj?.message || "");
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        return editorState;
      });

      setObj({ ...initialObj });

      setFinalObject({ ...finalObject, message: obj.message });
    }
  }, [initialObj]);

  useEffect(() => {
    if (action === "update") {
    }
  }, [action]);
  useEffect(() => {
    if (obj.schstartdate) {
      // alert(dayjs(obj.schstartdate).hour());
      setStartDateTime(obj.schstartdate);
    }
    if (obj.schenddate) {
      setEndDateTime(obj.schenddate);
    }
  }, [obj.schstartdate, obj.schenddate]);
  const navigate = useNavigate();
  const { data, loading, error } = state;
  let componentsArray = [];

  const onEditorChange = (val) => {
    setEditorState(val);
    const rawContentState = convertToRaw(val.getCurrentContent());
    const htmlOutput = draftToHtml(rawContentState);
    const cleanHtml = DOMPurify.sanitize(htmlOutput);
    onChange && onChange(cleanHtml);
  };
  const onChange = (val) => {
    setObj((prev) => {
      return { ...prev, message: val };
    });

    setFinalObject({ ...finalObject, message: val });
  };
 
  useEffect(() => {
    let data;
    if (editorState)
      data = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    setObj((prev) => ({ ...prev, message: data }));

    setFinalObject({ ...finalObject, message: data });
  }, [editorState]);
  useEffect(() => {
    if (selectedAllEnabled) {
      setComponentStatusList([...allComponentsList]);
    }
  }, [selectedAllEnabled]);
  useEffect(() => {
    data?.length > 0 &&
      data?.forEach((item) => {
        if (item.sub_component?.length > 0) {
          item.sub_component.map((subcomponent) => {
            componentsArray.push({
              component_id: subcomponent.component_id,
              component_status:
                subcomponent.component_status.component_status_name,
            });
          });
        } else {
          componentsArray.push({
            component_id: item.component_id,
            component_status: item.component_status.component_status_name,
          });
        }
      });
    setAllComponentsList(componentsArray);
  }, [data]);

  useEffect(() => {
    setBusinessUnit(bu);
  }, [bu]);

  const handleChange = (e) => {
    setObj((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    // setInitialObj((prev) => {
    //   return { ...prev, [e.target.name]: e.target.value };
    // });
  };
  const handleSelectAll = (e) => {
    setSelectedAllEnabled(e.target.checked);
    if (!e.target.checked) {
      setComponentStatusList([]);
    }
  };
  const handleToggle = (component_name, component_id, component_status) => {
    setComponentStatusList(
      componentStatusList.filter((item) => {
        return item.component_id !== component_id;
      })
    );
    if (
      componentStatusList.findIndex((item) => {
        return item.component_id === component_id;
      }) === -1
    ) {
      setComponentStatusList([
        ...componentStatusList,
        {
          component_id: component_id,
          component_status: component_status,
        },
      ]);
    }
  };

  const handleCreateUpdateSM = async () => {
    let finalObj;
    try {
      if (action === "update") {
        let components = componentStatusList.map((com) => {
          return com.component_id;
        });
        finalObj = {
          ...obj,
          message: finalObject.message,
          components: components,
        };

        const rs = await api.updateScheduledIncident(id, finalObj);
        setSnackBarConfig({
          open: true,
          message: "Updated Successfully",
          severity: "success",
        });
      } else {
        finalObj = { ...obj, components: componentStatusList };

        const response = await api.createScheduleMaintenance(finalObj);
        setSnackBarConfig({
          open: true,
          message: "Created successfully",
          severity: "success",
        });
      }
      setObj({
        name: "",
        message: "",
        schstartdate: "",
        schenddate: "",
        components: [],
      });
      setInitialObj({
        name: "",
        message: "",
        schstartdate: "",
        schenddate: "",
        components: [],
      });
      navigate("/admin/incidents", { state: { tabValue: 1 } });
    } catch (e) {
      setresponseError(e.response.data);
      if (e.response?.data?.Error) {
        setOpenCustomDialog({
          open: true,
          message: e.response.data.Error,
          title: "Error",
        });
      }
    } finally {
    }
  };
  const stayOnSamePage = () => {
    setOpenCustomDialog({ open: false, message: "" });
  };
  const errorMessage = useMemo(() => {
    switch (dateError) {
      case "minDate":
        return "End Date should be greater than Start Date";
      case "minTime":
        return "End DateTime should be greater than Start DateTime";
      case "minDateTime":
        return "End Date should be greater than Start Date";
      // case 'invalidDate': {
      //   return 'Your date is not valid';
      // }
      default: {
        return "";
      }
    }
  });

  return (
    <div style={{ textAlign: "left" }}>
      <h4 style={{ paddingTop: 20, marginLeft: 20 }}>
        {action === "create"
          ? "Create Scheduled Maintenance "
          : " Update Schedule Maintenance "}
      </h4>
      <Box
        sx={{ pl: 3, pt: 2, pr: 3, mt: 0, backgroundColor: "white", pb: 10 }}
      >
        <CustomDialogs
          open={openCustomDialog.open}
          message={openCustomDialog.message}
          title={openCustomDialog.title}
          setOpenCustomDialog={setOpenCustomDialog}
          hideButton={true}
          handleConfirmation={stayOnSamePage}
        />
        <FormControl fullWidth>
          <Box>
            <TextField
              fullWidth
              id="outlined"
              label="Scheduled Maintenance "
              name="name"
              value={obj.name || ""}
              onChange={handleChange}
            />
            <br />
            <br />

            {responseerror?.name?.length > 0 ? (
              <div style={{ color: "red" }}>{responseerror.name[0]}</div>
            ) : (
              ""
            )}
          </Box>
        </FormControl>
        <FormLabel sx={{ fontWeight: "bold" }}>Message</FormLabel>
        <br />

        <Editor
          editorState={editorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          onEditorStateChange={onEditorChange}
        />
        <br />
        <br />
        <Stack direction={{ xs: 'column', sm: 'row',md:"row" }} spacing={{ xs: 1, sm: 2, md: 8 }}  >
          <div>
            <div>
              <FormLabel>Maintenance Start Time (CST)</FormLabel>
            </div>
            <DateTimePicker
              name="schstartdate"
              disablePast
              value={dayjs(obj.schstartdate)}
              sx={{ width: 350 }}
              onChange={(val) => {
                let onlyDate = val.$d.toISOString();
                // delete responseerror.schstartdate
                setresponseError({ ...responseerror, schstartdate: "" });

                setObj({ ...obj, schstartdate: onlyDate });
              }}
            />
            {responseerror?.schstartdate?.length > 0 ? (
              <div style={{ color: "red" }}>
                {responseerror.schstartdate[0]}
              </div>
            ) : (
              ""
            )}
          </div>

          <div>
            <div>
              <FormLabel>Maintenance End Time (CST)</FormLabel>
            </div>
            <DateTimePicker
              disablePast
              slotProps={{
                textField: {
                  helperText: errorMessage,
                },
              }}
              onError={(error) => {
                // setresponseError({'schenddate':['']})
                setDateError(error);
              }}
              name="schenddate"
              // dayjs().set('hour', 12).startOf('hour');
              minDateTime={dayjs(obj.schstartdate)
                .set("hour", dayjs(obj.schstartdate).hour())
                .startOf("hour")}
              value={dayjs(obj.schenddate)}
              onChange={(val) => {
                //  delete responseerror.schenddate
                setresponseError({ ...responseerror, schenddate: "" });
                setObj({ ...obj, schenddate: val.$d.toISOString() });
              }}
              // defaultValue={dayjs('2022-04-17T15:30')}
              sx={{ width: 350 }}
            />
            {responseerror?.schenddate?.length > 0 ? (
              <div style={{ color: "red" }}>{responseerror?.schenddate[0]}</div>
            ) : (
              ""
            )}
          </div>
          <div></div>
        </Stack>
        <br />
        {!loading && (
          <div style={{ paddingBottom: 20 }}>
            <Box>
              <Stack
                direction="row"
                spacing="8"
                alignItems={"flex-start"}
                mr={20}
                justifyContent="space-between"
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Notify Users Subscribed To
                </label>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAllEnabled}
                      name="selectall"
                      onChange={handleSelectAll}
                    ></Checkbox>
                  }
                  label="Select All"
                ></FormControlLabel>
              </Stack>
              {/* <CustomDialogs
                open={openCustomDialog.open}
                message={openCustomDialog.message}
                title={openCustomDialog.title}
                setOpenCustomDialog={setOpenCustomDialog}
                hideButton={true}
                handleConfirmation={stayOnSamePage}
              /> */}
              <Grid container>
                <Grid item md={12}>
                  <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <List
                      sx={{
                        border: 1,
                        borderRadius: "5px",
                        borderColor: "#CFD2CF",
                        maxWidth: "900px",
                      }}
                    >
                      {data.map((item) => {
                        return (
                          <>
                            {item.has_subgroup ? (
                              <>
                                {" "}
                                <ListItem
                                  key={item.component_id}
                                  // secondaryAction={<Checkbox onChange={(e)=>handleCategoryCheck(e,item.component_id)}/>}
                                >
                                  <ListItemText
                                    key={item.component_id}
                                    disableTypography
                                    sx={{
                                      fontSize: "16px",
                                      fontWeight: 600,
                                    }}
                                    primary={item.component_name}
                                  />
                                </ListItem>
                                <List>
                                  {item.sub_component.map((component) => {
                                    return (
                                      <ListItem
                                        key={component.component_id}
                                        sx={{ paddingLeft: "80px" }}
                                        secondaryAction={
                                          <Checkbox
                                            checked={
                                              componentStatusList.length > 0 &&
                                              componentStatusList.findIndex(
                                                (com) => {
                                                  return (
                                                    com.component_id ===
                                                    component.component_id
                                                  );
                                                }
                                              ) !== -1
                                                ? true
                                                : false
                                            }
                                            onChange={() => {
                                              handleToggle(
                                                component["component_name"],
                                                component["component_id"],
                                                component.component_status
                                                  .component_status_name
                                              );
                                            }}
                                          ></Checkbox>
                                        }
                                      >
                                        <ListItemText
                                          key={component.component_id}
                                          disableTypography
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: 600,
                                          }}
                                          primary={component.component_name}
                                        ></ListItemText>
                                      </ListItem>
                                    );
                                  })}
                                </List>
                                {/* <Divider /> */}
                              </>
                            ) : (
                              <ListItem
                                key={item.component_id}
                                secondaryAction={
                                  <Checkbox
                                    checked={
                                      componentStatusList.findIndex(
                                        (com) =>
                                          com.component_id === item.component_id
                                      ) !== -1
                                        ? true
                                        : false
                                    }
                                    onChange={() => {
                                      handleToggle(
                                        item["component_name"],
                                        item["component_id"],
                                        item.component_status
                                          .component_status_name
                                      );
                                    }}
                                  />
                                }
                              >
                                <ListItemText
                                  key={item.component_id}
                                  disableTypography
                                  sx={{ fontSize: "16px", fontWeight: 600 }}
                                  primary={item.component_name}
                                ></ListItemText>
                              </ListItem>
                            )}
                            <Divider
                              sx={{ ":last-child": { borderBottom: 0 } }}
                            />
                          </>
                        );
                      })}
                    </List>
                  </Box>
                </Grid>
              </Grid>
              <br />
              <div style={{ textAlign: "center" }}>
              <StyledButton
                variant="contained"
                onClick={() => {
                  handleCreateUpdateSM();
                }}
              >
                {action === "create" ? "Create " : "Update "}
              </StyledButton>
              </div>
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
};
export default CreateScheduleMaintenance;
