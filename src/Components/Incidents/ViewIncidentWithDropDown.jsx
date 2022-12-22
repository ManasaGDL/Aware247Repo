import React ,{ useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid'
import Box from "@mui/material/Box";
import api from "../../Api"
import { Button, TextField } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";

import { GridActionsCellItem } from "@mui/x-data-grid";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle'


const ViewIncidentWithDropDown = ({bu}) =>{
  const [data , setData] = useState([])
  const [loading , setLoading] = useState(false)
  const [ selectedRow ,setSelectedRow] = useState({})
  const [openDialog , setOpenDialog] =useState({flag:false,value:''})
  const [openDeleteDialog , setOpenDeleteDialog] = useState({flag:false,value:''})
  const [text,setText] =useState("")
  const [keyword,setKeyword]=useState('')
  const navigate = useNavigate();
  const columns = [
    {
      field:'id',
    headerName:'Incident ID',
    headerClassName:"header",
   
    flex: 0.4,
    minWidth: 50,
    // renderCell:(val)=>{
    //   return <Link href={`/admin/create_incidents`}></Link>
    // }
    },
    {
      field:'name',headerName:"Name",
      flex:1,
     renderCell:(val)=>{
      console.log(val)
      return <div className="wrap">{val.value}</div>
     }
    },
  
    {
      field: 'status',
      headerName: 'Status',
      flex:0.3,
      minWidth: 50,
    },
    {
      field:"created_datetime",
      headerName:' Created Date',
      flex:0.4,
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
        // sx={{'&.MuiMenuItem-root:hover':{
        //     // backgroundColor:"#E0FFFF"
        //     // #00bcd4"
           
        // }}}
            // icon={<SecurityIcon />}
            label="PostMortem"
            onClick={(e)=>{handlePostMortem(params.id)}}
            showInMenu
          />,
          <GridActionsCellItem
        //   sx={{'&.MuiMenuItem-root:hover':{
        //     backgroundColor:"#00bcd4"
           
        // }}}
           
            label="View Incident"
            onClick={()=>handleViewIncident(params.id)}
            showInMenu
          />,
          <GridActionsCellItem
        //   sx={{'&.MuiMenuItem-root:hover':{
        //     backgroundColor:"#00bcd4"
           
        // }}}
          
          label="Delete"
          onClick={()=>handleDeleteIncident(params.id)}
          showInMenu
        />
    ]
    }
   
  ];
  const handleViewIncident =(id)=>{
  navigate(`/admin/create_incident/${id}`)
  }
  const handleDeleteIncident =(val)=>{
   setKeyword('')
    setOpenDeleteDialog({flag:true,value:val})
  }
  const handlePostMortem =(val)=>{
  
    setOpenDialog({flag:true,value:val})
    }
   
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
    },[bu])
   
  const handleRowClick = (e) =>{
   setSelectedRow(e)
  }
  
  const handleDelete =()=>{
    alert(openDeleteDialog.value)
    setOpenDeleteDialog({flag:false,value:''})
    setKeyword('')
  }
  const handleFormSubmit =(e) =>{
   
 console.log(openDialog.value,text)

  }
  const handleInputChange =(e)=>{
    const { name,value}=e.target
    setText(value)
  }
  const handleClose=()=>{
    setOpenDialog({flag:false,value:''})
    setOpenDeleteDialog({flag:false,value:''})
  }
  const handleDeleteConfirmation =(e)=>{
 setKeyword(e.target.value)
  }
    return <><div className="pages" >
      {loading && <LoadingPanel/>}
      <Box sx={{ height: 200, width: '100%' }}>
      
       {data.length>0?<DataGrid rows={data} columns={columns}  autoHeight  pageSize={10}
     
        onRowClick={handleRowClick}
        sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
             outline: "none !important",
          },
          
       }}
      />:""}
        </Box>
        <Dialog open={openDialog.flag} onBackdropClick={handleClose} >
        <form onSubmit={handleFormSubmit}>   
     <DialogTitle>Write Postmortem</DialogTitle>
     <DialogContent style={{height:'300px'}}>
      <TextField name="postmortem" multiline  sx={{
        width: 400
    }}  InputLabelProps={{
      shrink: true
    }}
    value={text}
    onChange={(e)=>{
      e.stopPropagation()
      handleInputChange(e)}}
    minRows={10}
   > </TextField>
     </DialogContent>
     <DialogActions sx={{ alignItems:"center"}}>
      <Button variant="contained" type="submit" sx={{ color:"white"}}> Create Postmortem</Button>
     </DialogActions>
     </form>
        </Dialog>
        <Dialog open={openDeleteDialog.flag} onBackdropClick={handleClose} >
      <DialogTitle sx={{fontWeight:"700"}}> Do want to Delete Incident with ID: {openDeleteDialog.value} ? </DialogTitle>
      <DialogContent>
        WARNING! Deleting a incident cannot be undone. All associated data will be deleted as well. Please be absolutely sure this is what you want.
      
      <br/><br/><div style={{alignItems:'center'}}>
      Type DELETE in the box below for final confirmation, then hit the delete button.
      </div>
      <br/>
      <TextField name="delete" sx={{width: 300}} value={keyword} onChange={handleDeleteConfirmation} placeholder="Write 'DELETE'"></TextField>
      </DialogContent>
      <DialogActions>
        <Button variant="contained"color="error" disabled={keyword!=="DELETE"?true:false}
        onClick={e=>handleDelete(e)}>PERMANENTLY DELETE INCIDENT</Button>
      </DialogActions>
        </Dialog>
    </div>
    </>
}
export default ViewIncidentWithDropDown;