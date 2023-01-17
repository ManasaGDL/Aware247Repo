import React,{ useMemo } from "react";
import Header from "../Header";

import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from "@mui/material/Grid";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import DisplayComponents from "./DisplayComponents";
import styled from "styled-components";
const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#80daeb',
    },
  }))(LinearProgress);
  const useStyles = makeStyles({
    root: {
      flexGrow: 1,
    },
  });
  const colorCoding=[{name:'Operational',color:'green'},{name:'',color:''},
  ,{name:'Degraded Performance',color:'black'},
  ,{name:'PartialOutage',color:'grey'},
  ,{name:'UnderMaintenance',color:'red'},
  ,{name:'MajorOutage',color:'orange'}]
  const dummydata=[
    {component:'API',status:'Operational',value:'100'},
    {
    component:'Adobe',status:'DegradedPerformance',value:'0'
    },
    {component:'Test2',status:'PartialOutage',value:'50'
    },
    { component:'Test1',status:'MajorOutage',value:'20'
    } ,{ component:'Import',status:'UnderMaintenance',value:'0'
    },{component:'Export',status:'DegradedPerformance',value:'10'}]
const Container = styled.div`
max-width:1500px;
padding:32px;
margin:14px;
`
const DashBoard=()=>{
    const classes = useStyles();
    return <>
    <div style={{textAlign:"left"}}>
    <h5 style={{ paddingTop: 20 , marginLeft:20 }}>{'Dashboard Mockup'}</h5>
      <Container>   
      <DisplayComponents data={dummydata}
// loading = {componentsLoading}
      />
      </Container>
        </div>
        </>
}
export default DashBoard;