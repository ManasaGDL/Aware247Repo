import { useState , useEffect , useContext , useRef } from "react";
import { Stack ,Checkbox , FormControlLabel , 
    Grid , List , Box ,ListItem,ListItemText,Divider , Backdrop
} from "@mui/material";
import { useNavigate , useLocation, useParams} from "react-router-dom";

import BasicHeader from "../common/BasicHeader";
import { StyledButton } from "../../CustomStyles/StyledComponents";
import LoadingPanel from "../common/TabPanel/LoadingPanel";
import { SnackbarContext } from "../../context/SnackbarContext";
import useFetch from "../../CustomHooks/useFetch";
import clientApi from "../../api/clientApi";
const ManageSubscriber =()=>{
   const { businessunit  } = useParams(); 
   const token = useParams()["*"]; 
   const [ selectedAllEnabled ,setSelectedAllEnabled ] = useState(false)
   const [ allComponentsList , setAllComponentsList] = useState([]);
    const [componentStatusList,setComponentStatusList] = useState([])
   const [state , makeApiCall]=useFetch(businessunit,true);// second argument allows to read BU from Url instead of reading from loacal storage
   // This component gets rendered once we click manage link in the Email that recieved when user subscribes
   const { data, loading, error } = state;
   let componentsArray =[]
   useEffect(()=>{
    makeApiCall();
    getSubscriberComponents(); 
   },[])
   useEffect(()=>{
    data?.length > 0 && data?.forEach((item) => {
      if (item.sub_component?.length > 0) {
        item.sub_component.map(subcomponent => {
              componentsArray.push(subcomponent.component_id)
          })

      } else {
          componentsArray.push( item.component_id )
      }

  }
  )
  setAllComponentsList(componentsArray) 
  },[data])
  useEffect(()=>{
    if(selectedAllEnabled)
    {
    setComponentStatusList([...allComponentsList])
    }
    
     },[selectedAllEnabled])
  useEffect(()=>{
console.log("ACL",allComponentsList,componentStatusList)
  },[allComponentsList,componentStatusList])
  const handleSelectAll=(e)=>{
    setSelectedAllEnabled(e.target.checked)
  if(e.target.checked === false)
  setComponentStatusList([])
    }
 const getSubscriberComponents = async()=>{
try{
 const response = await clientApi.getSubscriberComponents(token , businessunit);
 setComponentStatusList(response?.data[0].component_id);//already subscribed compnentList
}catch(e)
{ if(e?.response?.status === 400)
alert(e.response.data.Error)
}
}
const  handleToggle=(component_name, component_id, component_status)=>{
    
    setComponentStatusList(componentStatusList.filter(item=>{
     return item!== component_id
   }))
 if(componentStatusList.findIndex(item=>{
   return item === component_id
 })===-1)
 {
   setComponentStatusList([...componentStatusList,component_id]

     )
 }

 }
 const handleUpdateSubscriber = async() =>{
 try{
 const res= await clientApi.updateSubscriber({"user_token":token,
 "components":componentStatusList
})
 }catch(e)
 {

 }
 }
     return <div className="status">
      <BasicHeader/>
      <div style= {{ textAlign : "left", marginTop:"80px"}}>    
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <LoadingPanel></LoadingPanel>
        </Backdrop>   

  
     {!loading &&<div style={{ textAlign:"center",paddingBottom:20}}>
        
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
        {/* <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          /> */}
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
                              <ListItem key={item.component_id}
                              // secondaryAction={<Checkbox onChange={(e)=>handleCategoryCheck(e,item.component_id)}/>}
                              >
                                <ListItemText
                                  disableTypography
                                  sx={{
                                    fontSize: "14px",
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
                                          return com === component.component_id
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
                                        com === item.component_id
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
            }}>Update </StyledButton>
            <div>To unsubscribe globally please click on the <a href="#">Unsubscribe</a></div>
        </div>}
    </div>
    </div>
}
export default ManageSubscriber;