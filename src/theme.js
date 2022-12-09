import { createTheme, ThemeProvider } from '@mui/material/styles';
import {cyan,blue} from '@mui/material/colors';
const theme = createTheme({
 typography:{
fontSize:12,

 },
    palette: {
      primary: cyan,
      secondary:{
        main: '#00e5ff'
        //
      },
     
  components: {
    MuiToolbar: {
        styleOverrides: {
            dense: {
                height: 32,
                minHeight: 32
            }
        }
    },
    MuiListItemText:{
        styleOverrides:{
          root:{
            color:"red"
          }
        }
    }
  }}});
  export default theme;