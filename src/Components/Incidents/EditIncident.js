import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Backdrop from "@mui/material/Backdrop";
import { FormControl, Typography, InputLabel } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DOMPurify from "dompurify";
import Tooltip from "@mui/material/Tooltip";
import { DateTimePicker } from "@mui/x-date-pickers";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
import api from "../../Api";
import { SnackbarContext } from "../../context/SnackbarContext";
import LinearProgress from "@mui/material/LinearProgress";
import statuses from "../DashBoard/statuses";
import LoadingPanel from "../common/TabPanel/LoadingPanel";

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
const EditIncident = ({ bu }) => {
  const [initialObj, setInitialObj] = useState({ status: "investigating"    });
  const [incidentObject, setIncidentObject] = useState({
    status: "investigating",
  //  start_time:"",
  //  end_time:""
  });
  const [incidentstatus, setIncidentStatus] = useState("investigating");
  const [callCreate, setCallCreate] = useState(false);
  const [callUpdate, setCallUpdate] = useState(false);
  const [componentsData, setComponentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uncheckedComponents, setUncheckedComponents] = useState([]);
  const [componentStatusList, setComponentStatusList] = useState([]);
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [dropdownStatus, setDropDownStatus] = useState([]);
  const [selectAllchecked, setSelectAllChecked] = useState(false);
  const [error, setError] = useState({ name: "" });
  const [action, setAction] = useState("");
  const [finalConfirmationStatus, setFinalConfirmationStatus] = useState(false);
  const [changeStatus, setChangeStatus] = useState(false);
  const [initialStatus, setInitialStatus] = useState(initialObj?.status); //reads status from api response of getIncident
  const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
  const [trackStatus, setTrackStatus] = useState(initialObj?.status);
  const [finalObjToUpdate, setFinalObjToUpdate] = useState({}); ////reads status from api response of getIncident and bears current change of status
  const [editorState, setEditorState] = useState(
    getInitialState(initialObj.message)
  );
  const [incidentTemplates, setIncidentTemplates] = useState([]);
  const [templateSelected, setTemplateSelected] = useState("");
  const [selectedTemplateObject, setSelectedTemplateObject] = useState({});
  const [impactSeverityList, setImpactSeverityList] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [mailObject, setMailObject] = useState("");
  const [dateError, setDateError] = useState();
  const [responseerror, setresponseError] = useState({});
  let statusArray = [];
  const { id } = useParams();
  const navigate = useNavigate();
  const incident_id = useRef(id);
  let recipientList = [];
  const prevbusinessunit = useRef(bu);
  useEffect(() => {
    setLoading(true);
    if (typeof id === "undefined") {
      setAction("create");
      setInitialObj({ status: "investigating" });
      setIncidentObject({
        status: "investigating",
        // start_time: "",
        // end_time: "",
      });
      setIncidentStatus("investigating");
      setComponentStatusList([]);
    } else {
      setIncidentStatus(null);
      setAction("edit");
    }
  }, [id]);

  useEffect(() => {
    if (prevbusinessunit.current !== bu) {
      navigate("/admin/incidents");
    }
  }, [bu]);
  const onEditorChange = (val) => {
    setEditorState(val);
    const rawContentState = convertToRaw(val.getCurrentContent());
    const htmlOutput = draftToHtml(rawContentState);
    const cleanHtml = DOMPurify.sanitize(htmlOutput);
    onChange && onChange(cleanHtml);
  };
  useEffect(() => {
    //track unchecked
    if (action === "edit") {
      const results = initialObj?.components?.filter(
        ({ component_id: id1 }) =>
          !componentStatusList.some(({ component_id: id2 }) => id2 === id1)
      );
      setUncheckedComponents(results);
    }
  }, [initialObj, componentStatusList]);
  useEffect(() => {
    setEditorState(() => {
      const contentBlock = htmlToDraft(initialObj?.message || "");
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    });
    setTrackStatus(initialObj.status);
    setInitialStatus(initialObj.status);
    setIncidentObject({ ...initialObj });
    if (initialObj.hasOwnProperty("components")) {
      setComponentStatusList(
        initialObj.components.map((obj) => {
          if (obj.sub_component?.length > 0) {
            return {
              component_id: obj.sub_component.component_id,
              component_status: obj.sub_component.component_status,
            };
          } else
            return {
              component_id: obj.component_id,
              component_status: obj.component_status,
            };
        })
      );
    }
  }, [initialObj]);
  useEffect(() => {
    if (action === "edit") {
      setIncidentObject({
        ...incidentObject,
        components: componentStatusList,
        uncheck_component: uncheckedComponents,
      });
      setFinalObjToUpdate({
        ...finalObjToUpdate,
        components: componentStatusList,
        uncheck_component: uncheckedComponents,
      });
    }
  }, [uncheckedComponents, componentStatusList]);
  useEffect(() => {
    if (typeof id !== "undefined") setIncidentStatus(incidentObject?.status); /// reading status from response
  }, [incidentObject]);
  useEffect(() => {
    // const data = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    let data;
    if (editorState)
      data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    //     const blocks = manipulateRawBlocks(data)
    // const newRawState = { ...data, blocks }
    // const _html = draftToHtml(newRawState)
    setIncidentObject({ ...incidentObject, message: data });
    setFinalObjToUpdate({ ...finalObjToUpdate, message: data });
  }, [editorState]);
  useEffect(() => {
    id && callGetIncident();
  }, []);
  useEffect(() => {
    if (templateSelected) getTemplateDetails();
  }, [templateSelected]);

  const getTemplateDetails = async () => {
    try {
      const res = await api.getTemplateDetails(templateSelected);
      setSelectedTemplateObject({
        name: res?.data?.incident_title,
        message: res?.data.description,
      });
    } catch (e) {}
  };
  useEffect(() => {
    async function getComponents() {
      try {
        setLoading(true);
        const response = await api.getComponents();
        setComponentsData(response?.data);
        setLoading(false);
      } catch (e) {}
    }
    getComponents();
    getTemplatesList();
    getSeverityList();
  }, [bu]);
  const getSeverityList = async () => {
    try {
      const res = await api.getSeverityList();
      setImpactSeverityList(res?.data);
    } catch (e) {}
  };
  useEffect(() => {
    if (action === "create" && Object.keys(selectedTemplateObject).length > 0) {
      setInitialObj({
        name: selectedTemplateObject.name,
        message: selectedTemplateObject.message,
        status:"investigating"
      });
      setIncidentObject({
        name: selectedTemplateObject.name,
        message: selectedTemplateObject.message,
        status:"investigating"
      });
    }
  }, [selectedTemplateObject]);
  const getTemplatesList = async () => {
    try {
      const res = await api.getIncidentTemplates();

      setIncidentTemplates(
        res?.data.results.map((template) => {
          return { id: template.template_id, name: template.template_name };
        })
      );
    } catch (e) {}
  };
  useEffect(() => {
    if (callCreate) {
      callCreateIncidentApi();
    }
    if (callUpdate) {
      callUpdateIncidentApi();
    }
  }, [callCreate, callUpdate]);
  useEffect(() => {
    if (selectAllchecked) {
      setComponentStatusList(dropdownStatus);
    }
    if (!selectAllchecked) {
      // setComponentStatusList([])
    }
  }, [selectAllchecked]);

  useEffect(() => {
    if (changeStatus) {
      setIncidentObject({ ...incidentObject, status: trackStatus });
      setFinalObjToUpdate({ ...finalObjToUpdate, status: trackStatus });
      setIncidentStatus(trackStatus);
    }
  }, [changeStatus]);

  useEffect(() => {
    componentsData.length > 0 &&
      componentsData.forEach((item) => {
        if (item.sub_component.length > 0) {
          item.sub_component.map((subcomponent) => {
            statusArray.push({
              component_id: subcomponent.component_id,
              component_status:
                subcomponent.component_status.component_status_name,
              component_last_status: subcomponent.com,
            });
          });
        } else {
          statusArray.push({
            component_id: item.component_id,
            component_status: item.component_status.component_status_name,
          });
        }
      });
    setDropDownStatus(statusArray); // dropdown status captured from api response
  }, [componentsData]);

  const callGetIncident = async () => {
    //get detailts w rt specific incident
    try {
      recipientList = [];
      let list = [];
      const res = await api.getIncident(incident_id.current);
      setLoading(false);
      setInitialObj(res?.data);
      setSelectedSeverity(res?.data?.impact_severity);
      setMailObject(
        res?.data?.recipients?.map((recipient) => {
          recipientList = [];
          recipientList?.push(recipient?.email);
          return recipientList.join(",");
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  const handleNameChange = (e) => {
    setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value });
    setFinalObjToUpdate({
      ...finalObjToUpdate,
      [e.target.name]: e.target.value,
    });
    if (e.target.value.length > 0) {
      setError({ name: [] });
    }
  };
  const handleStatusChange = (e) => {
    setTrackStatus(e.target.value); // maintain changed status
    if (initialObj.status === "resolved" && e.target.value !== "resolved") {
      // if incident is already reso;ved and want edit the incdent status,show pop up for confirmation
      setOpenCustomDialog({
        open: true,
        message:
          "Incident is already Resolved . Do you still want to update the incident ?",
        title: "Confirmation",
      });
    } else {
      setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value });
      setFinalObjToUpdate({
        ...finalObjToUpdate,
        [e.target.name]: e.target.value,
      });
      setIncidentStatus(e.target.value);
    }
  };
  const handleToggle = (component_name, component_id, component_status) => {
    //initially all are disabled,if checkbox clicked then enabled
    let arr = [];
    arr = componentStatusList.filter((item) => {
      return item.component_id !== component_id;
    }); // filter when checked
    setComponentStatusList(arr);
    if (componentStatusList.length === arr.length)
      // add if newly checked
      setComponentStatusList([
        ...componentStatusList,
        {
          component_id: component_id,
          component_status: component_status,
        },
      ]);
  };

  const handleDropDownChange = (id, e) => {
    setDropDownStatus(
      dropdownStatus.map((com) =>
        com.component_id === id
          ? { ...com, component_status: e.target.value }
          : com
      )
    );
    setComponentStatusList(
      componentStatusList.map((com) =>
        com.component_id === id
          ? { ...com, component_status: e.target.value }
          : com
      )
    );
  };
  const handleUpdateIncident = () => {
    if (action === "create") {
      setIncidentObject({ ...incidentObject, components: componentStatusList });
      setCallCreate(true);
    }
    if (action === "edit") {
      // const results = initialObj.components.filter(({ 'component_id': id1 }) =>  !(componentStatusList.some(({'component_id': id2 }) => id2 === id1)));
      // setUncheckedComponents(results)
      if (initialStatus === "resolved") {
        //status check when orginal incident is reolved and changing the components
        setFinalConfirmationStatus(true);
        setOpenCustomDialog({
          open: true,
          message:
            "Incident is already Resolved . Do you still want to update the incident ?",
          title: "Confirmation",
        });
        //  !openCustomDialog.open && setCallUpdate(true)
      } else setCallUpdate(true);
    }
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
  const callUpdateIncidentApi = async () => {
    try {
      const res = await api.updateIncident(
        incident_id.current,
        finalObjToUpdate
      );
      setCallUpdate(false);
      navigate("/admin/incidents");
      setSnackBarConfig({
        open: true,
        message: "Incident updated successfully",
        severity: "success",
      });
      setCallUpdate(false);
      setAction(null);
    } catch (e) {
      setCallUpdate(false);
      if (e?.response?.data) {
        setError(e.response.data);
       
        if(e.response?.data?.Error)
        {
          setOpenCustomDialog({
            open:true,
            message:e.response.data.Error,
            title:"Error"
          })
        }
        setresponseError(e.response.data);
      }
    } finally {
    
   
    }
  };
  useEffect(()=>{
console.log(callUpdate)
  },[error,callUpdate])
  const callCreateIncidentApi = async () => {
    try {
      const res = await api.createIncident({ ...incidentObject });
      navigate("/admin/incidents");
      setSnackBarConfig({
        open: "true",
        message: "Incident created successfully",
        severity: "success",
      });
      setCallCreate(false);
    } catch (e) {
      setCallCreate(false);
      if (e?.response?.data) {
        setError(e.response.data);
        console.log(e.response.data)
        if(e.response?.data?.Error)
        {
          setOpenCustomDialog({
            open:true,
            message:e.response.data.Error,
            title:"Error"
          })
        }
        setresponseError(e.response.data);
      }
    }
  };
  const handleConfirmation = () => {
    // when status is "resolved " and want to go ahead with incident update handleConfirmation is used(passed to custom dialogs)

    setChangeStatus(true);
    setInitialStatus(trackStatus);
    // if user is Okay to change the status from reolved , then assign initialStatus with trackStatus
    setOpenCustomDialog({ open: false });
    finalConfirmationStatus && setCallUpdate(true); // finalConfrimationStatus is used to as a condition to make api call, if no finalConfirmationStatus variable is used
    //api call straightly called on click of "Yes" of STATUS change as same Dialog component is reused for alert on change of sttaus and update incident on checkbox changes
  };
  const handleSelectAll = (e) => {
    setSelectAllChecked(e.target.checked);
  };

  const onChange = (val) => {
    setIncidentObject({ ...incidentObject, message: val });
  };
  const handleTemplateChange = (e) => {
    setTemplateSelected(e.target.value);
  };
  const stayOnSamePage = () => {
    setOpenCustomDialog({ open: false, message: "" });
  };
  return (
    <div style={{ textAlign: "left" }}>
      {/* <Paper sx={{ mr: 4, ml: 2, mt: 4, mb: 4 }} elevation={3}> */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={12}
        sx={{ height: 50, marginRight: 2 }}
      >
        <h4 style={{ paddingTop: 20, marginLeft: 20 }}>
          {id ? `` : " Create Incident"}
        </h4>
        {id && <Button
                variant="contained"
                sx={{ ml: 2, color: "white", fontWeight: "bold" }}
                size="large"
                onClick={() => handleUpdateIncident()}
                // disabled={disableUpdateButton}
              >
                { "Update Incident"}
              </Button>}
        {!id && (
          <FormControl
            sx={{ ml: 2, mt: 6, pb: 2, color: "white", fontWeight: "bold" }}
          >
            <InputLabel
              id="demo-simple-select-label"
              sx={{ color: "#80daeb", fontWeight: "600" }}
            >
              Prefill with Template
            </InputLabel>
            <Select
              sx={{ minWidth: "300px" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={templateSelected}
              label="Prefill with Template"
              onChange={handleTemplateChange}
            >
              {incidentTemplates.map((template) => {
                return (
                  <MenuItem value={template.id} key={template.id}>
                    {" "}
                    {template.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </Stack>
      {
        <Box sx={{ pl: 3, pt: 2, pr: 3, mt: 0, backgroundColor: "white" }}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <LoadingPanel></LoadingPanel>
          </Backdrop>
          {/* <CustomDialogs open ={openCustomDialog.open} message={openCustomDialog.message}
                title={openCustomDialog.title} setOpenCustomDialog={setOpenCustomDialog} 
                handleConfirmation={handleConfirmation}
                />
                */}
          <FormControl fullWidth>
            <Box>
              <TextField
                fullWidth
                id="outlined"
                label="Incident Name"
                name="name"
                value={incidentObject.name || ""}
                onChange={handleNameChange}
              />
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
          <Stack direction={"row"} spacing={8}>
            <div>
              <TextField
                fullWidth
                InputProps={{
                  inputProps: { min: 0 }
                }}
                id="outlined"
                label="ACER Number"
                name="acer_number"
                type="number"
                value={incidentObject.acer_number || ""}
                onChange={(e) => {
                  console.log(e.target.value)
                  if (e.target.value.length > 0) {
                    setError({ acer_name: [] });
                  }
                  setIncidentObject({
                    ...incidentObject,
                    acer_number: parseInt(e.target.value),
                  });
                  setFinalObjToUpdate({
                    ...finalObjToUpdate,
                    [e.target.name]: parseInt(e.target.value),
                  });
                }}
              /> 
              <div>
            {error?.acer_number?.length > 0 ? (
                <div style={{ color: "red" }}>{error.acer_number[0]}</div>
              ) : (
                ""
              )}
              </div> 
            </div>
            
            <div>
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  Impact Severity
                </InputLabel>
                <Select
                  sx={{ minWidth: "300px" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSeverity}
                  label="Impact Severity"
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setError({ impact_severity: [] });
                    }
                    setSelectedSeverity(e.target.value);
                    setIncidentObject({
                      ...incidentObject,
                      impact_severity: e.target.value,
                    });
                    setFinalObjToUpdate({
                      ...finalObjToUpdate,
                      impact_severity: e.target.value,
                    });
                  }}
                >
                  {impactSeverityList.map((item) => {
                    return (
                      <MenuItem value={item} key={item}>
                        {" "}
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <div>
            {error?.impact_severity?.length > 0 ? (
                <div style={{ color: "red" }}>{error.impact_severity[0]}</div>
              ) : (
                ""
              )}
              </div>
            </div>
           
          </Stack>
          <br />

          <Stack direction={"row"} spacing={8}>
            <div>
              <FormLabel id="status" sx={{ fontWeight: "bold" }}>
                Incident Status
              </FormLabel>
              <br />
              {
                <RadioGroup
                  row
                  aria-labelledby="status"
                  name="status"
                  value={incidentstatus}
                  onChange={handleStatusChange}
                >
                  <FormControlLabel
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
              }
            </div>
            <div>
              <div>
                <FormLabel> Start Time (CST)</FormLabel>
              </div>
              <DateTimePicker
                name="start_time"
                slotProps={{
                  textField: {
                   
                    error:errorMessage?true:false
                  },
                }}
                value={dayjs(incidentObject?.start_time||'')}
                sx={{ width: 230 }}
                onChange={(val) => {
                  let onlyDate = val.$d.toISOString();
                  // delete responseerror.schstartdate
                  setresponseError({ ...responseerror, start_time: "" });

                  setIncidentObject({
                    ...incidentObject,
                    start_time: onlyDate,
                  });
                  setFinalObjToUpdate({
                    ...finalObjToUpdate,
                    start_time: onlyDate,
                  });
                }}
              />
              {responseerror?.start_time?.length > 0 ? (
                <div style={{ color: "red" }}>
                  {responseerror.start_time[0]}
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <div>
                <FormLabel> End Time (CST)</FormLabel>
              </div>
              <DateTimePicker
            
                slotProps={{
                  textField: {
                    helperText: errorMessage,
                    error:errorMessage?true:false
                  },
                }}
                onError={(error) => {
                  
                  setresponseError({ end_time: [""] });
                  setDateError(error);
                }}
                name="end_time"
                // dayjs().set('hour', 12).startOf('hour');
                minDateTime={dayjs(incidentObject.start_time)
                  .set("hour", dayjs(incidentObject.start_time).hour())
                  .startOf("hour")}
                value={dayjs(incidentObject?.end_time||'')}
                onChange={(val) => {
                  //  delete responseerror.schenddate
                  setresponseError({ ...responseerror, end_time: "" });
                  setIncidentObject({
                    ...incidentObject,
                    end_time: val.$d.toISOString(),
                  });
                  setFinalObjToUpdate({
                    ...finalObjToUpdate,
                    end_time: val.$d.toISOString(),
                  });
                }}
                // defaultValue={dayjs('2022-04-17T15:30')}
                sx={{ width: 230 }}
              />
              {responseerror?.end_time?.length > 0 ? (
                <div style={{ color: "red" }}>{responseerror?.end_time[0]}</div>
              ) : (
                ""
              )}
            </div>
          </Stack>

          <FormLabel >Message</FormLabel>
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
          {error?.message?.length > 0 ? (
            <div style={{ color: "red" }}>{error.message[0]}</div>
          ) : (
            ""
          )}
          <Stack direction="column" spacing={2}>
            <div>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="outlined"
                sx={{ width: 900 }}
                label="Impact Update"
                name="issue_impact"
                value={incidentObject.issue_impact || ""}
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    setError({ issue_impact : [] });
                  }
                  setIncidentObject({
                    ...incidentObject,
                    issue_impact: e.target.value,
                  });
                  setFinalObjToUpdate({
                    ...finalObjToUpdate,
                    issue_impact: e.target.value,
                  });
                }}
              />
                 <div>
            {error?.issue_impact?.length > 0 ? (
                <div style={{ color: "red" }}>{error.issue_impact[0]}</div>
              ) : (
                ""
              )}
              </div>
            </div>
            <div>
              <TextField
                fullWidth
                id="outlined"              
                sx={{ width: 900 }}
                label="Recipients"
                name="recipients"
                value={mailObject}
                onChange={(e) => {
                  setMailObject(e.target.value);
                  setIncidentObject({
                    ...incidentObject,
                    recipients: e.target.value.split(","),
                  });
                  setFinalObjToUpdate({
                    ...finalObjToUpdate,
                    recipients: e.target.value.split(","),
                  });
                }}
              />
            </div>
          </Stack>
          <CustomDialogs
          open={openCustomDialog.open}
          message={openCustomDialog.message}
          title={openCustomDialog.title}
          setOpenCustomDialog={setOpenCustomDialog}
          hideButton={true}
          handleConfirmation={stayOnSamePage}
        />
          <div
            className={
              initialObj.status === "resolved" ? "disable-pointer-events" : ""
            }
          >
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
                    //   checked={allChecked}
                    name="selectall"
                    onChange={handleSelectAll}
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
              {componentsData?.map((component, index) => {
                return (
                  <>
                    {component["sub_component"].length > 0 ? (
                      <>
                        <ListItem // category
                          sx={{ paddingTop: "2px" }}
                          key={component.component_id}
                        >
                          <ListItemText
                            Typography
                            sx={{
                              fontWeight: "600",
                              color: "rgb(101, 101, 101)",                            
                              fontSize: "14px",
                            }}
                            primary={<b style={{  fontFamily:"Assistant",}}>{component.component_name}</b>}
                          ></ListItemText>
                        </ListItem>
                        {/* <Divider /> */}

                        <List component="div">
                          {component["sub_component"].map((item, index) => {
                            return (
                              <>
                                <ListItem
                                  sx={{ paddingTop: "2px" }}
                                  key={item.component_id}
                                  secondaryAction={
                                    !(initialObj.status === "resolved") &&
                                    dropdownStatus.map((com) => {
                                      if (
                                        com?.component_id === item.component_id
                                      ) {
                                        return (
                                          <FormControl
                                            disabled={
                                              componentStatusList.length > 0 && //dsiable if component is not in componentStatusList
                                              componentStatusList.findIndex(
                                                (com) => {
                                                  return (
                                                    com.component_id ===
                                                    item.component_id
                                                  );
                                                }
                                              ) !== -1
                                                ? false
                                                : true
                                            }
                                            sx={{ m: 1, minWidth: 200 }}
                                            size="small"
                                          >
                                            <Select
                                              labelId="demo-select-small"
                                              value={com.component_status}
                                              onChange={(e) =>
                                                handleDropDownChange(
                                                  item.component_id,
                                                  e
                                                )
                                              }
                                            >
                                              <MenuItem value="Operational">
                                                Operational
                                              </MenuItem>
                                              <MenuItem value="Degraded Performance">
                                                Degraded Performance
                                              </MenuItem>
                                              <MenuItem value="Partial Outage">
                                                Partial Outage
                                              </MenuItem>
                                              <MenuItem value="Major Outage">
                                                Major Outage
                                              </MenuItem>
                                              <MenuItem value="Under Maintenance">
                                                Under Maintenance
                                              </MenuItem>
                                            </Select>
                                          </FormControl>
                                        );
                                      }
                                    })
                                  }
                                >
                                  <ListItemIcon>
                                    <Checkbox
                                      checked={
                                        componentStatusList.length > 0 &&
                                        componentStatusList.findIndex((com) => {
                                          return (
                                            com.component_id ===
                                            item.component_id
                                          );
                                        }) !== -1
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
                                  </ListItemIcon>
                                  <ListItemText
                                    disableTypography="true"
                                    primary={
                                      <Grid
                                        container
                                        spacing={4}
                                        display="flex"
                                        // justifyContent={'center'}
                                      >
                                        <Grid
                                          item
                                          md={3}
                                          sx={{ display: { md: "flex" } }}
                                          justifyContent="flex-start"
                                        >
                                          {item["component_name"]}{" "}
                                        </Grid>
                                        <Grid item md={7}>
                                          {initialObj.status === "resolved" ? (
                                            componentStatusList.findIndex(
                                              (item1) => {
                                                return (
                                                  item1.component_id ===
                                                  item.component_id
                                                );
                                              }
                                            ) !== -1 ? (
                                              <Tooltip title="Previous Status">
                                                <label
                                                  style={{ color: "#FF8E9E" }}
                                                >
                                                  {" "}
                                                  {initialObj.components.map(
                                                    (item2) => {
                                                      if (
                                                        item2.component_id ===
                                                        item.component_id
                                                      )
                                                        return item2?.last_component_status;
                                                    }
                                                  )}
                                                </label>
                                              </Tooltip>
                                            ) : (
                                              ""
                                            )
                                          ) : (
                                            ""
                                          )}
                                        </Grid>
                                      </Grid>
                                    }
                                    sx={{
                                      pl: 4,
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                      color: "rgb(101, 101, 101)",
                                      fontFamily:"Assistant",
                                    }}
                                  ></ListItemText>
                                </ListItem>
                                {/* <Divider /> */}
                              </>
                            );
                          })}
                          <Divider />
                        </List>
                      </>
                    ) : (
                      <>
                        <ListItem
                          sx={{ paddingTop: "2px" }}
                          key={index}
                          secondaryAction={
                            !(initialObj.status === "resolved") &&
                            dropdownStatus.map((com) => {
                              if (com?.component_id === component.component_id)
                                return (
                                  <FormControl
                                    disabled={
                                      componentStatusList.length > 0 &&
                                      componentStatusList.findIndex((item) => {
                                        return (
                                          item.component_id ===
                                          component.component_id
                                        );
                                      }) !== -1
                                        ? false
                                        : true
                                    }
                                    sx={{ m: 1, minWidth: 200 }}
                                    size="small"
                                  >
                                    <Select
                                      labelId="demo-select-small"
                                      value={com.component_status}
                                      onChange={(e) =>
                                        handleDropDownChange(
                                          component.component_id,
                                          e
                                        )
                                      }
                                    >
                                      <MenuItem value="Operational">
                                        Operational
                                      </MenuItem>
                                      <MenuItem value="Degraded Performance">
                                        Degraded Performance
                                      </MenuItem>
                                      <MenuItem value="Partial Outage">
                                        Partial Outage
                                      </MenuItem>
                                      <MenuItem value="Major Outage">
                                        Major Outage
                                      </MenuItem>
                                      <MenuItem value="Under Maintenance">
                                        Under Maintenance
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                );
                            })
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              checked={
                                componentStatusList.length > 0 &&
                                componentStatusList.findIndex((item) => {
                                  return (
                                    item.component_id === component.component_id
                                  );
                                }) !== -1
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
                            />
                          </ListItemIcon>
                          <ListItemText
                            disableTypography="true"
                            sx={{
                              fontWeight: "bold",
                              color: "rgb(101, 101, 101)",
                              fontFamily:"Assistant",
                              fontSize: "14px",
                            }}
                            primary={
                              <Grid
                                container
                                spacing={11}
                                display="flex"
                                justifyContent="center"
                              >
                                <Grid item md={4}>
                                  {component.component_name}{" "}
                                </Grid>
                                <Grid item md={7}>
                                  {initialObj.status === "resolved" ? (
                                    componentStatusList.findIndex((item) => {
                                      return (
                                        item.component_id ===
                                        component.component_id
                                      );
                                    }) !== -1 ? (
                                      <Tooltip title="Previous Status">
                                        <label style={{ color: "#FF8E9E" }}>
                                          {initialObj.components.map((item) => {
                                            if (
                                              item.component_id ===
                                              component.component_id
                                            )
                                              return item?.last_component_status;
                                          })}
                                        </label>
                                      </Tooltip>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                </Grid>
                              </Grid>
                            }
                          ></ListItemText>
                        </ListItem>
                        <Divider sx={{ ":last-child": { borderBottom: 0 } }} />
                      </>
                    )}
                  </>
                );
              })}
            </List>
            <div style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                sx={{ ml: 2, mt: 6, color: "white", fontWeight: "bold" }}
                size="large"
                onClick={() => handleUpdateIncident()}
                // disabled={disableUpdateButton}
              >
                {id ? "Update Incident" : " Create Incident"}
              </Button>
            </div>
          </div>
        </Box>
      }
      <br />
      {/* </Paper> */}
    </div>
  );
};
export default EditIncident;
