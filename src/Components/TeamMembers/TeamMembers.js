import { useState, useEffect, useContext } from "react"; //count wrong
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Container, Stack } from "@mui/system";
import api from "../../Api";
import dayjs from "dayjs";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import businessUnitContext from "../../context/businessUnitContext";
import AddEditTeamMember from "./AddEditTeamMember";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { SnackbarContext } from "../../context/SnackbarContext";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import { axiosInstance } from "../../axios";
const initialPageState = { limit: 10, offset: 0 };
const TeamMembers = () => {
  const bu = useContext(businessUnitContext);
  const [data, setData] = useState([]);
  const [actionProgress, setActionProgress] = useState(false);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageState, setPageState] = useState({ ...initialPageState });
  const [openDialog, setOpenDialog] = useState({ open: false, action: "" });
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    first_name: "",
    email: "",
    password: "",
  });
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errorState, setErrorState] = useState({});
  const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
  useEffect(() => {
    setLoading(true);

    getTeamMembers(pageState);
  }, [bu, pageState.limit, pageState.offset]);
  useEffect(() => {
    setPageState((prev) => ({
      ...prev,
      limit: pageSize,
    }));
  }, [pageSize]);

  //  const stayOnSamePage=()=>{
  //   setOpenCustomDialog({open:false})
  //   setActionProgress(false)
  //  }
  const getTeamMembers = async (obj) => {
    try {
      const response = await api.getTeamMembers(obj);
      setData(response?.data?.results);
      setTotalRecords(response?.data?.count);
      setLoading(false);
    } catch (e) {}
  };
  const columns = [
    {
      field: "first_name",
      headerName: "Name",
      type: "string",
      flex: 1,
      valueGetter: (params) => {
        return params.row["first_name"] + " " + params.row["last_name"];
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "modify_datetime",
      headerName: "Date Added",
      flex: 1,
      renderCell: (val) => {
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A");
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      flex: 1,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          label="Edit"
          showInMenu
          onClick={(e) => {
            setUserDetails({
              first_name: params.row.first_name,
              last_name: params.row.last_name,
              email: params.row.email,
              id: params.row.user_id,
              phone_number: params.row.phone_number,
            });
            setOpenDialog({
              open: true,
              id: params.row.user_id,
              action: "Edit",
            });
          }}
          icon={<EditIcon />}
        />,
        <GridActionsCellItem
          label="Delete"
          showInMenu
          icon={<DeleteIcon />}
          onClick={(e) =>
            setOpenDeleteDialog({
              open: true,
              id: params.row.user_id,
              name: params.row.first_name + " " + params.row.last_name,
              action: "Delete",
            })
          }
        />,
      ],
    },
  ];
  const createUser = async (data) => {
    setActionProgress(true);
    let res;
    try {
      if (openDialog.action === "Add") {
        res = await api.addTeamMember(data);

        if (res?.status === 201) {
          setSnackBarConfig({
            open: true,
            message: "Team Member added successfully!",
            severity: "success",
          });
        }
      } else {
        res = await api.editTeamMember(data, userDetails?.id);
        if (res?.status === 200) {
          setSnackBarConfig({
            open: true,
            message: "Team Member edited successfully!",
            severity: "success",
          });
        }
      }
      setOpenDialog({ open: false });
      getTeamMembers(pageState);
      setUserDetails({
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
      });
      setActionProgress(false);
    } catch (e) {
      setActionProgress(false);
      if (e.response?.data) {
        if (typeof e.response.data !== "string")
          Object.entries(e.response?.data).forEach(([key, value]) => {
            setError((prevState) => ({
              ...prevState,
              [key]: typeof value === "string" ? value : value.join("; "),
            }));
          });
        else {
          setOpenCustomDialog({
            open: true,
            title: "Error",
            message: "Something went wrong!",
          });
        }
      }
    }
  };
  const stayOnSamePage = () => {
    setOpenCustomDialog({ open: false });
  };
  const deleteTeamMember = async () => {
    try {
      const res = await api.deleteTeamMember(openDeleteDialog?.id);
      setSnackBarConfig({
        open: true,
        message: `${openDeleteDialog?.name} successfully deleted`,
        severity: "success",
      });
      setOpenDeleteDialog({ open: false });
      setActionProgress(false);
      getTeamMembers(pageState);
    } catch (e) {}
  };
  return (
    <div style={{ textAlign: "left" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <LoadingPanel></LoadingPanel>
      </Backdrop>
      {!loading && (
        <Box sx={{ height: "auto" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={12}
            sx={{ height: 50, marginRight: 2 }}
          >
            <h5 style={{ paddingTop: 20, marginLeft: 20 }}>Team Members</h5>
            <StyledButton
              variant="contained"
              onClick={() => {
                setOpenDialog({ open: true, action: "Add" });
              }}
            >
              + Add Team Member
            </StyledButton>{" "}
          </Stack>
          <Container sx={{ paddingTop: 2, paddingBottom: 4 }}>
            {data.length > 0 && (
              <DataGrid
                rowHeight={40}
                columns={columns}
                autoHeight={true}
                rows={data}
                getRowId={(row) => row.user_id}
                pagination
                rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
                pageSize={pageSize}
                // paginationMode="server"

                rowCount={totalRecords}
                onPageChange={(e) => {
                  //     console.log("TM",e)
                  // setPageState(prev=>({
                  //   ...prev,offset:e*prev.limit
                  // })
                  // )
                }}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
                  " .MuiDataGrid-columnHeader": {
                    backgroundColor: "white",
                  },
                }}
              />
            )}
          </Container>
          <AddEditTeamMember
            actionProgress={actionProgress}
            open={openDialog?.open}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            userDetails={userDetails}
            error={error}
            setUserDetails={setUserDetails}
            createUser={createUser}
            setError={setError}
          />
          <Dialog
            open={openDeleteDialog.open}
            onClose={() => setOpenDeleteDialog({ open: false })}
          >
            <DialogTitle>{openDeleteDialog.action} Team Member</DialogTitle>
            <DialogContent>
              Do you really want to {openDeleteDialog.action} this Member -{" "}
              <b>{openDeleteDialog.name}</b>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  setActionProgress(true);
                  deleteTeamMember();
                }}
              >
                {actionProgress && (
                  <CircularProgress
                    sx={{ marginLeft: 0, color: "white", fontWeight: 10 }}
                    size={20}
                  />
                )}
                &nbsp; &nbsp; Delete
              </Button>
            </DialogActions>
          </Dialog>
          <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
        </Box>
      )}
    </div>
  );
};
export default TeamMembers;
