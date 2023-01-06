import { createTheme } from "@mui/material/styles";
import { cyan } from "@mui/material/colors";
const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    primary: cyan
    // {main:'#80daeb'}
    ,
    secondary: {
      main:'#11cb5f',
      //
    },
    action: {
      selected: "#80daeb",
       hover: "#80daeb",
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
