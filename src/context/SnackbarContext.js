
import React,{ useState , createContext,useMemo } from "react";
import SnackBar from "../Components/common/SnackBar";

const SnackbarContext = createContext({snackBarConfig : {},setSnackBarConfig:()=>{}})

const SnackbarContextProvider = ({children}) => {
    const [snackBarConfig , setSnackBarConfig] = useState({open:false,message:'',severity:'success'})
    const value = useMemo(() => ({snackBarConfig, setSnackBarConfig }), [snackBarConfig]);
return (
    <SnackbarContext.Provider value={value}>
        <SnackBar open ={ snackBarConfig.open}
        message={snackBarConfig?.message}
            severity={snackBarConfig.severity}
            onClose={()=>setSnackBarConfig({...snackBarConfig,open:false})}
            >
        </SnackBar>
        {children}
    </SnackbarContext.Provider>
)
}
export {
    SnackbarContext, 
    SnackbarContextProvider
}