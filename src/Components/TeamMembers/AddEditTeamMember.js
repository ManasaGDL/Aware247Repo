import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Box, Button , CircularProgress} from "@mui/material";

const AddEditTeamMember = ({
  open,
  action,
  openDialog,
  setOpenDialog,
  createUser,
  setUserDetails,
  userDetails,
  error,
  setError,
  actionProgress
}) => {
  const reg_ph= /^\d{10}$/;

  let regex_email = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i; 
  return (
    <Dialog open={openDialog.open} onClose={() => {
    
        setOpenDialog({ open: false })}}>
      <DialogTitle>{openDialog?.action} Team Member</DialogTitle>
      <DialogContent style={{ width: "350px" }}>
        <Box sx={{ textAlign: "center", margin: 2 }}>
          <TextField
            name="first_name"
            fullWidth
            label="FirstName"
            value={userDetails?.first_name}
            onChange={(e) => {
           setError(prev=>({...prev,"first_name":''}));
              setUserDetails(prev=>({...prev,"first_name":e.target.value}));
            }}
          ></TextField>
          {<div style={{ color: "red" }}>{error?.first_name}</div>}
         
          &nbsp;
          <TextField
            name="last_name"
            fullWidth
            label="LastName"
            value={userDetails?.last_name}
            onChange={(e) => {
              
                setUserDetails(prev=>({...prev,"last_name":e.target.value}));
            }}
          ></TextField>
             &nbsp;
          <TextField
            name="email"
            fullWidth
            label="Email"
            type="email"
            value={userDetails?.email}
            onChange={(e) => {
              setError(prev=>({...prev,"email":''}));
              if(!regex_email.test(e.target.value))
              {
              setError(prev=>({...prev,"email":"Email not valid"}))
              }
           else
           setError(prev=>({...prev,"email":''}));
              setUserDetails(prev=>({...prev,"email":e.target.value}));
            }}
          ></TextField>
           {<div style={{ color: "red" }}>{error?.email}</div>}
          &nbsp;
          <TextField
            name="phone_number"
            fullWidth
            label="phonenumber"
            type="number"
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
               display: "none",
             },
             "& input[type=number]": {
               MozAppearance: "textfield",
             },
             }}
            value={userDetails?.phone_number}
            onChange={(e) => {
              setError(prev=>({...prev,"phone_number":''}));
              if(!reg_ph.test(e.target.value))
              {
                setError(prev=>({...prev,"phone_number":"Enter valid phonenumber"}))
              }
            setUserDetails(prev=>({...prev,"phone_number":e.target.value}));
          
            }}
          ></TextField>
           {<div style={{ color: "red" }}>{error?.phone_number}</div>}
             &nbsp;
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          sx={{ color: "white", fontWeight: "600" }}
          onClick={() => {
            if(userDetails?.first_name?.length<=0)
            {
                setError(prev=>({...prev,"first_name":"Name required"}))
            }
            if(userDetails?.email.length<=0 )
            {
                setError(prev=>({...prev,"email":"Email required"}))
            }
            // if(userDetails?.password.length>0 )
            // {
            //     setError(prev=>({...prev,"password":"Password required"}))
            // }
            createUser(userDetails);
          }}
        > {actionProgress && <CircularProgress  sx={{marginLeft:0,color:"white",fontWeight:10}} size={20}/>}
        &nbsp;  &nbsp;
          {openDialog.action} TeamMember
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddEditTeamMember;
