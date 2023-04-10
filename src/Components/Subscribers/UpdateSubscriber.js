import { useState , useEffect , useContext, useRef } from "react";
import { Stack ,Checkbox , FormControlLabel , 
    Grid , List , Box ,ListItem,ListItemText,Divider , Backdrop
} from "@mui/material";
import { useNavigate , useLocation, useParams} from "react-router-dom";
import businessUnitContext from "../../context/businessUnitContext";
import clientApi from "../../api/clientApi";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import useFetch from "../../CustomHooks/useFetch";
import { SnackbarContext } from "../../context/SnackbarContext";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import api from "../../Api";
const UpdateSubscriber = () =>{
    // const [ data ,setData ] = useState([]);
    const bu = useContext(businessUnitContext);
    const [callFetchApi, setCallFetchApi] = useState(false);
    const [ businessUnit , setBusinessUnit ] = useState(bu)
    const prevBu= useRef();
    // const [ loading ,setLoading ] = useState(false);
    const navigate = useNavigate();
    const [ componentStatusList , setComponentStatusList] = useState([])
    const [state, makeApiCall] = useFetch(bu, callFetchApi);
    const { data, loading, error } = state; 
    const [ selectedAllEnabled ,setSelectedAllEnabled ] = useState(false)
   const [ allComponentsList , setAllComponentsList ] = useState([]) // storing components id of all the "components"
    const location = useLocation();
    const { setSnackBarConfig} = useContext(SnackbarContext)
    const [openCustomDialog, setOpenCustomDialog] = useState({ open: false });
    const { id } = useParams();
    const [componentsResponse , setComponentsResponse]=useState(location?.state?.components)
  let componentsArray =[]
 
    useEffect(()=>{
   if(componentsResponse.length>0 )
   {
    setComponentStatusList(componentsResponse.map(obj=>{
      if(obj.sub_component?.length>0)
      {
          return {'component_id':obj.sub_component.component_id,'component_status':obj.sub_component.component_status}
      }
     else return {'component_id':obj.component_id,'component_status':obj.component_status}
  }))
    }
   
    },[])
    useEffect(()=>{
      data?.length > 0 && data?.forEach((item) => {
        if (item.sub_component?.length > 0) {
          item.sub_component.map(subcomponent => {
                componentsArray.push({ 'component_id': subcomponent.component_id})
            })
  
        } else {
            componentsArray.push({ 'component_id': item.component_id })
        }
  
    }
    )
    setAllComponentsList(componentsArray) 
    },[data])
   
    useEffect(()=>{ 
       setBusinessUnit(bu);     
    },[bu])
 useEffect(()=>{
    prevBu.current=businessUnit;
    if(prevBu.current!==bu)
    {
        navigate('/admin/subscribers')
    }
 },[bu])
 useEffect(()=>{
if(selectedAllEnabled)
{
setComponentStatusList([...allComponentsList])
}

 },[selectedAllEnabled])
  //   useEffect(()=>{
  // getComponentList();
  //   },[bu])
    const getComponentList = async() =>{
        try{
            // setLoading(true);
      const res = await clientApi.getComponentStatus(bu);
      // setData(res?.data)
        }catch(e)
        {console.log(e.response)
//    alert(e.response.data.Error)
        }
        finally{
            // setLoading(false)
        }
    }
   const  handleToggle=(component_name, component_id, component_status)=>{
    
       setComponentStatusList(componentStatusList.filter(item=>{
        return item.component_id !== component_id
      }))
    if(componentStatusList.findIndex(item=>{
      return item.component_id === component_id
    })===-1)
    {
      setComponentStatusList([...componentStatusList,
        {
            "component_id": component_id,
            "component_status": component_status
        }])
    }

    }
    const handleSelectAll=(e)=>{
    setSelectedAllEnabled(e.target.checked)
  if(e.target.checked === false)
  setComponentStatusList([])
    }
    const handleUpdateSubscriber=async()=>{
      let updatedComponents=[]
      updatedComponents = componentStatusList.map(item=>{
      return item.component_id;
     })
     try{
   const res =await api.updateSubscriber(id , { "components":updatedComponents});
   navigate("/admin/subscribers")
   setSnackBarConfig({
    open: true,
    message: "Updated Successfully",
    severity: "success",
  });

     }catch(e){
      if (e.response?.data) {
        const errordata = Object.values(e.response.data);

        setOpenCustomDialog({ open: true, message: errordata, title: "Error" });
      }
     }
    }
    const stayOnSamePage = () => {
      setOpenCustomDialog({ open: false, message: "" });
      // window.location.reload(false)
    };
    return <>
    <div style= {{ textAlign : "left"}}>    
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <LoadingPanel></LoadingPanel>
        </Backdrop>   
        {!loading &&<h5 style={{ paddingTop: 20, marginLeft: 20 }}>{"Update Subscriber"}</h5>}
    
     {!loading &&<div style={{ textAlign:"center",paddingBottom:20}}>
        <Box >
        <Stack direction = "row" spacing ='8' alignItems={"flex-start"}
        ml={5} mr={15}
         justifyContent="space-between">
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
                  <FormControlLabel
                        control={
                            <Checkbox
                                  checked={selectedAllEnabled}
                                name="selectall"
                              onChange={handleSelectAll}
                            ></Checkbox>
                        }
                        label="Select All"
                    ></FormControlLabel>

        </Stack>
        <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
        <Grid container justify="flex-start">
              <Grid item md={12}>
                <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
                  <List
                    sx={{
                      border: 1,
                      borderRadius: "5px",
                      borderColor: "#CFD2CF",
                      maxWidth:"900px"
                    }}
                  >
                    {data.map((item) => {
                      return (
                        <>
                          {item.has_subgroup ? (
                            <>
                              {" "}
                              <ListItem key={item.component_id}
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
                                    <ListItem key={component.component_id}
                                      sx={{ paddingLeft: "80px" }}
                                      secondaryAction={
                                        <Checkbox
                                        checked={componentStatusList.length>0 &&
                                        componentStatusList.findIndex(com=>{
                                          return com.component_id === component.component_id
                                        })!== -1?true:false}
                                        onChange={() => {
                                          handleToggle(component["component_name"],component["component_id"], component.component_status.component_status_name);
                                      }}
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
                            <ListItem key={item.component_id}
                              secondaryAction={
                                <Checkbox
                                  checked={
                                    componentStatusList.findIndex(
                                      (com) =>
                                        com.component_id === item.component_id
                                    ) !== -1?true:false
                                  }
                                  onChange={() => {
                                    handleToggle(item["component_name"], item["component_id"], item.component_status.component_status_name);
                                }}
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
            <br/>
            <StyledButton variant="contained" onClick={()=>{
              handleUpdateSubscriber();
            }}>Update Subscriber</StyledButton>
            </Box>
        </div>}
    </div>
    </>
}
 export default UpdateSubscriber;