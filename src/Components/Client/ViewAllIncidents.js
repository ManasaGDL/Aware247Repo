import React , { useState , useEffect } from "react";
import clientApi from "../../api/clientApi";
import Tooltip,{ TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { List,ListItem ,ListItemText,Typography,Box} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid'
const  ViewAllIncidents = () =>{
    const [ data , setData ] = useState([])
    const [ loading , setLoading ] = useState(false)
    const regex = /(<([^>]+)>)/ig;
    const CustomWidthTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} placement = "right-end"/>
    ))({
      [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 300,
        lineHeight:2,
        fontSize:11,
      fontWeight:600,
     transparent:0.4,
      border:2,
        backgroundColor:"#808080"
        // "#808080"
      },
    });
    const columns =[ 
    {
   field:"status",
   headerName:"Status",
   flex:0.3,
   renderCell:(val)=>{
    return val?.value?.charAt(0).toUpperCase()+val?.value?.slice(1)
   }
    },{
  field:"name",
  headerName:"Name",
  flex:1,
  renderCell:(val)=>{
    return <div className="wrap">{val?.value}</div>
  }
    },
    {
  field:"message",
  headerName:"Message",
  flex:1,
  renderCell:(val)=>{
  return <CustomWidthTooltip  title={val?.value?.replace(regex,'')} >
    <span className="wrap">{val?.value?.replace(regex,'')}</span>
    {/* {val?.value?.replace(regex,'')} */}
    </CustomWidthTooltip >
  }
    }
    ,
    {
  field:"modify_datetime",
  headerName:"Last Modified",
  flex:0.5,
  renderCell:(val)=>{
    return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>
    }
}
]

useEffect(()=>{
    
    getIncidentsStatusPage();
},[])
const getIncidentsStatusPage = async() =>{
    
    try{
        setLoading(true)
 const response = await clientApi.getIncidents();
 setData(response?.data)
    }
    catch(e)
    {

    }finally{
        setLoading(false)
    }
}
    return <div>
        <Box sx={{width: "100%",margin: '0 auto',height:1000}}>
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <LoadingPanel></LoadingPanel>
                </Backdrop>
                <DataGrid columns={columns} rows={data}  sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600
          }
        }} pageSize='30' rowHeight={80}/>
           {/* { data.length>0 && <List sx={{  border: 1, borderRadius: "5px", borderColor: "#CFD2CF"}}>
                {data.map( item =>{
                    return <ListItem>
                        <ListItemText primary={<><b>{item?.status?.charAt(0).toUpperCase()+item?.status?.slice(1)}</b> --{item.name}</>}
                        secondary = {<>
                        <div>
                        {item?.message?.replace(regex,'')}
                        </div>
                        &nbsp;
                        <div>
                           Last Modified : {dayjs(item.modify_datetime).format("YYYY/MM/DD hh:mm:ss A")}
                        </div>
                        </>}>
                        </ListItemText>
                    </ListItem>
                })}
            </List>} */}
        </Box>
    </div>
}
export default ViewAllIncidents;