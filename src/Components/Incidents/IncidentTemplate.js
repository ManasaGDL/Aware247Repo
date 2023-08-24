import { Stack, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import businessUnitContext from "../../context/businessUnitContext";
import api from "../../Api";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import UpdateIcon from "@mui/icons-material/Update";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { SnackbarContext } from "../../context/SnackbarContext";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
const initialObj= { limit:10, offset:0}
const IncidentTemplate = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(15);
  const bu = useContext(businessUnitContext);
  const [loading, setLoading] = useState(false);
  const [templateObj, setTemplateObj] = useState({});
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [ totalRecords , setTotalRecords] = useState(0)
  const [ pageState , setPageState]=useState({...initialObj})
  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    id: "",
    type: "Template",
  });
  useEffect(() => {
    listIncidentTemplates(pageState);
    setLoading(true);
  }, [bu,pageState.limit,pageState.offset,pageState]);
  useEffect(()=>{
    setPageState(prev=>({...prev,limit:pageSize}))
      },[pageSize])
  const listIncidentTemplates = async (obj) => {
    try {
      const res = await api.getIncidentTemplates(obj);

      setData(res?.data.results);
      setTotalRecords(res?.data?.count);
      setLoading(false);
    } catch (e) {}
  };
  useEffect(() => {
    if (openDialog?.action === "Update") {
      setTemplateObj({
        template_name: openDialog?.template_name,
        incident_title: openDialog?.incident_title,
        description: openDialog?.description,
      });
    }
  }, [openDialog.action,openDialog?.template_name,openDialog?.incident_title,openDialog?.description]);
  const columns = [
    {
      field: "template_id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "template_name",
      headerName: "Template Name",
      flex: 1,
    },
    {
      field: "incident_title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "Actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          label="Edit"
          icon={<UpdateIcon />}
          showInMenu
          onClick={() =>
            setOpenDialog({
              id: params.id,
              open: true,
              template_name: params.row.template_name,
              incident_title: params.row.incident_title,
              description: params.row.description,
              action: "Update",
            })
          }
        />,
        <GridActionsCellItem
          label="Delete"
          icon={<RemoveCircleIcon />}
          showInMenu
          onClick={() =>
            setOpenDeleteDialog({
              message: "Do you want to delete this template",
              open: true,
              id: params.id,
            })
          }
        />,
      ],
    },
  ];

  const handleChange = (e) => {
    setTemplateObj({ ...templateObj, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };
  const createTemplate = async (e) => {
    let res;
    try {
      if (openDialog.action === "Update") {
        res = await api.updateTemplate(openDialog.id, templateObj);
        setSnackBarConfig({
          open: "true",
          message: "Template Updated Successfully",
          severity: "success",
        });
      } else {
        res = await api.createIncidentTemplate(templateObj);
        setSnackBarConfig({
          open: "true",
          message: "Template Created Successfully",
          severity: "success",
        });
      }
      navigate(`/admin/incidents`, { state: { tabValue: 2 } });
      setOpenDialog({ open: false });

      setTemplateObj({});
      setLoading(true);
      listIncidentTemplates(pageState);
    } catch (e) {
      setError(e.response.data);
    } finally {
      // setTemplateObj({});
    }
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };
  const deleteTemplate = async () => {
    try {
      const res = await api.deleteTemplate(openDeleteDialog.id);
    } catch (e) {
      setSnackBarConfig({
        open: true,
        message: "Template Delete Successfully",
        severity: "success",
      });
    }
  };
  const handleDelete = async () => {
    try {
      const res = await api.deleteTemplate(openDeleteDialog.id);
      navigate(`/admin/incidents`, { state: { tabValue: 2 } });
      setOpenDeleteDialog({ open: false });
      listIncidentTemplates(pageState);
      setSnackBarConfig({
        open: "true",
        message: "Template Deleted Successfully",
        severity: "success",
      });
    } catch (e) {
    } finally {
      listIncidentTemplates(pageState);
    }
  };
  return (
    <div className="pages">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <LoadingPanel></LoadingPanel>
      </Backdrop>
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={12}
        sx={{ height: 50, marginRight: 2 }}
      >
        <StyledButton
          variant="contained"
          onClick={() => setOpenDialog({ open: true })}
        >
          + Incident Template
        </StyledButton>{" "}
      </Stack>
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog({ open: false })}
      >
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>
            {openDialog.action === "Update" ? "Update" : "New"} Incident
            Template
          </DialogTitle>
          <DialogContent style={{ height: "350px" }}>
            <div>
              <TextField
                name="template_name"
                label="Template Name"
                fullWidth
                value={templateObj.template_name}
                onChange={handleChange}
                variant="standard"
              ></TextField>
              <label style={{ fontSize: 10, color: "grey" }}>
                The name given to this template.
              </label>
            </div>
            {error?.template_name?.length > 0 ? (
              <div style={{ color: "red" }}>{error.template_name[0]}</div>
            ) : (
              ""
            )}
            <br />
            <div>
              <TextField
                name="incident_title"
                label="Incident Title (optional)"
                fullWidth
                value={templateObj.incident_title}
                variant="standard"
                onChange={handleChange}
              ></TextField>
              <label style={{ fontSize: 10, color: "grey" }}>
                Optional. The name applied to the incident when used.
                <b>
                  {" "}
                  This field will be applied only when creating an incident.
                </b>
              </label>
            </div>
            <br />

            <TextField
              name="description"
              multiline
              sx={{
                width: 500,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              value={templateObj.description}
              label="Message Body"
              onChange={handleChange}
              // value={text}
              // onChange={(e) => {
              //   e.stopPropagation()
              //   handleInputChange(e)
              // }}
              minRows={8}
            >
              {" "}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ alignItems: "center" }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ color: "white" , fontWeight:"600" }}
              onClick={() => createTemplate()}
            >
              {" "}
              {openDialog.action === "Update" ? "Update" : "Create"} Template
            </Button>
          </DialogActions>
        </form>
      </Dialog>
{data.length===0 && <h5>No Templates</h5>}
      <Box sx={{ width: "95%", margin: "0 auto", height: 'auto'}}>
        {data.length>0 && <DataGrid
          columns={columns}
          rows={data}
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
          }}
          rowCount={totalRecords}
          paginationMode="server"
          autoHeight={true}
          rowHeight={40}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 50,100]}
          pagination
          getRowId={(row) => row.template_id}
          onPageChange={val=>{
            setPageState(prev=>({...prev,offset:val*prev.limit}))
          }}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />}
      </Box>
      <CustomDialogs
        open={openDeleteDialog.open}
        message={openDeleteDialog.message}
        title={openDeleteDialog.title}
        setOpenCustomDialog={setOpenDeleteDialog}
        hideButton={false}
        handleConfirmation={handleDelete}
      />
    </div>
  );
};
export default IncidentTemplate;
