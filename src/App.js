
import './App.css';
import React,{useState,useEffect , useContext} from "react"
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import Login from './Components/Login/Login';
import Container from './Container/Container';
import {useNavigate} from "react-router-dom"
import {SnackbarContextProvider} from "./context/SnackbarContext"
import businessUnitContext from './context/businessUnitContext';
import StatusPage from './Components/Client/StatusPage';
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme';
import Subscribe from './Components/Client/Subscribe';
import ManageSubscriber from './Components/Manage/ManageSubscriber';
import UnsubscribeUser from './Components/Manage/UnsubscribeUser';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DashBoard from './Components/DashBoard/Dashboard';
import api from './Api';
function App(props) {
  const history=useNavigate();
  const [user,setUser] = useState({email:""})
  const [ bu ,setBu]= useState(localStorage.getItem("BU"))
 useEffect(()=>{
document.title = "Status App"
 },[])
//   useEffect(async()=>{

//   const timer = setInterval(async() => {
//     const res= await api.getToken();
//     console.log(res)
//     localStorage.setItem("access_token",res?.data?.token)
//     console.log("RES",res?.data)
//   },1200000);
//   return () => clearInterval(timer);
//  },[])


  return (
    <div className="App">
      <ThemeProvider theme = {theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <businessUnitContext.Provider value={[bu,setBu]}>
      <SnackbarContextProvider>     
      <Routes history={history}> 
      <Route path ="Status" >
        <Route path=":businessunit/manage/*"element={<ManageSubscriber/>}/>
        <Route path = ":businessunit/unsubscribe/*" element={<UnsubscribeUser/>}/>
        <Route path = ":businessunit" element ={<StatusPage/>}/>
        <Route path ="add/:businessunit" element ={<Subscribe />}/>
        <Route path="*" element= {<div>No Page</div>}/>
      </Route> 
      <Route path="/login/*" element={<DashBoard/>}/>
      <Route path ="admin/login" element={<Login setUser={setUser} />}/>
      <Route path="/" element={<Navigate to="admin/login"/>}/>
      <Route path="*" element={<Container user={user}/>}/>
      
      </Routes> 
      </SnackbarContextProvider>
      </businessUnitContext.Provider>
   </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
