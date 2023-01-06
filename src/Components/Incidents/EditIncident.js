import React, { useEffect, useState, useRef, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DOMPurify from "dompurify";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import htmlToDraft from 'html-to-draftjs';
import api from "../../Api";
import { SnackbarContext } from "../../context/SnackbarContext";

const getInitialState = (defaultValue) => {
    if (defaultValue) {
        const blocksFromHtml = htmlToDraft(defaultValue);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    } else {
        return EditorState.createEmpty();
    }
};
const EditIncident = ({ bu }) => {
    const [initialObj, setInitialObj] = useState({ status: 'investigating' })
    const [incidentObject, setIncidentObject] = useState({ status: 'investigating' })
    const [incidentstatus, setIncidentStatus] = useState('investigating')
    const [callCreate, setCallCreate] = useState(false)
    const [callUpdate, setCallUpdate] = useState(false)
    const [componentsData, setComponentsData] = useState([])
    const [loading, setLoading] = useState(false)
    const [uncheckedComponents, setUncheckedComponents] = useState([])
    const [componentStatusList, setComponentStatusList] = useState([])
    const { setSnackBarConfig } = useContext(SnackbarContext)
    const [dropdownStatus, setDropDownStatus] = useState([])
    const [selectAllchecked, setSelectAllChecked] = useState(false)
    const [error, setError] = useState({ name: "" });
    const [action, setAction] = useState('')
    const [finalConfirmationStatus, setFinalConfirmationStatus] = useState(false)
    const [changeStatus, setChangeStatus] = useState(false)
    const [initialStatus, setInitialStatus] = useState(initialObj?.status)//reads status from api response of getIncident
    const [openCustomDialog, setOpenCustomDialog] = useState({ open: false })
    const [trackStatus, setTrackStatus] = useState(initialObj?.status)
    const [finalObjToUpdate, setFinalObjToUpdate] = useState({}) ////reads status from api response of getIncident and bears current change of status
    const [editorState, setEditorState] = useState(getInitialState(initialObj.message));

    let statusArray = []
    const { id } = useParams();
    const navigate = useNavigate()
    const incident_id = useRef(id);
    const prevbusinessunit = useRef(bu)
    useEffect(() => {
        if (typeof id === "undefined") {
            setAction('create')
            setInitialObj({ status: 'investigating' })
            setIncidentObject({ status: 'investigating' })
            setIncidentStatus('investigating')
            setComponentStatusList([])
        } else {
            setIncidentStatus(null)
            setAction('edit')

        }
    }, [id])
    useEffect(() => {
        if (prevbusinessunit.current !== bu) {
            navigate("/admin/incidents")
        }
    }, [bu])


    const onEditorChange = (val) => {
        setEditorState(val);
        const rawContentState = convertToRaw(val.getCurrentContent());
        const htmlOutput = draftToHtml(rawContentState);
        const cleanHtml = DOMPurify.sanitize(htmlOutput);
        onChange && onChange(cleanHtml);
    };
    useEffect(() => { //track unchecked
        if (action === "edit") {
            const results = initialObj?.components?.filter(({ 'component_id': id1 }) => !(componentStatusList.some(({ 'component_id': id2 }) => id2 === id1)));
            setUncheckedComponents(results)
        }
    }, [initialObj, componentStatusList])
    useEffect(() => {

        setEditorState(() => {

            const contentBlock = htmlToDraft(initialObj?.message || '');
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            return editorState;

        })
        setTrackStatus(initialObj.status)
        setInitialStatus(initialObj.status)

        setIncidentObject({ ...initialObj })
        if (initialObj.hasOwnProperty('components')) {
            setComponentStatusList(initialObj.components.map(obj => {
                if (obj.sub_component?.length > 0) {
                    return { 'component_id': obj.sub_component.component_id, 'component_status': obj.sub_component.component_status }
                }
                else return { 'component_id': obj.component_id, 'component_status': obj.component_status }
            }))
        }
    }, [initialObj])

    useEffect(() => {
        if (action === "edit") {
            setIncidentObject({ ...incidentObject, "components": componentStatusList, "uncheck_component": uncheckedComponents })
            setFinalObjToUpdate({ ...finalObjToUpdate, "components": componentStatusList, "uncheck_component": uncheckedComponents })

        }
    }, [uncheckedComponents, componentStatusList])
    useEffect(() => {
        if (typeof id !== 'undefined')
            setIncidentStatus(incidentObject?.status)  /// reading status from response
    }, [incidentObject])
    useEffect(() => {
        // const data = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        let data;
        if (editorState)
            data = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        //     const blocks = manipulateRawBlocks(data)
        // const newRawState = { ...data, blocks }
        // const _html = draftToHtml(newRawState)
        setIncidentObject({ ...incidentObject, "message": data })
        setFinalObjToUpdate({ ...finalObjToUpdate, "message": data })
    }, [editorState])
    useEffect(() => {

        id && callGetIncident();
    }, [])
    useEffect(() => {
        async function getComponents() {
            try {
                setLoading(true);
                const response = await api.getComponents();
                setComponentsData(response?.data);
                setLoading(false);
            } catch (e) { }
        }
        getComponents();
    }, [bu]);

    useEffect(() => {
        if (callCreate) {
            callCreateIncidentApi()
        }
        if (callUpdate) {
            // { if((incidentObject.message).localeCompare(initialObj.message))
            //     {
            //     setFinalObjToUpdate(prev=>
            //          ({...prev,'message':incidentObject.message,'components':componentStatusList,'uncheck_component':uncheckedComponents})
            // )}
            //    else  setFinalObjToUpdate(prev =>({...prev,'components':componentStatusList,'uncheck_component':uncheckedComponents}))
            callUpdateIncidentApi();
        }
    }, [callCreate, incidentObject, callUpdate])
    useEffect(() => {
        if (selectAllchecked) {
            setComponentStatusList(dropdownStatus)
        }
        if (!selectAllchecked) {
            // setComponentStatusList([])
        }
    }, [selectAllchecked])

    useEffect(() => {
        if (changeStatus) {
            setIncidentObject({ ...incidentObject, "status": trackStatus })
            setFinalObjToUpdate({ ...finalObjToUpdate, "status": trackStatus })
            setIncidentStatus(trackStatus)
        }
    }, [changeStatus])
    useEffect(() => {

        componentsData.length > 0 && componentsData.forEach((item) => {
            if (item.sub_component.length > 0) {
                item.sub_component.map(subcomponent => {
                    statusArray.push({ 'component_id': subcomponent.component_id, 'component_status': subcomponent.component_status.component_status_name })
                })

            } else {
                statusArray.push({ 'component_id': item.component_id, 'component_status': item.component_status.component_status_name })
            }

        }
        )
        setDropDownStatus(statusArray) // dropdown status captured from api response
    }, [componentsData])

    const callGetIncident = async () => { //get detailts w rt specific incident
        try {
            const res = await api.getIncident(incident_id.current)
            setInitialObj(res?.data)
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleNameChange = (e) => {
        setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value })
        setFinalObjToUpdate({ [e.target.name]: e.target.value })
        if (e.target.value.length > 0) {
            setError({ name: [] });
        }
    }
    const handleStatusChange = (e) => {
        setTrackStatus(e.target.value) // maintain changed status
        if (initialObj.status === "resolved" && e.target.value !== "resolved") // if incident is already reso;ved and want edit the incdent status,show pop up for confirmation
        {
            setOpenCustomDialog({ open: true, message: 'Incident is already Resolved . Do you still want to update the incident ?', title: 'Confirmation' })

        }
        else {
            setIncidentObject({ ...incidentObject, [e.target.name]: e.target.value })
            setIncidentStatus(e.target.value)
            setFinalObjToUpdate(prev => ({ ...prev, [e.target.name]: e.target.value }))
        }

    }
    const handleToggle = (component_name, component_id, component_status) => {//initially all are disabled,if checkbox clicked then enabled
        let arr = []
        arr = componentStatusList.filter(item => {
            return item.component_id !== component_id
        }) // filter when checked
        setComponentStatusList(arr)
        if (componentStatusList.length === arr.length) // add if newly checked
            setComponentStatusList([...componentStatusList,
            {
                "component_id": component_id,
                "component_status": component_status
            }])
    }

    const handleDropDownChange = (id, e) => {

        setDropDownStatus(dropdownStatus.map(com => (com.component_id === id ? { ...com, 'component_status': e.target.value } : com))
        )
        setComponentStatusList(componentStatusList.map(com => com.component_id === id ? { ...com, 'component_status': e.target.value } : com))
    }
    const handleUpdateIncident = () => {
        if (action === 'create') {
            setIncidentObject({ ...incidentObject, 'components': componentStatusList })
            setCallCreate(true)
        }
        if (action === "edit") {
            // const results = initialObj.components.filter(({ 'component_id': id1 }) =>  !(componentStatusList.some(({'component_id': id2 }) => id2 === id1)));
            // setUncheckedComponents(results)
            if (initialStatus === "resolved")//status check when orginal incident is reolved and changing the components
            {
                setFinalConfirmationStatus(true)
                setOpenCustomDialog({ open: true, message: 'Incident is already Resolved . Do you still want to update the incident ?', title: 'Confirmation' })
                //  !openCustomDialog.open && setCallUpdate(true)
            }
            else setCallUpdate(true)

        }
    }
    const callUpdateIncidentApi = async () => {
        try {
            const res = await api.updateIncident(incident_id.current, finalObjToUpdate)
            navigate("/admin/incidents")
            setSnackBarConfig({ open: true, message: 'Incident updated successfully', severity: "success" })
            setCallUpdate(false)
            setAction(null)
        } catch (e) {

        } finally {
            setAction('')
        }
    }
    const callCreateIncidentApi = async () => {
        try {
            const res = await api.createIncident({ ...incidentObject })
            navigate("/admin/incidents")
            setSnackBarConfig({ open: "true", message: "Incident created successfully", severity: "success" })
            callCreate(false)
        } catch (e) {
            if (e?.response?.data) {
                setError(e.response.data);
            }
        }
    }
    const handleConfirmation = () => { // when status is "resolved " and want to go ahead with incident update handleConfirmation is used(passed to custom dialogs)

        setChangeStatus(true)
        setInitialStatus(trackStatus)
        // if user is Okay to change the status from reolved , then assign initialStatus with trackStatus
        setOpenCustomDialog({ open: false })
        finalConfirmationStatus && setCallUpdate(true)   // finalConfrimationStatus is used to as a condition to make api call, if no finalConfirmationStatus variable is used
        //api call straightly called on click of "Yes" of STATUS change as same Dialog component is reused for alert on change of sttaus and update incident on checkbox changes
    }
    const handleSelectAll = (e) => {

        setSelectAllChecked(e.target.checked)
    }


    const onChange = (val) => {
        setIncidentObject({ ...incidentObject, message: val })

    }
    return <div style={{ textAlign: "left" }}>
        <Paper sx={{ mr: 4, ml: 2, mt: 4, mb: 4 }} elevation={3}>
            <h5 style={{ paddingTop: 20, marginLeft: 20 }}>{id ? `Update Incident` : ' Create Incident'}</h5>
            <Box sx={{ pl: 3, pr: 3, mt: 2, backgroundColor: "white" }}>
                <CustomDialogs open={openCustomDialog.open} message={openCustomDialog.message}
                    title={openCustomDialog.title} setOpenCustomDialog={setOpenCustomDialog}
                    handleConfirmation={handleConfirmation}
                />
                <FormControl fullWidth>
                    <Box>
                        <TextField
                            fullWidth
                            id="outlined"
                            label="Incident Name"
                            name="name"
                            value={incidentObject.name || ''}
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
                <FormLabel id="status" sx={{ fontWeight: "bold" }}>
                    Incident Status
                </FormLabel>
                <br />
                {<RadioGroup
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
                </RadioGroup>}
                <FormLabel sx={{ fontWeight: "bold" }}>Message</FormLabel>
                <br />

                <Editor editorState={editorState}
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
                                        <ListItem
                                            sx={{ paddingTop: "2px" }}
                                            key={component.component_id}
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
                                            {component["sub_component"].map((item, index) => {

                                                return (
                                                    <>
                                                        <ListItem
                                                            sx={{ paddingLeft: "80px", paddingTop: "2px" }}
                                                            key={item.component_id}
                                                            secondaryAction={
                                                                dropdownStatus.map(com => {
                                                                    if (com?.component_id === item.component_id) {
                                                                        return <FormControl
                                                                            disabled={
                                                                                componentStatusList.length > 0 && //dsiable if component is not in componentStatusList
                                                                                    (componentStatusList.findIndex(com => {
                                                                                        return com.component_id === item.component_id
                                                                                    })) !== -1 ? false : true}
                                                                            sx={{ m: 1, minWidth: 200 }}
                                                                            size="small"
                                                                        >
                                                                            <Select
                                                                                labelId="demo-select-small"
                                                                                value={com.component_status}
                                                                                onChange={(e) => handleDropDownChange(item.component_id, e)}
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
                                                                    }
                                                                })

                                                            }
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    checked={componentStatusList.length > 0 &&
                                                                        (componentStatusList.findIndex(com => {
                                                                            return com.component_id === item.component_id
                                                                        })) !== -1 ? true : false}
                                                                    onChange={() => {
                                                                        handleToggle(item["component_name"], item["component_id"], item.component_status.component_status_name);
                                                                    }}
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                disableTypography='true'
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
                                            key={index}
                                            secondaryAction={
                                                dropdownStatus.map(com => {
                                                    if (com?.component_id === component.component_id)
                                                        return <FormControl
                                                            disabled={componentStatusList.length > 0 &&
                                                                (componentStatusList.findIndex(item => {
                                                                    return item.component_id === component.component_id
                                                                })) !== -1 ? false : true
                                                            }
                                                            sx={{ m: 1, minWidth: 200 }}
                                                            size="small"
                                                        >
                                                            <Select
                                                                labelId="demo-select-small"
                                                                value={com.component_status}
                                                                onChange={(e) => handleDropDownChange(component.component_id, e)}
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
                                                })

                                            }
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={componentStatusList.length > 0 &&
                                                        (componentStatusList.findIndex(item => {
                                                            return item.component_id === component.component_id
                                                        })) !== -1 ? true : false}
                                                    onChange={() => {
                                                        handleToggle(component["component_name"], component["component_id"], component.component_status.component_status_name);
                                                    }}
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                disableTypography='true'
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
                <div style={{ textAlign: "center" }}>
                    <Button
                        variant="contained"
                        sx={{ ml: 2, mt: 6, color: "white" }}
                        size="large"
                        onClick={() => handleUpdateIncident()}
                    // disabled={disableUpdateButton}
                    >
                        {id ? 'Update Incident' : ' Create Incident'}
                    </Button>
                </div>
            </Box>
            <br />
        </Paper>
    </div>
}
export default EditIncident;
