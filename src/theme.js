import { createTheme } from "@mui/material/styles";
import { cyan } from "@mui/material/colors";
const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    primary: cyan,
    secondary: {
      main:'#11cb5f',
      //
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
