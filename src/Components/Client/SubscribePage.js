import React, { useState, useEffect ,useContext } from "react";
import { useNavigate  } from "react-router-dom";
import {
  AppBar,
  Checkbox,
  Divider,
  FormLabel,
  InputLabel,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import companylogo from "../../assets/data_axle.PNG";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@mui/material/Backdrop";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import bgLogo from "../../assets/body_bg.png";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import FormHelperText from '@mui/material/FormHelperText';
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useParams } from "react-router-dom";
import clientApi from "../../api/clientApi";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import { SnackbarContext } from "../../context/SnackbarContext";
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
const SubscribePage = () => {
  const classes = useStyles();
  const [checkAllChecked, setCheckAllChecked] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(
    "Select Subscription Type"
  );
  const [email, setEmail] = useState("");
  const { businessunit } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState({ firstName: false, lastName: false });
  const [loading, setLoading] = useState(false);
  const [componentsList, setComponentsList] = useState([]);// captures all the components from api response
  const [ maintainChecked , setMaintainChecked ] =useState([])
  const [ subCategoryList ,setSubCategoryList ] = useState([])
  const [categorySpreadArray ,setCategorySpreadArray] = useState([])
  const [networkData, setNetworkData] = useState([])
  const [networkSelected , setNetworkSelected] = useState("")
  const [ phoneNumber , setPhoneNumber ] = useState('')
  const [openCustomDialog , setOpenCustomDialog] = useState({open:false})
  const [ callSubscribeCreateApi , setCallSubscribeCreateApi] =  useState(true)
  const { setSnackBarConfig} = useContext(SnackbarContext)
  
 let componentsArray=[]
 let subCategoryArray = []
 const navigate = useNavigate();
  const handleChange = (e) => {
    setSubscriptionType(e.target.value);
  };
  useEffect(() => {
    if (firstName.length > 0) {
      setCallSubscribeCreateApi(true)
      setError((prev) => {
        return { ...prev, firstName: false };
      });
    }
   if (lastName.length > 0) {
      setCallSubscribeCreateApi(true)
      setError((prev) => {
        return { ...prev, lastName: false };
      });
    }
    if(phoneNumber.length>0)
    {
      setCallSubscribeCreateApi(true)
      setCallSubscribeCreateApi(true)
      setError((prev) => {
        return { ...prev, "phno": false };
      });
    }
    if(subscriptionType!=="Select Subscription Type")
    {
      setCallSubscribeCreateApi(true)
      setError((prev) => {
        return { ...prev, "sub_type": false };
      });
    }
    else setCallSubscribeCreateApi(false)
  }, [firstName, lastName, error.firstName,error.lastName,error.sub_type,subscriptionType,error.phno]);

  useEffect(() => {
    getComponentsList();
    getNetworks();
  }, []);
  useEffect(()=>{
    console.log("CL",componentsList)
  },[componentsList])
  const getNetworks = async() =>{
  try{
  const response = await clientApi.getNetworks();

 setNetworkData(response?.data)
  }catch(e)
  {
  
  }
  }
  const getComponentsList = async () => {
    try {
      setLoading(true);
      const response = await clientApi.getComponentStatus(businessunit);
      console.log("result", response.data);
      setData(response?.data);
      
     (response?.data?.map(item=>{
      subCategoryArray=[];
       if(item.has_subgroup)
        { 
          if(item.sub_component.length>0)
          {
            item.sub_component.map(com=>
              { subCategoryArray.push({"component_id":com.component_id,"component_name":com.component_name})
              componentsArray.push({"component_id":com.component_id,"component_name":com.component_name})
            }
            )
          }
          const newEntry={"id":item.component_id,"subCategory":subCategoryArray,"categoryChecked":false}
          setSubCategoryList(prev=>[...prev,newEntry])// copying category and subcategory  details if any
        }else{
        componentsArray.push({"component_id":item.component_id,"component_name":item.component_name})
        }
        
      }))
      setComponentsList(componentsArray)
      if (response.data.length === 0) {
        alert("check whether Businessunit is valid or not!");
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
//   useEffect(()=>{
// subCategoryList.map(item=>{
//   if(item.categoryChecked)
//   { if(maintainChecked.map( val =>{
//       if(item.subCategory.map(eachItem =>{
//         if(eachItem.component_id !== val.component_id)

//       }))
//   }))
//     // setMaintainChecked(prev=>[...prev,...item.subCategory])
//   }
// })
//   },[subCategoryList])
  useEffect(()=>{
console.log("cjhked",maintainChecked)
console.log("sub",subCategoryList)
  },[maintainChecked,subCategoryList])
  useEffect(()=>{
 if(checkAllChecked)
 setMaintainChecked([...componentsList])
 else
 setMaintainChecked([])
  },[checkAllChecked])

  const handleUpdateSubscribe = () => {
    if (firstName.length === 0) {
      setCallSubscribeCreateApi(false)
      setError((prev) => {
        return { ...prev, firstName: true };
      });
    }
    if (lastName.length === 0) {
      setCallSubscribeCreateApi(false)
      setError((prev) => {
        return { ...prev, lastName: true };
      });
    }
    if(subscriptionType === "Select Subscription Type")
    {setCallSubscribeCreateApi(false)
      setError(prev=>{
        return {...prev,"sub_type":true}})
    }
    if(phoneNumber.length === 0)
    { setCallSubscribeCreateApi(false)
      setError(prev=>{
        return {...prev,"phno":true}
      })
    }
    const components = maintainChecked.map(item=>{
      return item.component_id
    })
    const payload=subscriptionType === "email"?
    {"first_name":firstName,"last_name":lastName,"email":email, "email_delivery": 1,"components":components}
    :{"first_name":firstName,"last_name":lastName,"phone_number":phoneNumber, "sms_delivery": 1,"components":components,"network":networkSelected}
    // callSubscribeCreateApi && callCreateSubscriber(payload);
  };
  const callCreateSubscriber = async(payload) =>{
    try{
     let response;
   
     response = await clientApi.createSubscriber( payload )
     navigate(`/Status/${businessunit}`)
     setSnackBarConfig({open:true,message:'Added successfully, you will receive confirmation email.',severity:"success"})
    //  window.location.reload()
    }catch(e){
  
      if(e.response?.data)
      {
        const errordata=Object.values(e.response.data);
        setOpenCustomDialog({open: true,message:errordata,title:"Error"})
        }
       
        //setOpenCustomDialog({open:true,message})
      }finally{
        // setCallSubscribeCreateApi(false)
      }
    }
  
  const handleCheckbox = (e) => {
    setCheckAllChecked(e.target.checked);
  };
  const handleIndividualCheck = (id, name) => {
    setMaintainChecked(maintainChecked.filter( item=>{
      return (item.component_id !== id)
    }))
    console.log("index",maintainChecked.findIndex(item=>item.component_id === id)===-1)
    if((maintainChecked.findIndex(item=>item.component_id === id)===-1))
    {
     setMaintainChecked([...maintainChecked,{"component_id":id,"component_name":name}])
    }
   
    console.log([id, name]);
  };
  const handleCategoryCheck =(e,id)=>{
    console.log([id,e.target.checked])
    if(e.target.checked) // change categoryChecked to true , if Ctegeory is clicked
     setSubCategoryList(subCategoryList.map(item =>{
      if(item.id === id)
      {
        return {...item,"categoryChecked":true}
      }
      else return {...item};
     }))
     else{
      setSubCategoryList(subCategoryList.map(item =>{
        if(item.id === id)
        {
          return {...item,"categoryChecked":false}
        }
        else return {...item};
      
     }))
    }
  }
  const stayOnSamePage=()=>{
    setOpenCustomDialog({open:false,message:''})
    // window.location.reload(false)
  }
  const handleNetworkDropDown =(e)=>{
   setNetworkSelected(e.target.value)
  }
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
        <>
        <CustomDialogs open ={openCustomDialog.open} message={openCustomDialog.message}
                title={openCustomDialog.title} setOpenCustomDialog={setOpenCustomDialog} hideButton={true}
                handleConfirmation={stayOnSamePage}
                />
          <Container maxWidth="sm" sx={{ marginTop: "120px" }}>
            <Box width={"800px"}>
              <Stack
                sx={{
                  // margin: "auto",
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "50%",
                }}
              >
                <FormControl>
                  <TextField
                    label="FirstName"
                    required
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                    error={error.firstName}
                  ></TextField>
                </FormControl>
                <br />
                <FormControl>
                  <TextField
                    label="LastName"
                    required
                    onChange={(e) => setLastName(e.target.value)}
                    error={error.lastName}
                  ></TextField>
                </FormControl>
                <br />
                <FormControl>
                  <InputLabel>Subscription Type*</InputLabel>
                  <Select required
                    label="Subscription Type *"
                    onChange={handleChange}
                    sx={{ minWidth: "300px" }}
                  >
                    <MenuItem value="Select Subsription Type">
                      Select Subscription Type
                    </MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                  </Select>
                  <FormHelperText sx={{ color : "red"}}>{error.sub_type?"This field is required":""}</FormHelperText>
                  <br />
                </FormControl>
                {subscriptionType === "email" && (
                  <FormControl>
                    <TextField
                      required
                      type="email"
                      value={email || ""}
                      name="email"
                      label=" Email Addess"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    ></TextField>
                    <label style={{ fontSize: 10, color: "grey" }}>
                      This email address will be subscribed to future
                      notifications
                    </label>
                  </FormControl>
                )}
                <br />
                {subscriptionType === "sms" && (
                  <FormControl>
                    <TextField label="Phone" required onChange = {e=>setPhoneNumber(e.target.value)}
                    error={error.phno}/>
                    <br />
                    <FormControl />
                    <FormControl>
                      <InputLabel>Select Network</InputLabel>
                      <Select label="Select Network" onChange={handleNetworkDropDown} value={networkSelected}>
                        {networkData.map((item)=>{
                          return <MenuItem value={item}>{item}</MenuItem>
                          })}
                      </Select>
                      <label style={{ fontSize: 10, color: "grey" }}>
                        This Phone number will be subscribed to future
                        notifications
                      </label>
                    </FormControl>
                  </FormControl>
                )}
                <br />
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      textAlign: "center",
                      marginTop: "10px",
                    }}
                  >
                    Alert Users Subscribed To
                  </label>
                  &nbsp; &nbsp;
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checkAllChecked}
                        onChange={handleCheckbox}
                      ></Checkbox>
                    }
                    label="Check All"
                  ></FormControlLabel>
                </Box>
                {/* <Divider /> */}
              </Stack>
            </Box>
          </Container>
          <Box sx={{ width: "1000px", margin: "0 auto" }}>
            <List
              sx={{ border: 1, borderRadius: "5px", borderColor: "#CFD2CF" }}
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
                              fontWeight: "bold",
                              //   color: "rgb(101, 101, 101)",
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
                                    checked={(maintainChecked.findIndex(item=> item.component_id === component.component_id))!==-1}
                                    onChange={()=>handleIndividualCheck(
                                      component.component_id,
                                      component.component_name
                                    )}
                                  ></Checkbox>
                                }
                              >
                                <ListItemText
                                  disableTypography
                                  sx={{ fontSize: "16px", fontWeight: 600 }}
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
                              checked={(maintainChecked.findIndex(com=> com.component_id ===item.component_id))!==-1}
                              onChange={()=>handleIndividualCheck(
                                item.component_id,
                                item.component_name
                              )}
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
                  sx={{":last-child":{'borderBottom':0}}}
                  />
                  </>
                );
              })}
            </List>
          </Box>
          <Button
            variant="contained"
            sx={{ ml: 2, mt: 6, color: "white" }}
            size="large"
            onClick={handleUpdateSubscribe}
          >
            Subscribe
          </Button>
        </>
      )}
    </div>
  );
};
export default SubscribePage;
