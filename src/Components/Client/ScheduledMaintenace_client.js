import { useEffect , useState} from "react";
import clientApi from "../../api/clientApi";
import { Box } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import "./index.css"
const ScheduledMaintanence_client = ()=>{
    const [ data , setData] = useState([])
    const [ loading , setLoading ] = useState(false)
    const regex =  /(<([^>]+)>)/ig
    useEffect(()=>{
        setLoading(true)
        getScheduledIncidents();
    },[])
    const getScheduledIncidents = async()=>{
        try{
     const res = await clientApi. getScheduledMaintenanceList();
   setData(res?.data);
   setLoading(false)
        }catch(e)
        {

        }
    }
    return <div>
        <Box sx= {{ width : "100%" ,margin:'0 auto' , height:1000 , textAlign:"left"}}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
              <LoadingPanel></LoadingPanel>
            </Backdrop>
            { data.map(obj=>{
                return <div>
                <Card variant="outlined" key={obj.sch_mnt_activity_id}  >
                    <CardContent >
                        <div>
                          <Typography   sx={{ fontWeight:600,fontFamily:"Assistant"}}>
                              {obj?.status} - <label style={{ color:"#616A6B"}}> {obj.name}</label>
                          </Typography>
                          <Typography   sx={{ fontWeight:400,fontFamily:"Assistant", color:"#616A6B"}}>
                             Schedule start - <label > {dayjs(obj.schstartdate).format("DD-MMM-YYYY hh:mm A")}</label>
                          </Typography>
                          <Typography   sx={{ fontWeight:400,fontFamily:"Assistant", color:"#616A6B"}}>
                             Schedule end - <label > {dayjs(obj.schenddate).format("DD-MMM-YYYY hh:mm A")}</label>
                          </Typography>
                          <Typography   sx={{ fontWeight:400,fontFamily:"Assistant", color:"#616A6B"}}>
                            <br/>
                            { obj?.message.replace(regex, '').replace(/&nbsp;/g,'')}
                          </Typography>
                          <Typography   sx={{ fontWeight:400,fontFamily:"Assistant", color:"#616A6B"}}>
                            <br/>
                           Last Modified : { dayjs(obj?.created_datetime).format("MMM DD , YYYY hh:mm A")}

                          </Typography>
                          </div>
                         
                    </CardContent>
             </Card>
             <br/>
                </div>
                })}
        </Box>
    </div>
}

export default ScheduledMaintanence_client;