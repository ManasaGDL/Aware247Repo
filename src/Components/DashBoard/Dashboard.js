import React, { useMemo, useEffect, useState , useContext } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../Api";
import { Outlet ,useOutletContext} from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DisplayComponents from "./DisplayComponents";
import styled from "styled-components";
import { Backdrop } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import { axiosInstance } from "../../axios";
import businessUnitContext from "../../context/businessUnitContext";
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Container = styled.div`
  max-width: 1500px;
  padding: 32px;
  margin: 14px;
  min-height: 700px;
`;

const DashBoard = ({bu}) => {

  const classes = useStyles();
  const [data, setData] = useState([]);
  const [incidentCauseData, setIncidentCauseData] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [ searchParams , setSearchParams ] = useSearchParams();
  const [ ,setBu]=useContext(businessUnitContext);


   useEffect(()=>{

      callProfileApis();
  },[])
  const callProfileApis=async()=>{
  try{
    const userResponse= await api.getUserProfile();
    const businessUnit= userResponse?.data?.Profile?.last_businessiunit_name; 
    setBu( userResponse?.data?.Profile?.last_businessiunit_name)
  localStorage.setItem("Privileges",userResponse?.data?.Privileges)
  localStorage.setItem("Profile",JSON.stringify(userResponse?.data?.Profile))
  localStorage.setItem("BU",businessUnit)
   localStorage.setItem("user",userResponse?.data?.Profile?.email)
  }catch(e)
  {

  }
  }
  useEffect(() => {
    setComponentsLoading(true);
    getComponents();
    getIncidentStatusDashBoard();
  }, [bu]);
  const getComponents = async () => {
    try {
      setComponentsLoading(true);
      const data = await api.getComponents();
      setData(data?.data);
      setComponentsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  const getIncidentStatusDashBoard = async () => {
    try {
      setComponentsLoading(true);
      const data = await api.getIncidentStatusDashBoard();
      setIncidentCauseData(data?.data);
      setComponentsLoading(false);
    } catch (e) {}
  };
  return (
    <>
      <div style={{ textAlign: "left" }}>
        <h5 style={{ paddingTop: 20, marginLeft: 20 }}>{"Dashboard"}</h5>
        <Container>
          <div>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={componentsLoading}
            >
              <LoadingPanel></LoadingPanel>
            </Backdrop>
          </div>
          <DisplayComponents
            data={data}
            bu={bu}
            incidentCauseData={incidentCauseData}
          />
        </Container> 
        <Outlet />
      </div>
    </>
  );
};
export default DashBoard;
