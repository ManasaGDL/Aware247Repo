import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import companylogo from "../../assets/data_axle.PNG";
import { makeStyles } from "@material-ui/core/styles";
import bgLogo from "../../assets/body_bg.png";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import api from "../../Api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Status from "../DashBoard/Status";
import HeaderTabs from "../common/HeaderTabs";
import ViewAllIncidents from "./ViewAllIncidents";
import Backdrop from '@mui/material/Backdrop';
import "./index.css";
import ScheduledMaintanence_client from "./ScheduledMaintenace_client";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import { useParams } from "react-router-dom";
import clientApi from "../../api/clientApi";
import { axiosInstance } from "../../axios";
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundImage: `url(${bgLogo})`,
    height: "80px",
    //   backgroundRepeat:"repeat-x"
  },

  select: {
    color: "white",
    "&:after": {
      borderBottomColor: "darkred",
    },
    "& .MuiSvgIcon-root": {
      color: "cyan",
    },
  },
}));
const tabs = [ {title:"Incidents",content:<ViewAllIncidents/>},{title:"Scheduled Maintenance",content:<ScheduledMaintanence_client></ScheduledMaintanence_client>}]
const StatusPage = () => {
  const classes = useStyles();
  const [tabValue , setTabValue] = useState(-1)
  const [ loading ,setLoading ] = useState(false)
  const [componentList, setComponentList] = useState([]);
  const navigate = useNavigate();
  const { businessunit } = useParams();
  useEffect(() => {
    getComponentsList();

 delete axiosInstance.defaults.headers.common["Authorization"];
    // localStorage.removeItem("refresh_token")
    // localStorage.removeItem("access_token")
  }, []);
  const getComponentsList = async () => {
    try {
        setLoading(true)
      
      const response = await clientApi.getComponentStatus(businessunit);
    
      setComponentList(response?.data);
      if(response.data.length === 0)
      {
        alert("check whether Businessunit is valid or not!")
      }
    } catch (e) {
      console.log("error",e)
    } finally{
        setLoading(false)
    }
  };
  return (
    <div className= "status">
      <AppBar className={classes.header}>
        <Toolbar sx={{ pl: 3 }}>
          <Typography
            variant="h2"
            component="div"
            sx={{
              flex: "1",
              width: "300",
              display: { xs: "none", sm: "block" },
            }}
          >
            <img
              src={companylogo}
              align="left"
              alt="data axle"
              height="60px"
              style={{ paddingTop: 10 }}
            />
          </Typography>
          <div>
            <Button
              variant="contained"
              sx={{ color: "white", mr: 3 , fontWeight:700 }}
               onClick={()=>navigate(`/Status/add/${businessunit}`)}
            >
              Subscribe To Updates
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <LoadingPanel></LoadingPanel>
        </Backdrop>
     {!loading && <Box sx={{  width: "1000px", margin: '0 auto' , marginTop:"160px"}}>
      
        <List sx={{ border: 1, borderRadius: "5px", borderColor: "#CFD2CF" }}>
          {componentList.map((item, index) => {
            return (
              <>
                {item.has_subgroup ? (
                  <>
                    <ListItem sx={{ paddingTop: "2px" }}>
                      <ListItemText
                        disableTypography
                        sx={{                       
                          fontSize: "16px",
                          fontWeight:600,
                         
                        }}
                        primary={item.component_name}
                      ></ListItemText>
                    
                    </ListItem>
                    <List>
                      {item["sub_component"].map((sub_component) => {
                        return (
                          <ListItem
                            secondaryAction={<Status labels={ sub_component.component_status
                                .component_status_name}>
                                </Status> }
                            sx={{ paddingLeft: "80px", paddingTop: "2px" }}
                          >
                            <ListItemText  disableTypography
                        sx={{
                          fontSize: "16px",
                          fontWeight:600,
                         
                        }}
                              primary={sub_component.component_name}
                            ></ListItemText>
                          </ListItem>
                        );
                      })}  
                    </List>  
                  </>
                 
                ) : (
                  <ListItem 
                    secondaryAction={
                      <Status labels={item.component_status.component_status_name}></Status>
                    }
                  >
                    <ListItemText disableTypography
                        sx={{
                        
                          fontFamily:"Assistant",
                          fontSize: "16px",
                          fontWeight:600,
                         
                        }}primary={item.component_name}></ListItemText>
                  </ListItem>
                )}
                  <Divider 
                  sx={{":last-child":{'borderBottom':0}}}
                  />
              </>
            );
          })}
        </List>
        <HeaderTabs tabs={tabs} tabValue={tabValue} setTabValue={setTabValue}/>
      </Box>}
    </div>
  );
};
export default StatusPage;
