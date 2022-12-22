import React ,{ useState,useEffect} from "react"
import { DataGrid } from '@mui/x-data-grid'
import Box from "@mui/material/Box";
import api from "../../Api"
import { Button } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
const columns = [
  {
    field:'id',
  headerName:'Incident ID',
  headerClassName:"header",
 
  flex: 1,
  minWidth: 150,
  // ,width:120
  },
  {
    field:'name',headerName:"Name",
    flex:1,
    // ,width:150
  },
  // { field: 'incident_id', headerName: 'IncidentID', width: 90 },
  {
    field: 'status',
    headerName: 'Status',
    flex:1,
    minWidth: 50,
    // width: 150,
 
  },
  {
    field:"created_datetime",
    headerName:' Created Date',
    flex:1,
    // width:150,
    renderCell:(val)=>{
      return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")
    }
  },
 
];

const ViewIncidents = () =>{
  const [data , setData] = useState([])
  const [loading , setLoading] = useState(false)
  const [ selectedRow ,setSelectedRow] = useState({})
    useEffect(()=>{
   const getIncidents = async() =>{
 try{
  setLoading(true)
  alert("ViewIncidents")
 const res= await api.viewIncidents();

 setData(res?.data?.results)
 setLoading(false)
 }
 catch(e)
 {
    console.log(e)
 }
   }   
    getIncidents();
    },[])
   
  const handleRowClick = (e) =>{
   setSelectedRow(e)
  }
  const handlePostMortem =()=>{
   alert(selectedRow.id)
  }
  const handleDelete =()=>{
    alert(selectedRow.id)
  }
    return <><div className="pages" >
      {loading && <LoadingPanel/>}
      <Box sx={{ height: 200, width: '100%' }}>
      <Stack sx={{pb:1}}
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
      spacing={2}
     >
    <Button variant="contained" sx={{color:"white"}} onClick={e=>handlePostMortem()}>POSTMORTEM</Button>
    <Button variant="contained" sx={{color:"white"}} >VIEW INCIDENT</Button>
    <Button variant="contained" sx={{color:"white"}} onClick={e=>handleDelete()}>DELETE</Button>
     </Stack>
       {data.length>0?<DataGrid rows={data} columns={columns}  autoHeight  pageSize={10}
        // rowsPerPageOptions={[5]}
        onRowClick={handleRowClick}
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
             outline: "none !important",
          },
          
       }}
      />:""}
        </Box>
    </div>
    </>
}
export default ViewIncidents;