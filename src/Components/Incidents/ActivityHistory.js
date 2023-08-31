import React, { useEffect, useState } from "react"; // response format different
import api from "../../Api";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import dayjs from "dayjs";
const initialPageState={limit:10,offset:0}
const ActivityHistory = ({ id, bu }) => {
  const [data, setData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [ pageState , setPageState] = useState({...initialPageState});
  const [ records , setRecords] = useState(0)

  useEffect(() => {
    if (id) {
      getActivityLog(id);
    }
  }, [id,bu
    ,
    // pageState.limit,pageState.offset
  ]);
  
  const columns = [
   
    {
      field: "component_name",
      headerName: "Component Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "component_status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "created_datetime",
      headerName: "CreatedDateTime",
      minWidth: 150,
      flex: 1,
      renderCell: (val) => {
        return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A");
      },
    },
    // {
    //   field: "modifieduser",
    //   headerName: "Modified User",
    //   minWidth: 150,
    //   flex: 1,
    //   renderCell: (val) => {
    //     console.log(val.value)
    //     return val.value;
    //   },
    // },
  ];

  const getActivityLog = async (id) => {
    try {
      let arr = [];
      let a = [];
      const response = await api.getActivityLog({ incident_id: id },pageState);
      
      response?.data?.forEach((obj) => {
        if (obj.components.length > 0) {
          obj.components.map((item) => {
            return arr.push(item);
          });
        }
        setData(arr);
      });
    } catch (e) {}
  };
  return (
    <div className="pages">
      <Box sx={{ height: 700, width: "100%" }}>
        {
          <DataGrid
            columns={columns}
            rows={data}
            getRowId={(row) => {
              return row?.incident_component_act_id;
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
            // rowCount={records}
            // paginationMode="server"
            rowHeight={40}
            autoHeight={true}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 15, 20, 50]}
            pagination
            // onPageChange={(val)=>{
            //   setPageState(prev=>({...prev,offset:val*prev.limit}))
            // }}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          />
        }
      </Box>
    </div>
  );
};
export default ActivityHistory;
