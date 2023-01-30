import React, { useMemo, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import api from "../../Api";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import DisplayComponents from "./DisplayComponents";
import styled from "styled-components";
import { Backdrop } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#80daeb",
  },
}))(LinearProgress);
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

const DashBoard = ({ bu }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [incidentCauseData, setIncidentCauseData] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);
  useEffect(() => {
    setComponentsLoading(true);
    getComponents();
    getIncidentStatusDashBoard();
  }, [bu]);
  const getComponents = async () => {
    try {
      setComponentsLoading(true);
      const data = await api.getComponents();
      console.log(data);
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
