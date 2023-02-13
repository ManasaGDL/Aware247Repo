import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import * as yup from "yup";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  ListItem,
  ListItemText,
  List,
  Divider,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SnackbarContext } from "../../context/SnackbarContext";
import companylogo from "../../assets/data_axle.PNG";
import { makeStyles } from "@material-ui/core/styles";
import bgLogo from "../../assets/body_bg.png";
import Grid from "@mui/material/Grid";
import clientApi from "../../api/clientApi";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
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
export let schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  email: yup.string().when(
    "subscriptionType",
    (["subscriptionType"],
    {
      is: (subscriptionType) => {
        return subscriptionType === "Email";
      },
      then: (schema) =>
        yup
          .string()
          .required("Email is required")
          .test("email", "Enter valid Email", (val) => {
            let regex_email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;           
            if (regex_email.test(val)) return true;
          }),
      otherwise: (schema) => schema,
    })
  ),
  //   .test("email","Enter Valid Email",val=>{
  //   let regex_email=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  //   if(regex_email.test(val))
  //   return true;
  //  })
  phone_number: yup.string().when(
    "subscriptionType",
    (["subscriptionType"],
    {
      is: (subscriptionType) => {
        return subscriptionType === "SMS";
      },
      then: (schema) =>
        yup
          .string()
          .required("PhoneNumber is required")
          .test("phoneNumber", "Enter valid Phone Number", (val) => {
            let regex_phno = /^\d{10}$/;
            ///^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
            if (regex_phno.test(val)) return true;
          }),
      otherwise: (schema) => schema,
    })
  ),
  network: yup.string().when(
    "subscriptionType",
    (["subscriptionType"],
    {
      is: (subscriptionType) => {
        return subscriptionType === "SMS";
      },
      then: () =>
        yup
          .string()
          .test("network", "Network is required", function (value) {
            return value !== "Select Network---";
          })
          .required("Network is required"),
    })
  ),
  subscriptionType: yup
    .string()
    .required("Select Subscription Type")
    .test("subscriptionType", "Select Subscription Type", function (value) {
      return value !== "Select Subscription Type";
    }),
});
const Subscribe = () => {
  const { handleSubmit, watch, formState, control } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
    defaultValues: {
      subscriptionType: "Select Subscription Type",
      network: "Select Network---",
    },
  });
  const classes = useStyles();
  const [subscriptionValue, setSubscriptionValue] = useState("");
  const [networkData, setNetworkData] = useState([]);
  const [checkAllChecked, setCheckAllChecked] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [maintainChecked, setMaintainChecked] = useState([]);
  const [componentsList, setComponentsList] = useState([]); // captures all the components from api response
  const { businessunit } = useParams();
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
  const subscriptionArray = ["Select Subscription Type", "SMS", "Email"];
  let subCategoryArray = [];
  let componentsArray = [];
  const navigate = useNavigate();
  useEffect(() => {
    if (checkAllChecked) setMaintainChecked([...componentsList]);
    else setMaintainChecked([]);
  }, [checkAllChecked]);
 
  useEffect(() => {
    if (watch("subscriptionType") !== "Select Subscription Type") {
      setSubscriptionValue(watch("subscriptionType"));
    }
  }, [watch("subscriptionType")]);
  useEffect(() => {
    getNetworks();
    getComponentsList();
  }, []);
  const getComponentsList = async () => {
    try {
      setLoading(true);
      const response = await clientApi.getComponentStatus(businessunit);   
      setData(response?.data);
      response?.data?.map((item) => {
        subCategoryArray = [];
        if (item.has_subgroup) {
          if (item.sub_component.length > 0) {
            item.sub_component.map((com) => {
              subCategoryArray.push({
                component_id: com.component_id,
                component_name: com.component_name,
              });
              componentsArray.push({
                component_id: com.component_id,
                component_name: com.component_name,
              });
            });
          }
          const newEntry = {
            id: item.component_id,
            subCategory: subCategoryArray,
            categoryChecked: false,
          };
          setSubCategoryList((prev) => [...prev, newEntry]); // copying category and subcategory  details if any
        } else {
          componentsArray.push({
            component_id: item.component_id,
            component_name: item.component_name,
          });
        }
      });
      setComponentsList(componentsArray);
      if (response.data.length === 0) {
        alert("check whether Businessunit is valid or not!");
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const getNetworks = async () => {
    try {
      const response = await clientApi.getNetworks();
      if (response) {
        response?.data.unshift("Select Network---");
      }
      setNetworkData(response?.data);
    } catch (e) {}
  };
  const handleCheckbox = (e) => {
    setCheckAllChecked(e.target.checked);
  };
  const handleIndividualCheck = (id, name) => {
    setMaintainChecked(
      maintainChecked.filter((item) => {
        return item.component_id !== id;
      })
    );
   
    if (maintainChecked.findIndex((item) => item.component_id === id) === -1) {
      setMaintainChecked([
        ...maintainChecked,
        { component_id: id, component_name: name },
      ]);
    } 
  };
  const handleSubscribe = (data) => {
    const components = maintainChecked.map((item) => {
      return item.component_id;
    });
    if (data.subscriptionType === "Email") {
      if (data.hasOwnProperty("phone_number")) delete data.phone_number;
      // delete data.subscriptionType
      data = { ...data, email_delivery: 1 };
    }
    if (data.subscriptionType === "SMS") {
      if (data.hasOwnProperty("email")) delete data.email;
      // delete data.subscriptionType
      data = { ...data, sms_delivery: 1 };
    }
    if (data.network === "Select Network---") {
      data = { ...data, network: "" };
    }
    data = { ...data, components: components };
   
    callCreateSubscriber(data);
  };
  const onSubmit = (data) => { 

    handleSubscribe(data);
  };
  const stayOnSamePage = () => {
    setOpenCustomDialog({ open: false, message: "" });
    // window.location.reload(false)
  };
  const callCreateSubscriber = async (payload) => {
    try {
      let response;
      response = await clientApi.createSubscriber(payload);
      navigate(`/Status/${businessunit}`);
      setSnackBarConfig({
        open: true,
        message:
          "Added successfully, you will receive confirmation email/message.",
        severity: "success",
      });
      //  window.location.reload()
    } catch (e) {
      if (e.response?.data) {
        const errordata = Object.values(e.response.data);

        setOpenCustomDialog({ open: true, message: errordata, title: "Error" });
      }
    } finally {
    }
  };
  
  return (
    <div className="status">
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
        </Toolbar>
      </AppBar>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <LoadingPanel></LoadingPanel>
      </Backdrop>
      {data.length > 0 && (
        <Container sx={{ marginTop: "120px" }}>
          <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <Controller
                  control={control}
                  render={({
                    formState,
                    fieldState: { error },
                    field: { onChange, onBlur, value },
                  }) => {
                    return (
                      <TextField
                        label="First Name"
                        id="first_name"
                        onChange={onChange}
                        onBlur={onBlur}
                        error={error}
                        helperText={error ? error.message : undefined}
                        value={value}
                        sx={{ minWidth: "300px" }}
                      />
                    );
                  }}
                  name="first_name"
                />
              </Grid>
              <Grid item md={12}>
                <Controller
                  control={control}
                  render={({
                    formState,
                    fieldState: { error },
                    field: { onChange, onBlur, value },
                  }) => {
                    return (
                      <TextField
                        label="Last Name"
                        id="last_name"
                        onChange={onChange}
                        onBlur={onBlur}
                        error={error}
                        // sx={{ width:"300px"}}
                        helperText={error ? error.message : undefined}
                        value={value}
                        sx={{ minWidth: "300px" }}
                      />
                    );
                  }}
                  name="last_name"
                />
              </Grid>
              <Grid item md={12}>
                <Controller
                  control={control}
                  name="subscriptionType"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <Select
                        id="subscriptionType"
                        name="subscriptionType"
                        onBlur={onBlur}
                        onChange={onChange}
                        error={error}
                        helperText={error ? error.message : undefined}
                        value={value}
                        sx={{ minWidth: "300px" }}
                      >
                        {subscriptionArray.map((item) => {
                          return (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    );
                  }}
                ></Controller>
                <div>
                  <label
                    style={{
                      color: "#d32f2f",
                      fontweight: "400",
                      fontSize: "0.75rem",
                    }}
                  >
                    {formState?.errors?.subscriptionType?.message}
                  </label>
                </div>
              </Grid>
              <Grid item md={12}>
                {subscriptionValue === "Email" && (
                  <Controller
                    control={control}
                    render={({
                      formState,
                      fieldState: { error },
                      field: { onChange, onBlur, value },
                    }) => {
                      return (
                        <TextField
                          label="Email"
                          id="email"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={error}
                          // sx={{ width:"300px"}}
                          helperText={error ? error.message : undefined}
                          value={value}
                          sx={{ minWidth: "300px" }}
                        />
                      );
                    }}
                    name="email"
                  />
                )}
                {subscriptionValue === "SMS" && (
                  <Controller
                    control={control}
                    render={({
                      formState,
                      fieldState: { error },
                      field: { onChange, onBlur, value },
                    }) => {
                      return (
                        <TextField
                          label="PhoneNumber"
                          id="phone_number"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={error}
                          // sx={{ width:"300px"}}
                          helperText={error ? error.message : undefined}
                          value={value}
                          sx={{ minWidth: "300px" }}
                        />
                      );
                    }}
                    name="phone_number"
                  />
                )}
              </Grid>
              <Grid item md={12} sx={{ paddingTop: "10px" }}>
                <div>
                  {subscriptionValue === "Email" && (
                    <label style={{ fontSize: 10, color: "grey" }}>
                      This email address will be subscribed to future
                      notifications
                    </label>
                  )}
                  {subscriptionValue === "SMS" && (
                    <label style={{ fontSize: 10, color: "grey" }}>
                      This Phone number will be subscribed to future
                      notifications
                    </label>
                  )}
                </div>
              </Grid>
              {subscriptionValue === "SMS" && (
                <Grid item md={12}>
                  <Controller
                    control={control}
                    name="network"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => {
                      return (
                        <Select
                          id="network"
                          name="network"
                          onBlur={onBlur}
                          onChange={onChange}
                          error={error}
                          helperText={error ? error.message : undefined}
                          value={value}
                          sx={{ minWidth: "300px" }}
                        >
                          {networkData.map((item) => {
                            return (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      );
                    }}
                  ></Controller>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label
                      style={{
                        color: "#d32f2f",
                        fontweight: "400",
                        fontSize: "0.75rem",
                      }}
                    >
                      {formState?.errors?.network?.message}
                    </label>
                  </div>
                </Grid>
              )}
              <Grid item container md={12} spacing={2}>
                <Grid item md={6} sx={{ justifyContent: "flex-end" }}>
                  {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                      marginTop: "10px",
                      paddingLeft: "80px",
                    }}
                  >
                    Notify Users Subscribed To
                  </label>
                </Grid>

                <Grid item md={6}>
                  <FormControlLabel
                    sx={{ paddingRight: "50px", marginBottom: "5px" }}
                    control={
                      <Checkbox
                        checked={checkAllChecked}
                        onChange={handleCheckbox}
                      ></Checkbox>
                    }
                    label="Check All"
                  ></FormControlLabel>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justify="flex-start">
              <Grid item md={12}>
                <Box sx={{ width: "1000px", margin: "0 auto" }}>
                  <List
                    sx={{
                      border: 1,
                      borderRadius: "5px",
                      borderColor: "#CFD2CF",
                    }}
                  >
                    {data.map((item) => {
                      return (
                        <>
                          {item.has_subgroup ? (
                            <>
                              {" "}
                              <ListItem
                              // secondaryAction={<Checkbox onChange={(e)=>handleCategoryCheck(e,item.component_id)}/>}
                              >
                                <ListItemText
                                  disableTypography
                                  sx={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                  }}
                                  primary={item.component_name}
                                />
                              </ListItem>
                              <List>
                                {item.sub_component.map((component) => {
                                  return (
                                    <ListItem
                                      sx={{ paddingLeft: "80px" }}
                                      secondaryAction={
                                        <Checkbox
                                          checked={
                                            maintainChecked.findIndex(
                                              (item) =>
                                                item.component_id ===
                                                component.component_id
                                            ) !== -1
                                          }
                                          onChange={() =>
                                            handleIndividualCheck(
                                              component.component_id,
                                              component.component_name
                                            )
                                          }
                                        ></Checkbox>
                                      }
                                    >
                                      <ListItemText
                                        disableTypography
                                        sx={{
                                          fontSize: "16px",
                                          fontWeight: 600,
                                        }}
                                        primary={component.component_name}
                                      ></ListItemText>
                                    </ListItem>
                                  );
                                })}
                              </List>
                              {/* <Divider /> */}
                            </>
                          ) : (
                            <ListItem
                              secondaryAction={
                                <Checkbox
                                  checked={
                                    maintainChecked.findIndex(
                                      (com) =>
                                        com.component_id === item.component_id
                                    ) !== -1
                                  }
                                  onChange={() =>
                                    handleIndividualCheck(
                                      item.component_id,
                                      item.component_name
                                    )
                                  }
                                />
                              }
                            >
                              <ListItemText
                                disableTypography
                                sx={{ fontSize: "16px", fontWeight: 600 }}
                                primary={item.component_name}
                              ></ListItemText>
                            </ListItem>
                          )}
                          <Divider
                            sx={{ ":last-child": { borderBottom: 0 } }}
                          />
                        </>
                      );
                    })}
                  </List>
                </Box>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              sx={{ ml: 2, mt: 6, color: "white" }}
              size="large"
              type="submit"
            >
              Subscribe
            </Button>
          </form>
        </Container>
      )}
    </div>
  );
};
export default Subscribe;
