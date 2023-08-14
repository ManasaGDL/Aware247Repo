import { createTheme } from "@mui/material/styles";
import { cyan, lightBlue } from "@mui/material/colors";
import { blue } from "@material-ui/core/colors";
const theme = createTheme({
  typography: {
    fontSize: 12,
  },
   palette: {
    primary: blue
    //  {main:'#1976d'
    // }
    ,
  //   secondary: {
  //     main:'#11cb5f',
  //     //
  //   },
    action: {
      selected: "#F0F0F0",
      hover: "#F0F0F0",
      // disabled: '#9B9B9B'
  },
    components: {
      MuiToolbar: {
        styleOverrides: {
          dense: {
            height: 32,
            minHeight: 32,
          },
        },
      },
    },
  },
});
export default theme;
