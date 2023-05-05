import { useContext } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import UpdateIcon from "@mui/icons-material/Update";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Backdrop, Stack, Button } from "@mui/material";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import api from "../../Api";
import CustomDeleteDialog from "../common/Dialogs/CustomDeleteDialog";
import { SnackbarContext } from "../../context/SnackbarContext";
import businessUnitContext from "../../context/businessUnitContext";
const ScheduledMaintenance = () => {
  const [pageSize, setPageSize] = useState(15);
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    open: false,
    type: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const bu = useContext(businessUnitContext);

  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [data, setData] = useState({});
  const regex = /(<([^>]+)>)/gi;
  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right-end" />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 300,
      lineHeight: 2,
      fontSize: 11,
      fontWeight: 600,
      transparent: 0.4,
      border: 2,
      backgroundColor: "#808080",
      // "#808080"
    },
  });
  useEffect(() => {
    setLoading(true);
    getScheduleMaintenaceIncidents();
  }, [bu]);
  const getScheduleMaintenaceIncidents = async () => {
    try {
      const response = await api.getScheduleMaintenanceIncidents();
      setData(response?.data?.results);
      setLoading(false);
    } catch (e) {
    } finally {
    }
  };
  const columns = [
    {
      field: "sch_inc_id",
      headerName: "ID",
      flex: 1,
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (val) => {
        return (
          <CustomWidthTooltip title={val?.value?.replace(regex, "")}>
            <span className="wrap">{val?.value?.replace(regex, "")}</span>
            {/* {val?.value?.replace(regex,'')} */}
          </CustomWidthTooltip>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
    },
    {
      field: "schstartdate",
      headerName: "Start Date",
      type: "dateTime",
      flex: 1,
      renderCell: (val) => {
        return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>;
      },
    },
    {
      field: "schenddate",
      headerName: "End Date",
      type: "dateTime",
      flex: 1,
      renderCell: (val) => {
        return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>;
      },
    },
    {
      field: "modified_datetime",
      headerName: "LastModified",
      type: "dateTime",
      flex: 1,
      renderCell: (val) => {
        return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          label="Update"
          disabled={params.row.status === "completed" ? true : false}
          showInMenu
          onClick={() =>
            navigate(`/admin/scheduled/update/${params.id}`, {
              state: {
                components: params.row.components,
                name: params.row.name,
                message: params.row.message,
                schstartdate: params.row.schstartdate,
                schenddate: params.row.schenddate,
              },
            })
          }
          icon={<UpdateIcon />}
        />,
        <GridActionsCellItem
          label="View"
          icon={<VisibilityIcon />}
          onClick={() => {
            navigate(`/admin/viewScheduleMaintenance/${params.id}`);
          }}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete"
          icon={<RemoveCircleIcon />}
          onClick={() =>
            setOpenDeleteDialog({
              open: true,
              id: params.id,
              type: "Scheduled Maintenance",
            })
          }
          showInMenu
        />,
      ],
    },
  ];
  const deleteIncident = async (data) => {
    try {
      if (data.id) {
        const res = await api.deleteScheduledIncident(data.id);
        const message = `Deleted Successfully `;
        if (res.status === 200) {
          getScheduleMaintenaceIncidents();
        }
        setSnackBarConfig({
          open: true,
          message: message,
          severity: "success",
        });
      }
    } catch (e) {
    } finally {
    }
    setOpenDeleteDialog({ ...openDeleteDialog, open: data.open });
  };
  return (
    <div className="pages">
      <div>
        {/* <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
    <LoadingPanel ></LoadingPanel>  
    </Backdrop>   */}
      </div>
      {/* <Box sx={{ height: 700, width: '100%' }}>  */}
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={12}
        sx={{ height: 50, marginRight: 2 }}
      >
        <StyledButton
          variant="contained"
          onClick={() => navigate("/admin/scheduled/create")}
        >
          + Scheduled Maintenance
        </StyledButton>{" "}
      </Stack>
      <Box sx={{ width: "100%", margin: "0 auto", height: "auto" }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingPanel></LoadingPanel>
        </Backdrop>
        <DataGrid
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
          rowHeight={40}
          autoHeight={true}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 50]}
          pagination
          getRowId={(row) => row.sch_inc_id}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
        <CustomDeleteDialog
          open={openDeleteDialog.open}
          id={openDeleteDialog.id}
          type={openDeleteDialog.type}
          deleteComponent={deleteIncident}
          name={openDeleteDialog.name}
        />
      </Box>
    </div>
  );
};
export default ScheduledMaintenance;
