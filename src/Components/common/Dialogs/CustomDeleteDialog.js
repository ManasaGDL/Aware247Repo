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
const CustomDeleteDialog = ({ open, id, type, deleteComponent,name }) => {
   
  const [text, setText] = useState("");
  const checkText = (e) => {
    setText(e.target.value);
  };
  const handleClose = () => {
   
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
          <b>Delete {type}</b>
        </DialogTitle>
        <DialogContent>
          WARNING! <b>Deleting a {type} cannot be undone</b>. All associated
          data will be deleted as well. Please be absolutely sure this is what
          you want.
          <br />
          <br />
          <div>
            Type DELETE in the box below for final confirmation, then hit the
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
            permanently delete {type}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CustomDeleteDialog;
