
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import HeaderTabs from "../common/HeaderTabs";
import api from "../../Api";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import Backdrop from '@mui/material/Backdrop';
const ViewScheduleMaintenance = () => {
  const [pageSize, setPageSize] = useState(15);
  const [data, setData]= useState({})
  const [ loading , setLoading] = useState(false)
  const regex = /(<([^>]+)>)/gi;
  const { id } = useParams();
  useEffect(()=>{
    setLoading(true)
   viewScheduleMaintenance();
  },[])
  const viewScheduleMaintenance=async()=>{
try{
const res= await api.viewScheduleMaintenance(id);
setData(res?.data)
setLoading(false)
}catch(e)
{

}
  }
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
  const columns = [
    {
      field: "sch_mnt_activity_id",
      header: "ID",
      hide: true,
    },
    {
      field: "name",
      headerName: "Name",
      flex:1,
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
      field: "message",
      headerName: "Message",
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
      flex: 0.5,
    },
    {
      field: "schstartdate",
      headerName: "Schedule Start",
      flex: 0.6,
      renderCell: (val) => {
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A");
      },
    },
    {
      field: "schenddate",
      headerName: "Schedule End",
      flex: 0.6,
      renderCell: (val) => {
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A");
      },
    },
  ];
  return (
    <div className="pages">
       
      <Backdrop  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
    <LoadingPanel ></LoadingPanel>
    </Backdrop>
      <HeaderTabs tabs={[{ title: "Incident Updates" }]} tabValue={0} />
      <Box sx={{ width: "95%", margin: "0 auto", height: 900 }}>
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
          rowHeight={80}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 15, 20, 50]}
          pagination
          getRowId={(row) => row.sch_mnt_activity_id}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        />
      </Box>
    </div>
  );
};
export default ViewScheduleMaintenance;
