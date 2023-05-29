import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  ProSidebarProvider,
} from "react-pro-sidebar";
import { sidebardata } from "../sidebar/sidebardata";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Paper from "@mui/material/Paper";
import "../../App.css";
import styled from "styled-components";
const Menuitem = styled(MenuItem)`
  background-color: ${(props) => (props.bg === "active" ? "#80daeb" : "")};
`;

const SidebarComponent = ({ handleCollapse, dynamicSideBarData ,collapse=false}) => {
  const [innerWidth, setInnerWidth] = useState({ width: window.innerWidth });
  const [position, setPosition] = useState("fixed");
  const { collapseSidebar, collapsed } = useProSidebar();

  // const [toggled, setToggled] = useState(false)

  const location = useLocation();

  const setWidth = () => {
    setInnerWidth({ width: window.innerWidth });
  };

  useEffect(() => {
    window.addEventListener("resize", setWidth);
    if(innerWidth.width<1050)
    {
      collapseSidebar(true)
      // handleCollapse(true)
    }
    else {collapseSidebar(false)
      // handleCollapse(false)
    }
    if (innerWidth.width < 600) {
      setPosition("static");
     collapseSidebar(false)
      handleCollapse(true);
    } else setPosition("fixed");
    return () => {
      window.removeEventListener("resize", setWidth);
    };
  }, [innerWidth.width]);
  const handleClick = () => {
    collapseSidebar();
    // handleCollapse(collapsed)
  };

  return (
    <div
      style={
        ({ height: "100vh" },
        {
          display: "flex",
          flexDirection: "row",
          position: position,
          textAlign: "left",
        })
      }
    >
      <Paper elevation={3}>
        <Sidebar width="210px" style={{ height: "100vh" }}>
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                if (level === 0) {
                  return {
                    // color: disabled ? "#eee" : "#455A64",
                    // backgroundColor: active ? "#fff" : undefined,
                    "&:hover": {
                      backgroundColor: "#C0EEF2",

                      fontWeight: "bold !important",
                    },
                  };
                }
              },
            }}
          >
            <MenuItem
              style={{ textAlign: "center" }}
              icon={
                collapsed ? (
                  <b>
                    <AiOutlineArrowRight style={{ fontSize: "20px" }} />
                  </b>
                ) : (
                  <b>
                    <AiOutlineArrowLeft style={{ fontSize: "20px" }} />
                  </b>
                )
              }
              onClick={() => {
                collapseSidebar();               
                handleCollapse(collapsed , innerWidth.width);
              }}
            ></MenuItem>
            {sidebardata.map((item) => {
              if (dynamicSideBarData.includes(item.title))
                return (
                  <Menuitem
                    key={item.title}
                    bg={`${item.path === location.pathname ? "active" : ""}`}
                    icon={item.icon}
                    component={<Link to={item.path} />}
                  >
                    <b style={{ fontSize: "14px" }}> {item.title}</b>
                  </Menuitem>
                );
            })}
          </Menu>
        </Sidebar>
      </Paper>
    </div>
  );
};
export default SidebarComponent;
