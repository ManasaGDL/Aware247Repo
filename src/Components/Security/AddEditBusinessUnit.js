import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField, Box, Button } from "@mui/material";

const AddEditBusinessUnit = ({
  open,
  openDialog,
  setOpenDialog,
  createBusinessUnit,
  businessunitvalue,
  setbusinessunitvalue,
  error,
  setError,
}) => {
  return (
    <Dialog open={open} onClose={() =>{
  
    setOpenDialog({ open: false })
   
}}>
      <DialogTitle>{openDialog.action} Company</DialogTitle>
      <DialogContent style={{ height: "120px", width: "350px" }}>
        <Box sx={{ textAlign: "center", margin: 2 }}>
          <TextField
            name="new_bussinessunit"
            fullWidth
            label="Company"
            value={businessunitvalue}
            onChange={(e) => {
              setError({ businessunit_name: "" });
              if(/^[A-Za-z0-9()_]*$/.test(e.target.value))
              setbusinessunitvalue(e.target.value);
              else setError({businessunit_name:"Naming constraint not matched!"})
            }}
          ></TextField>
          <label style={{ color:"grey",fontSize:"12px"}}>Only alphanumeric, () and underscore allowed</label>
          {<div style={{ color: "red" ,fontSize:"14px"}}>{error.businessunit_name}</div>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          sx={{ color: "white", fontWeight: "600" }}
          onClick={() => {
            createBusinessUnit(businessunitvalue);
          }}
        >
          {openDialog.action} Company
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddEditBusinessUnit;
