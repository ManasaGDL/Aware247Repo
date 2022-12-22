import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SnackBar = ({ open, onClose, message, severity }) => {
  return (
    <Snackbar
      sx={{ zIndex: 99999 , mt:8 }}
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
Snackbar.defaultProps = {
  severity: "success",
};
export default SnackBar;
