import React, { useEffect, useState } from "react";
import api from "../../Api";
import { DataGrid } from '@mui/x-data-grid'
import { Box } from "@mui/material";
import dayjs from "dayjs";
const ActivityHistory = ({ id ,bu}) => {
  const [data, setData] = useState({})
  useEffect(() => {
    if (id) {
      getActivityLog(id)
    }
  }, [id])
  const columns = [
    // {
    //   field: 'incidents_activity_id',
    //   headerName: 'Activity ID',
    //   headerClassName: "header",
    //   minWidth: 150,
    //   flex:0.5
    // }, 
    {
      field: "component_name",
      headerName: "Component Name",
      minWidth: 150,
      flex:1
    },
    {
      field: "component_status",
      headerName: "Status",
      minWidth: 150,
      flex:1
    },

    {
      field: "modified_datetime",
      headerName: "ModifiedTime",
      minWidth: 150,
      flex:1,
      renderCell:(val)=>{
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")
      }
    }
  ]
  const getActivityLog = async (id) => {
    try {
      const response = await api.getActivityLog({ "incident_id": id })
      setData(response?.data)
    } catch (e) {

    }
  }
  return <div className="pages">
     <Box sx={{ height: 700, width: '100%' }}>   
    <DataGrid columns={columns} rows={data} getRowId={(row)=>row.incidents_activity_id} sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600
          }
        }} pageSize='15'/>
    </Box>
  </div>
}
export default ActivityHistory;