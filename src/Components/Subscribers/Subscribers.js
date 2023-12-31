import React, { useEffect, useState , useContext} from "react";
import { Container, Backdrop, Stack } from "@mui/material";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import SubscribersCount from "./SubscribersCount";
import SubscribersDetails from "./SubscribersDetails";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import { useNavigate } from "react-router-dom";
import businessUnitContext from "../../context/businessUnitContext";

import api from "../../Api";
const Subscribers = () => {
  let navigate = useNavigate();
  const bu = useContext(businessUnitContext)
  const [subscribersCount, setSubscribersCount] = useState({
    email_subscibers: "",
    sms_subscibers: "",
  });
  const [loading ,setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    getSubscribersCount(); // api to get subscribers count
  }, [bu]);
  const handleRefresh=()=>{
    getSubscribersCount();// refresh the grid page when subscribers are deleted or managed
  }
  const getSubscribersCount = async () => {
    try {
      const response = await  api.getSubscribersCount();
      setSubscribersCount(response?.data[0])
      setLoading(false)
    } catch (e) {}
  };
  return (
    <>
      <div style={{ textAlign: "left" }}>
      
        <Stack direction="row"
  justifyContent="space-between"
  alignItems="center"
  spacing={12} 
  sx={{ height:50,marginRight:2}}
      
        >
            <h5 style={{ paddingTop: 20, marginLeft: 20 }}>{"Subscribers"}</h5>
          <StyledButton 
            variant="contained"
            onClick={() => navigate("/admin/subscribers/addSubscriber")}
          >
            {" "}
            + Add A Subscriber
          </StyledButton>{" "}
        </Stack>
        <Container sx={{ paddingBottom: 5, paddingLeft: 5 }}>
          <div>
            <Backdrop open={loading}
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <LoadingPanel></LoadingPanel>
            </Backdrop>
          </div>
          <div>
            <SubscribersCount  subscribersCount ={subscribersCount}/>
            <SubscribersDetails handleRefresh={handleRefresh}/>
          </div>
        </Container>
      </div>
    </>
  );
};
export default Subscribers;
