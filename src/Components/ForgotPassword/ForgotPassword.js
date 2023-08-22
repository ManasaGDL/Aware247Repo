import { useState, useEffect, useContext} from "react"
import { useParams , useNavigate} from "react-router-dom"
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Box, Button , CircularProgress} from "@mui/material";
import api from "../../Api";
import CustomDialogs from "../common/Dialogs/CustomDialogs";
import { SnackbarContext } from "../../context/SnackbarContext";
const ForgotPassword =() =>{
    const token = useParams()["*"];
    const [ openDialog, setOpenDialog]=useState({open:true})
    const [ password , setPassword] = useState('');
    const [ confirmPassword, setConfirmPassword]= useState('')
    const [ error , setError]= useState({})
    const [ actionProgress , setActionProgress]= useState(false)
    const [ openCustomDialog , setOpenCustomDialog]= useState({open:false})
    const { setSnackBarConfig} = useContext(SnackbarContext);
   const navigate = useNavigate();
    const callResetPassword = async(payload)=>{
        try{
            
   const res = await api.resetPassword(payload)
   setActionProgress(false)
   if(res?.status===200)
   {
     setSnackBarConfig({open:true,message:"Password successfully reset!",severity:"success"})
     navigate("/login")
   }
        }catch(e)
        {
             if(e.response?.data) 
             {
                const errordata = Object.values(e.response.data);
                
                setOpenCustomDialog({ open: true, message: errordata, title: "Error" });
        }
    }

}
const stayOnSamePage=()=>{
    setOpenCustomDialog({open:false})
}
    return <div>  
    <Dialog open={openDialog.open} onClose={() => {
    
        setOpenDialog({ open: false })}}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent style={{ width: "350px" }}>
        <Box sx={{ textAlign: "center", margin: 2 }}>
          <TextField
            name="new_password"
            fullWidth
            label="New Password"
            value={password}
            onChange={(e) => {
                setError(prev=>({...prev,"password":''}))
             setPassword(e.target.value);
            }}
          ></TextField>
         
         {<div style={{ color: "red" }}>{error?.password}</div>}
         
          &nbsp;
          <TextField
            name="confirm_password"
            fullWidth
            label="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
           setError(prev=>({...prev,"confirm_password":''}))
               setConfirmPassword(e.target.value)
               if(e.target.value!=password)
               {
             setError(prev=>({...prev,"confirm_password":"Passwords didn't match"}))
               }
            }}
          ></TextField>
             &nbsp;
          
           {<div style={{ color: "red" }}>{error?.confirm_password}</div>}
          &nbsp;
          
           
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          sx={{ color: "white", fontWeight: "600" }}
          onClick={() => {
            setActionProgress(true)
           if(password!==confirmPassword)
           {
            setError(prev=>({...prev, password:"Passwords didn't match"}))
           }
          else{
            setError({password:'','confirm_password':''})
          callResetPassword({'token':token,"password":password})
        }
       
          }}
        > {actionProgress && <CircularProgress  sx={{marginLeft:0,color:"white",fontWeight:10}} size={20}/>}
        &nbsp;  &nbsp;
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
    <CustomDialogs
            open={openCustomDialog?.open}
            message={openCustomDialog.message}
            title={openCustomDialog.title}
            setOpenCustomDialog={setOpenCustomDialog}
            hideButton={true}
            handleConfirmation={stayOnSamePage}
          />
    </div> 
}
export default ForgotPassword