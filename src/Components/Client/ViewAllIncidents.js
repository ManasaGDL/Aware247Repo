import React, { useState, useEffect } from "react";
import clientApi from "../../api/clientApi";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { Collapse, Divider } from "@mui/material";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const ViewAllIncidents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [expanded, setExpanded] = useState(-1);
  let components = [];

  const regex = /(<([^>]+)>)/gi;
  // const detailStyles={
  //   borderTop: "2px solid",
  //   borderTopColor: "primary.main",
  //   pt: 2,
  //   textAlign:"left"
  // }
  const severityColors = {
    Major: "#ffa901",
    Critical: "#FF5733",
    Minor: "#FFC300",
    Moderate: "#6aa84f",
  };
  // const CustomWidthTooltip = styled(({ className, ...props }) => (
  //   <Tooltip {...props} classes={{ popper: className }} placement = "right-end"/>
  // ))({
  //   [`& .${tooltipClasses.tooltip}`]: {
  //     maxWidth: 300,
  //     lineHeight:2,
  //     fontSize:11,
  //   fontWeight:600,
  //  transparent:0.4,
  //   border:2,
  //     backgroundColor:"#808080"
  //     // "#808080"
  //   },
  // });
  //     const columns =[

  //     {
  //    field:"status",
  //    headerName:"Status",
  //    width: 250,
  //    flex:0.6,
  //    renderCell:(val)=>{

  //     return val?.value?.charAt(0).toUpperCase()+val?.value?.slice(1)
  //    }
  //     },{
  //   field:"name",
  //   headerName:"Name",
  //   flex:1,
  //   renderCell:(val)=>{
  //     return <div className="wrap">{val?.value}</div>
  //   }
  //     },
  //     {
  //   field:"message",
  //   headerName:"Message",
  //   flex:1,
  //   renderCell:(val)=>{
  //   return <CustomWidthTooltip  title={val?.value?.replace(

  //,'')} >
  //     <span className="wrap">{val?.value?.replace(regex,'')}</span>
  //     {/* {val?.value?.replace(regex,'')} */}
  //     </CustomWidthTooltip >
  //   }
  //     }
  //     ,
  //     {
  //   field:"modify_datetime",
  //   headerName:"Last Modified",
  //   flex:0.6,
  //   renderCell:(val)=>{
  //     return <div>{dayjs(val.value).format("YYYY/MM/DD hh:mm:ss A")}</div>
  //     }

  // },

  // ]

  useEffect(() => {
    getIncidentsStatusPage();
  }, []);
  const getIncidentsStatusPage = async () => {
    try {
      setLoading(true);
      const response = await clientApi.getIncidents();

      setData(response?.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const labelStyle = { 
     fontFamily:"Assistant",
    fontWeight: 800};

  const labelClass = {
    color: "#4b4b4b",
    fontSize: "13px",
    color: "#4b4b4b",
    justifyContent: "flex-start",
    fontWeight: 500,

    
  };
  return (
    <div>
      <Box sx={{ width: "100%", margin: "0 auto", height: 1000 }}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingPanel></LoadingPanel>
        </Backdrop>

        {data.map((list) => {
          components = [];

          list?.activity_history.map((obj) => {
            components = [];
            if (obj?.components.length > 0) {
              obj.components.map((item) => {
                return components.push(item?.component_name);
              });
            }
          });

          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid container direction="row" display="flex">
                  <Grid
                    item
                    md={0.5} xs={12}
                    // justify="flex-end"
                    // alignItems="center"
                    container
                  >
                    <ReportProblemIcon
                      sx={{
                        color: Object.keys(severityColors).map((key) => {                   
                          if (key === list.impact_severity) {
                            return severityColors[key];
                          }
                          if (
                            list?.impact_severity === null ||
                            list?.impact_severity === undefined
                          ) {
                            return "#808080";
                          }
                        }),
                        textAlign: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Grid>
                  <Grid item md={5} xs={12}>
                    <Stack sx={{ textAlign: "left" }}>
                      <label style={labelStyle}>
                        Incident Name:
                        <span style={labelClass}>{`\u00A0${list.name}`}</span>
                      </label>
                      <label style={labelStyle}>
                        ACER Number:
                        <span
                          style={labelClass}
                        >{`\u00A0${list.acer_number}`}</span>
                      </label>
                      <label style={labelStyle}>
                        Status:
                        <span style={labelClass}>{` ${
                          list?.status?.charAt(0).toUpperCase() +
                          list?.status?.slice(1)
                        }`}</span>
                      </label>
                      {list.start_time !== null && (
                        <label style={labelStyle}>
                          Start Time :{" "}
                          <span style={labelClass}>{` \u00A0${dayjs(
                            list?.start_time
                          ).format("MMM DD, YYYY hh:mm A")}`}</span>
                        </label>
                      )}
                      {list.end_time !== null && (
                        <label style={labelStyle}>
                          End Time :
                          <span style={labelClass}>{`\u00A0${dayjs(
                            list?.end_time
                          ).format("MMM DD, YYYY hh:mm A")}`}</span>
                        </label>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item md={0.2} display={"flex"}>
                    <Divider orientation="vertical" />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Stack sx={{ textAlign: "left" }}>
                      <label style={labelStyle}>
                        Details:
                        <span style={labelClass}>{`\u00A0${list.message
                          .replace(regex, "")
                          .replace(/&nbsp;/g, "")}`}</span>
                      </label>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionSummary>

              {list?.activity_history.length > 0 &&
                list?.activity_history.map((list, index) => {
                  return (
                    <AccordionDetails>
                      <Divider />
                      <Grid container sx={{ textAlign: "left", paddingTop: 3 }}>
                        <Grid item md={12} sx={6}>
                          <Stack sx={{ textAlign: "left" }}>
                            <label style={labelStyle}>
                              {dayjs(list.modified_datetime).format(
                                "DD/MM/YYYY hh:mm A"
                              )}
                            </label>
                            <label style={labelStyle}>
                              {list.status === "investigating"
                                ? "Impact Description:"
                                : "Impact Update:"}
                              <span
                                style={labelClass}
                              >{`\u00A0${list.issue_impact}`}</span>
                            </label>
                            <label style={labelStyle}>
                              Impact Severity:
                              <span
                                style={labelClass}
                              >{`\u00A0${list?.impact_severity}`}</span>
                            </label>
                            <label style={labelStyle}>
                              Services Impacted:
                              <span
                                style={labelClass}
                              >{`\u00A0${components.join(",")}`}</span>
                            </label>
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  );
                })}
            </Accordion>
          );
        })}
      </Box>
    </div>
  );
};
export default ViewAllIncidents;
