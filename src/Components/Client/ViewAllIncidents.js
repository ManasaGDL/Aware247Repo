import React , { useState , useEffect } from "react";
import clientApi from "../../api/clientApi";
import Tooltip,{ TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { List,ListItem ,ListItemText,Typography,Box, IconButton, Grid , Stack} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import { styled } from '@mui/material/styles';
import { Collapse , Divider} from "@mui/material";
import { DataGrid , GridRenderCellParams } from '@mui/x-data-grid'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const  ViewAllIncidents = () =>{
    const [ data , setData ] = useState([])
    const [ loading , setLoading ] = useState(false)
    const [ pageSize, setPageSize ] = useState(20)
    const [ expanded , setExpanded]= useState(-1)
    let components=[]
    const regex =  /(<([^>]+)>)/ig
    const detailStyles={
      borderTop: "2px solid",
      borderTopColor: "primary.main",
      pt: 2,
      textAlign:"left"
    }
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
    //  {
    //   field:"id",
    //   headerName:'',
    //   renderCell:(val)=>{
    //     return <IconButton onClick={()=>expanded===val.value?setExpanded(-1):setExpanded(val.value)}>{val.value === expanded?<RemoveCircleIcon />:<AddCircleRoundedIcon/>}</IconButton>
    //   }
    //  },

    {
   field:"status",
   headerName:"Status",
   width: 250,
   flex:0.6,
   renderCell:(val)=>{
   
    return val?.value?.charAt(0).toUpperCase()+val?.value?.slice(1)
    
    // <Box sx={{ width:1}}><div style={{ textAlign:"left"}}>{params.value}</div><Collapse in={params.id === expanded}>
    //   <Box sx={detailStyles}> 
    //   <div><label>Test</label>{"Test"}</div>
    //   <div><label>Test</label>{"Test"}</div>
    //   <div><label>Test</label>{"Test"}</div>
    //   </Box></Collapse></Box>
    
    
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
  flex:0.6,
  renderCell:(val)=>{
    return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>
    }
    
},

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
const displayClass ={  display: "flex", justifyContent: "flex-start",fontWeight:"bolder",variant:'caption'}
const labelClass={color:"#4b4b4b",fontSize:'13px',color:"#4b4b4b"}
    return <div>
        <Box sx={{width: "100%",margin: '0 auto',height:1000}}>
       
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                    <LoadingPanel></LoadingPanel>
                </Backdrop>
                {/* <DataGrid columns={columns} rows={data}  sx={{
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600
          }
        }} 
         rowHeight={80}
        // getRowHeight={() => 'auto'}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10,15, 20,50]}
        pagination
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}/> */}
          { data.map(list=>{
            components=[];
            (list?.components.map(com=>{
              return components.push(com.component_name)
            }))
            return <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        
        >
          <Grid container sx={{ display:"flex"}}>
      <Grid item md={6} xs={12}>
      <Typography sx={displayClass}>Name : <label style={labelClass}>{`\u00A0 ${list.name}`}</label></Typography>
        <Typography sx={displayClass}>ACER Number<label style={labelClass}>{`\u00A0 # ${list.acer_number}`}</label>
        {/* {components.join(',')} */}
        </Typography>
        <Typography sx={displayClass}>Services Impacted :<label style={labelClass}>{`\u00A0 ${components.join(',')}`}</label></Typography>
        <Typography sx={displayClass}>Status:<label style={labelClass}>{`\u00A0 ${list?.status?.charAt(0).toUpperCase()+list?.status?.slice(1)}`}</label></Typography>
      </Grid>
     
      {/* <Divider orientation="vertical" flexItem  /> */}
     <Grid item md={6} xs={12}>

        <Typography sx={displayClass}>Start Time : <label style={labelClass}>{` \u00A0\u00A0${dayjs(list?.start_time).format("DD/MM/YYYY hh:mm:ss A")}`}</label></Typography>
        <Typography sx={displayClass}>End Time :<label style={labelClass}>{`\u00A0\u00A0\u00A0${dayjs(list?.end_time).format("DD/MM/YYYY  hh:mm:ss A")}`}</label></Typography>
     </Grid>
          </Grid>
          {/* <Typography sx={{ fontWeight:600 , color:"grey" , width:"33%",flexShrink: 0,textAlign:"left"}}>{components.join(',')}</Typography>
          <Typography sx={{ fontWeight:600 , color:"grey",width:"33%",textAlign:"left"}}>Issue <label style={{color:"#4b4b4b",fontSize:'13px'}}>{` # ${list?.acer_number}`}</label> </Typography>
          <Typography sx={{ fontWeight:600 , color:"grey",textAlign:"left"}}>Status <label style={{color:"#4b4b4b",fontSize:'13px'}}>{` : ${list?.status}`}</label> </Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Stack direction="column">
            <Typography sx={displayClass}>Details : <label style={labelClass}>{` \u00A0 ${list.message.replace(regex, '')
            //  .replace(/&lt;/g, "").replace(/&gt;/g, "").replace(/&lt;p&gt;/g,'')
            }
            `
    }</label></Typography>
        <Typography sx={displayClass}>Impact Update:<label style={labelClass}>{` \u00A0 ${list.issue_impact}`}</label></Typography>
            </Stack>
          </Typography>
        </AccordionDetails>
      </Accordion> })}
      
        </Box>
       
    </div>
}
export default ViewAllIncidents;