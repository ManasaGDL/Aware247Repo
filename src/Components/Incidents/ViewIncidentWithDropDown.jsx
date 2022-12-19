import React ,{ useState,useEffect} from "react"
import { DataGrid ,GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import Box from "@mui/material/Box";
import api from "../../Api"
import { Button } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GridActionsCellItem } from "@mui/x-data-grid";
const handleIconClick =(e,val)=>{
    console.log("icon click",val)
   
}
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
  
    {
      field:"Actions",
      width:80,
      type:"actions",
     getActions:(params)=>[
        <GridActionsCellItem
        sx={{'&.MuiMenuItem-root:hover':{
            backgroundColor:"#00bcd4"
           
        }}}
            // icon={<SecurityIcon />}
            label="PostMortem"
            onClick={(e)=>{handlePostMortem(params.id)}}
            showInMenu
          />,
          <GridActionsCellItem
          sx={{'&.MuiMenuItem-root:hover':{
            backgroundColor:"#00bcd4"
           
        }}}
           
            label="View Incident"
            // onClick={duplicateUser(params.id)}
            showInMenu
          />,
          <GridActionsCellItem
          sx={{'&.MuiMenuItem-root:hover':{
            backgroundColor:"#00bcd4"
           
        }}}
          
          label="Delete"
          // onClick={duplicateUser(params.id)}
          showInMenu
        />
    ]
    }
   
  ];
  const handlePostMortem =(val)=>{
    alert(val)
   }

const ViewIncidentWithDropDown = () =>{
  const [data , setData] = useState([])
  const [loading , setLoading] = useState(false)
  const [ selectedRow ,setSelectedRow] = useState({})

 
  

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
    useEffect(()=>{
   const getIncidents = async() =>{
 try{
  setLoading(true)
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
  
  const handleDelete =()=>{
    alert(selectedRow.id)
  }
    return <><div className="pages" >
      {loading && <LoadingPanel/>}
      <Box sx={{ height: 200, width: '100%' }}>
      {/* <Stack sx={{pb:1}}
      direction="row"
      justifyContent="flex-end"
      alignItems="flex-end"
      spacing={2}
     >
    <Button variant="contained" sx={{color:"white"}} onClick={e=>handlePostMortem()}>POSTMORTEM</Button>
    <Button variant="contained" sx={{color:"white"}} >VIEW INCIDENT</Button>
    <Button variant="contained" sx={{color:"white"}} onClick={e=>handleDelete()}>DELETE</Button>
     </Stack> */}
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
export default ViewIncidentWithDropDown;