import { useState, useEffect, useContext } from "react"; //paginationMode && styled
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import api from "../../Api";
import businessUnitContext from "../../context/businessUnitContext";
import dayjs from "dayjs";
import { Box, Stack, Backdrop, Button } from "@mui/material";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import AddEditBusinessUnit from "./AddEditBusinessUnit";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HideSourceIcon from "@mui/icons-material/HideSource";
import UpdateIcon from "@mui/icons-material/Update";
import { styled } from "@material-ui/styles";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { SnackbarContext } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
// const initialPageState={ limit :10,offset:0};
const Security = () => {
  const [bu, setBu] = useContext(businessUnitContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState({ open: false });
  const [pageSize, setPageSize] = useState(15);
  const [openDeleteDialog, setOpenDeleteDialog] = useState({ open: false });
  const [error, setError] = useState({ businessunit_name: "" });
  const [businessunitvalue, setbusinessunitvalue] = useState(""); //businessunit created/edited
  //  const [ pageState , setPageState] = useState({...initialPageState});
  const [records, setRecords] = useState(0);
  const [actionProgress, setActionProgress] = useState(false);
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const navigate= useNavigate();
  useEffect(() => {
    setLoading(true);
    getBusinessUnits();
  }, [bu]);

  useEffect(() => {}, []);
  const getBusinessUnits = async () => {
    try {
      const response = await api.getBusinessUnit_Security();
      setData(response?.data?.results);
      setLoading(false);
      // setRecords(response?.data?.count);
    } catch (e) {}
  };
  const columns = [
    {
      field: "businessunit_id",
      headerName: "ID",
      flex: 0.4,
      hide: true,
    },
    {
      field: "businessunit_name",
      headerName: "Business Unit",
      flex: 0.8,
    },
    {
      field: "modifieduser?.first_name",
      headerName: "Last Modified User",
      flex: 0.8,
      valueGetter: (params) => {
        if (
          typeof params.row.modifieduser?.first_name !== "undefined" &&
          typeof params.row.modifieduser?.last_name !== "undefined"
        )
          return (
            params.row.modifieduser?.first_name +
            " " +
            params.row.modifieduser?.last_name
          );
        else return "-----";
      },
    },
    {
      field: "modify_datetime",
      headerName: "Modified Date",
      flex: 0.8,
      renderCell: (value) => {
        return <div>{dayjs(value.value).format("YYYY/MM/DD hh:mm:ss A")}</div>;
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      width: 80,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          label="Update BusinessUnit"
          icon={<UpdateIcon />}
          onClick={() => {
            setbusinessunitvalue(params?.row?.businessunit_name);
            setOpenDialog({
              open: true,
              action: "Edit",
              id: params.row.businessunit_id,
            });
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label={
            params.row.is_active === true
              ? "Deactivate BusinessUnit"
              : "Activate BusinessUnit"
          }
          icon={
            params.row.is_active === true ? (
              <HideSourceIcon />
            ) : (
              <LockOpenRoundedIcon />
            )
          }
          onClick={() => {
            setOpenDeleteDialog({
              open: true,
              id: params.row.businessunit_id,
              name: params.row.businessunit_name,
              action: params.row.is_active === true ? "Deactivate" : "Activate",
            });
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete BusinessUnit"
          icon={<RemoveCircleIcon></RemoveCircleIcon>}
          onClick={() => {
            setOpenDeleteDialog({
              open: true,
              id: params.row.businessunit_id,
              name: params.row.businessunit_name,
              action: "Delete",
            });
          }}
          showInMenu
        />,
      ],
    },
  ];
  const StyledDataGrid = styled(DataGrid)({
    "& .grey": {
      backgroundColor: "#D3D3D3",
      color: "grey",
    },
  });
  const createBusinessUnit = async (val) => {
    try {
      if (openDialog.action === "Add") {
        const response = await api.createNewBusinessUnit({
          businessunit_name: val,
        });
      } else {
        const response = await api.updateBusinessUnit(openDialog.id, {
          businessunit_name: val,
        });
      }

      setSnackBarConfig({
        open: true,
        message:
          `BusinessUnit-${val} successfully created`,
        severity: "success",
      });
      getBusinessUnits();
      setbusinessunitvalue("");
      setOpenDialog({ open: false });
      window.location.reload(true);
    } catch (e) {
      console.log();
      if (e?.response?.data?.businessunit_name) {
        setError({
          businessunit_name: e?.response?.data?.businessunit_name[0],
        });
      }
    }
  };
  const deleteBusinessUnit = async () => {
    try {
      if (openDeleteDialog.action === "Deactivate") {
        const response = await api.updateBusinessUnit(openDeleteDialog.id, {
          is_active: 0,
        });
      }
      if (openDeleteDialog.action === "Delete") {
        const response = await api.deleteBusinessUnit(openDeleteDialog.id);
      }
      if (openDeleteDialog.action === "Activate") {
        const response = await api.updateBusinessUnit(openDeleteDialog.id, {
          is_active: 1,
        });
      }
      getBusinessUnits();
      setOpenDeleteDialog({ open: false, action: "" });
      window.location.reload(true);
    } catch (e) {
    } finally {
      setActionProgress(false);
    }
  };
  return (
    <div className="pages">
      <Box sx={{ height: "auto", width: "98%", padding: "10px" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={12}
          sx={{ height: 50, marginRight: 2 }}
        >
          <h5 style={{ paddingTop: 20, marginLeft: 20 }}>
            View Business Units
          </h5>
          <StyledButton
            variant="contained"
            onClick={() => {
              setOpenDialog({ open: true, action: "Add" });
            }}
          >
            {" "}
            + Add Business Unit
          </StyledButton>{" "}
        </Stack>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingPanel></LoadingPanel>
        </Backdrop>
        <StyledDataGrid
          columns={columns}
          rows={data}
          getRowClassName={(params) => {
            if (params.row.is_active === false) return `grey`;
          }}
          rowHeight={45}
          autoHeight={true}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 50]}
          pagination
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
          }}
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
          getRowId={(row) => {
            return row?.businessunit_id;
          }}
        />
        <AddEditBusinessUnit
          open={openDialog.open}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          createBusinessUnit={createBusinessUnit}
          businessunitvalue={businessunitvalue}
          setbusinessunitvalue={setbusinessunitvalue}
          error={error}
          setError={setError}
        />
        <Dialog
          open={openDeleteDialog.open}
          onClose={() => setOpenDeleteDialog({ open: false })}
        >
          <DialogTitle>{openDeleteDialog.action} Business Unit</DialogTitle>
          <DialogContent>
            Do you really want to {openDeleteDialog.action} this BusinessUnit -{" "}
            <b>{openDeleteDialog.name}</b>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                setActionProgress(true);
                deleteBusinessUnit();
              }}
            >
              {actionProgress && (
                <CircularProgress
                  size={20}
                  sx={{ color: "white" }}
                ></CircularProgress>
              )}
              Yes
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={(e) => {
                setOpenDeleteDialog({ open: false });
              }}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};
export default Security;
