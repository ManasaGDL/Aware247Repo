import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle'
import  Button  from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CustomDialogs =({open=false,message,title,hideActionButtons=false,setOpenCustomDialog,handleConfirmation,hideButton=false}) =>{
    const navigate = useNavigate();
    return <Dialog open={open}>
        <DialogTitle>
           <h4> {title} </h4>
        </DialogTitle>
        <DialogContent>
           {message}
        </DialogContent>
        {!hideActionButtons && <DialogActions>
      {hideButton?<Button variant = "contained" color="error" onClick={handleConfirmation}>OK</Button>:<><Button variant="contained" color="error" 
         onClick={e=>handleConfirmation()}
        >Yes</Button>
         <Button variant="contained" color="success" 
         onClick={(e)=>{
            setOpenCustomDialog({flag:false,message:'',title:''})
            navigate("/admin/incidents/")
         }}
        >No</Button></>}
        </DialogActions>}
    </Dialog>
}
export default CustomDialogs;