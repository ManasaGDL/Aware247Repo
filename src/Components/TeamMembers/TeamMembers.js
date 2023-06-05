import { useState, useEffect ,useContext} from "react";//count wrong
import { DataGrid } from "@mui/x-data-grid";
import { Box, Container, Stack } from "@mui/system";
import api from "../../Api";
import dayjs from "dayjs";
import { Backdrop } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import businessUnitContext from "../../context/businessUnitContext";
const initialPageState={ limit:10 , offset:0}
const TeamMembers = () => {
  const bu = useContext(businessUnitContext);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [ totalRecords, setTotalRecords] = useState(0);
  const [ pageState , setPageState ] = useState({...initialPageState});
  useEffect(() => {
    setLoading(true);
 
    getTeamMembers(pageState); 
  }, [bu,pageState.limit,pageState.offset]);
 useEffect(()=>{
setPageState(prev=>({
...prev,limit:pageSize
}))
 },[pageSize])
  const getTeamMembers = async (obj) => {
    try {
      const response = await api.getTeamMembers(obj);
      setData(response?.data?.results);
      setTotalRecords(response?.data?.count)
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
  ];
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
          </Stack>
          <Container sx={{ paddingTop: 2, paddingBottom: 4 }}>
           {data.length>0 && <DataGrid
            rowHeight={40}
              columns={columns}
              autoHeight={true}
             
              rows={data}
              getRowId={(row) => row.user_id}
              pagination
              rowsPerPageOptions={[5, 10, 15, 20, 50,100]}
              pageSize={pageSize}
              paginationMode="server"
            
              rowCount={totalRecords}
              onPageChange={e=>{   //     console.log("TM",e)
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
            />}
          </Container>
        </Box>
      )}
    </div>
  );
};
export default TeamMembers;
