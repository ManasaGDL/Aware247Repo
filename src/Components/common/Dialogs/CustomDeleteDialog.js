import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { StyledButton } from "../../../CustomStyles/StyledComponents";
import CircularProgress from "@mui/material/CircularProgress";
const CustomDeleteDialog = ({ open, id, type, deleteComponent,name,actionProgress=false ,action="Deleting"}) => {
   
  const [text, setText] = useState("");
  const checkText = (e) => {
    setText(e.target.value);
  };
  const handleClose = () => {
   setText('')
    deleteComponent({ open: false,type:type });
  };
  const handleDelete = () => {
    setText("");
    deleteComponent({ id: id, open: false ,name:name,type:type});
  };
  return (
    <Box textAlign={"center"}>
      <Dialog open={open} onClose={()=>handleClose()}>
        <DialogTitle>
          <b>{action} {type}</b>
        </DialogTitle>
        <DialogContent>
          WARNING! <b>{action} a {type} cannot be undone</b>. All associated
          data will be deleted as well. Please be absolutely sure this is what
          you want.
          <br />
          <br />
          <div>
            Type <b>DELETE</b> in the box below for final confirmation, then hit the
            delete button.
          </div>
          <br />
          <br />
          <TextField
            type="text"
            sx={{ width: "400px" }}
            onChange={checkText}
            value={text}
          />
        
        </DialogContent>
        <DialogActions sx={{ textAlign: "center" }}>
         <StyledButton
            variant="contained"
            color="error"
            disabled={text !== "DELETE"}
            onClick={()=>handleDelete()}
          >
            {actionProgress && <CircularProgress size={20} sx={{color:"white"}}/>}
            permanently {action} {type}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CustomDeleteDialog;
