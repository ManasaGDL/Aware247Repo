import { useState , useEffect , useContext} from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Api";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import dayjs from "dayjs";
import UpdateIcon from '@mui/icons-material/Update';
import businessUnitContext from "../../context/businessUnitContext";
import CustomDeleteDialog from "../common/Dialogs/CustomDeleteDialog";
import { SnackbarContext } from "../../context/SnackbarContext";
const SubscribersList =({name,handleRefresh})=>{
    const [ data , setData ] = useState([])
    const [ pageSize , setPageSize ] = useState(15)
    const bu =  useContext(businessUnitContext)

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
      open: false,
      type: "",
      id: "",
    });
    const navigate = useNavigate();
    const { setSnackBarConfig } = useContext(SnackbarContext);
    const columns = [
        {
           field:"first_name",
           headerName:"Name",
           type:"string",
           flex:1,
          //  sortable: false,
          //  filterable:false,
          //  disableColumnMenu:false,
           valueGetter:(params)=>{
           return params.row["first_name"]+" "+params.row["last_name"]
           }
        }
        ,
        {
            field: name==="email"?"email":"phone_number",
            headerName:name === "email"?"Email Subscribers":"SMS Subscribers",
            flex:1,
        },
         {
            field:"modify_datetime",
            headerName:"Date Added",
            flex:0.8,
            renderCell :(val)=>{
                return dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")
            }
        },
       
        {
            field:"Actions",
            headerName:"Actions",
            type:"actions",
            flex:1,
            getActions: (params) => [
                <GridActionsCellItem
                label="Unsubscribe"
                showInMenu
                onClick={e=>setOpenDeleteDialog({open:true ,id:params.row.subscriber_id,type:"Subscriber",name:name==="email"?params.row.email:params.row.phone_number})}
                icon ={<UnsubscribeIcon/>}
                />,
                <GridActionsCellItem
                label="Manage"
                showInMenu
                icon={<UpdateIcon/>}
                onClick={e=>navigate(`/admin/subscribers/manage/${params.row.subscriber_id}`,{state:{components:params.row.components}})}
                />
            ]
        }
    ]
    useEffect(() =>{
        if(name === "email")
      getSubscribersList({ "email_delivery":1 });
      if(name === "sms")
      getSubscribersList({"sms_delivery":1})

    },[name,bu])
    const getSubscribersList = async(payload) =>{
  try{
 const response = await api.getSubscribersList(payload)
setData(response?.data?.results)
  }catch(e)
  {

  }
    }
    const deleteSubscriber = async (data) => {
      try {
        if (data.id) {
          const res = await api.deleteSubscriber(data.id);
          const message = `${data.name} ${data.type} succesfully deleted`;
          if (res.status === 200){ 
            getSubscribersList();
           
          }
          setSnackBarConfig({
            open: true,
            message: message,
            severity: "success",
          });
        }
    
      } catch (e) {
      } finally {
        if(name === "email")
      getSubscribersList({ "email_delivery":1 });
      if(name === "sms")
      getSubscribersList({"sms_delivery":1}) // refresh
        handleRefresh();
      }
      setOpenDeleteDialog({ ...openDeleteDialog, open: data.open });
    };
    return <div className="pages">
    <Box sx={{ height:"auto" }}>
        <DataGrid autoHeight={true} columns={columns} rows={data} getRowId={(row)=>row.subscriber_id} 
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10,15, 20,50]}
        pagination
        rowHeight={40}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
       sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '.MuiDataGrid-columnHeaderTitle': {
              fontWeight: 600
            },
            ' .MuiDataGrid-columnHeader':{
                backgroundColor:"white"
            }
          }}/>
         <CustomDeleteDialog
          open={openDeleteDialog.open}
          id={openDeleteDialog.id}
          type={openDeleteDialog.type}
          deleteComponent={deleteSubscriber}
         name={openDeleteDialog.name}
        />
    </Box>
    </div>
 }
 export default SubscribersList;
