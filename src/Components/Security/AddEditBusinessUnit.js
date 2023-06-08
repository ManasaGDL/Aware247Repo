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
    <Dialog open={open} onClose={() => setOpenDialog({ open: false })}>
      <DialogTitle>{openDialog.action} Business Unit</DialogTitle>
      <DialogContent style={{ height: "120px", width: "350px" }}>
        <Box sx={{ textAlign: "center", margin: 2 }}>
          <TextField
            name="new_bussinessunit"
            fullWidth
            label="BussinessUnit"
            value={businessunitvalue}
            onChange={(e) => {
              setError({ businessunit_name: "" });
              setbusinessunitvalue(e.target.value);
            }}
          ></TextField>
          {<div style={{ color: "red" }}>{error.businessunit_name}</div>}
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
          {openDialog.action} BusinessUnit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddEditBusinessUnit;
