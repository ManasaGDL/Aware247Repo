import { useContext , useEffect , useState} from "react";
import { useParams , useNavigate} from "react-router-dom";
import { SnackbarContext } from "../../context/SnackbarContext";
import clientApi from "../../api/clientApi";
import BasicHeader from "../common/BasicHeader";
import CustomDialogs from "../common/Dialogs/CustomDialogs";

const UnsubscribeUser = () =>{
  const { setSnackBarConfig } = useContext(SnackbarContext);
  const { businessunit } = useParams();
  const [openCustomDialog , setOpenCustomDialog] = useState({open:false})
  const token = useParams()["*"];
  const navigate= useNavigate();
  useEffect(()=>{
if(token.length>0)
{
    callUnSubscribe();
}
  },[])
  const callUnSubscribe = async() =>{
    try{

const res= await clientApi.deleteSubscriber(
  token,businessunit
)
if(res.status===200)
setOpenCustomDialog({open:true, message:"Unsubscribed Successfully",title:"Success",hideActionButtons:false})
// setSnackBarConfig({
//     open: true,
//     message: "Subscriber Unsubscribed Successfully",
//     severity: "success",
//   });

    }catch(e)
    {
        if (e?.response?.status === 400) {
      
           
            setOpenCustomDialog({open:true, message:e.response.data.Error, title:"Error",hideActionButtons:false})
        }
        }
    
  }
  const redirect =()=>{
   navigate(`/Status/${businessunit}`)
  }
    return  <div className="status">
        <BasicHeader/>
        <CustomDialogs
            open={openCustomDialog.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
             handleConfirmation={redirect}
            hideActionButtons={setOpenCustomDialog.hideActionButtons}
          />
        </div>
}
export default UnsubscribeUser;