
import './App.css';
import React,{useState,useEffect , useContext} from "react"
import { BrowserRouter as Router, Routes, Route ,Navigate, useLocation} from "react-router-dom"
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
import TeamMembers from './Components/TeamMembers/TeamMembers';
import ViewScheduleMaintenance from './Components/Incidents/ViewScheduleMaintenance';
import CreateScheduleMaintenance from './Components/Incidents/CreateScheduleMaintenance';
import MainActionPage from './Components/Incidents/MainActionPage';
import IncidentPage from './Components/Incidents/IncidentPage';
import UpdateSubscriber from './Components/Subscribers/UpdateSubscriber';
import AddSubscriber from './Components/Subscribers/AddSubscriber';
import Component from './Components/ComponentPage/Component';
import Subscribers from './Components/Subscribers/Subscribers';
import Security from './Components/Security/Security';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import api from './Api';
function App(props) {
  const navigate=useNavigate();
  const [user,setUser] = useState({email:""})
  const location = useLocation()
  const [ bu ,setBu]= useState(localStorage.getItem("BU"))
 const [ loggedInUser , setLoggedInUser]= useState(localStorage.getItem("access_token")?true:false)
 useEffect(()=>{
document.title = "Aware247"
if(localStorage.getItem('access_token'))
{
  setLoggedInUser(true)
}
else
setLoggedInUser(false)
getLoggedIn();
 },[])

const getLoggedIn= async()=>{
  try{
  const access_token= localStorage.getItem("access_token");
  if(access_token)
  {
    const userResponse = await api.getUserProfile();
    const businessUnit = userResponse?.data?.Profile?.last_businessiunit_name
    localStorage.setItem("Privileges", userResponse?.data?.Privileges)
    localStorage.setItem("Profile", JSON.stringify(userResponse?.data?.Profile))
    localStorage.setItem("BU", businessUnit);
    setUser({"first_name":userResponse?.data?.Profile?.first_name,"last_name":userResponse?.data?.Profile?.last_name,"email":userResponse?.data?.Profile?.email})
  if(!location.pathname.includes("Status"))
    navigate("/admin/dashboard")
  }
  }catch(e)
  {

  }
}
  return (
    <div className="App">
      <ThemeProvider theme = {theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>

      <SnackbarContextProvider>
              <businessUnitContext.Provider value={[bu,setBu]}>   
      <Routes history={navigate}> 
      <Route path="/setPassword/*" element={<ForgotPassword/>}/>
      <Route path ="Status" >
        <Route path=":businessunit/manage/*"element={<ManageSubscriber/>}/>
        <Route path = ":businessunit/unsubscribe/*" element={<UnsubscribeUser/>}/>
        <Route path = ":businessunit" element ={<StatusPage/>}/>
        <Route path ="add/:businessunit" element ={<Subscribe />}/>
        <Route path="*" element= {<div>No Page</div>}/>
      </Route> 
      <Route 
      // path="admin"  
      element={<Container user={user} setLoggedInUser={setLoggedInUser}/>}> 
                                              
                        <Route path="admin/security" element={<Security />}/>
                        <Route path="admin/dashboard" element={<DashBoard bu={bu}/>} />
                        <Route path="admin/teammembers" element={<TeamMembers/>}/>
                        <Route path="admin/viewScheduleMaintenance/:id" element={<ViewScheduleMaintenance/>}/>
                        <Route path="admin/scheduled/:action" element={<CreateScheduleMaintenance/>}/>
                        <Route path="admin/scheduled/:action/:id" element={<CreateScheduleMaintenance/>}/>
                        <Route path="admin/create_incident" element={<MainActionPage bu={bu} />} />
                        <Route path="admin/create_incident/:action/:id" element={<MainActionPage bu={bu}/>}/>
                        <Route path="admin/incidents" element={<IncidentPage bu={bu} />} />
                        <Route path="admin/subscribers/manage/:id" element={<UpdateSubscriber/>}/>
                        <Route path="admin/subscribers/addSubscriber" element={<AddSubscriber/>}/>
                        <Route path="admin/subscribers" element={<Subscribers />} />
                        <Route path="admin/components" element ={<Component/>}/>   
                        {/* <Route path="*" element={<div></div>}></Route>                */}

         </Route> 
         {/* {loggedInUser && <Route path="*" element={<h3>URL does not exists.</h3>} />} */}
      {!loggedInUser ?<Route path="/login" element={<Login setUser={setUser} />}/>:<Route path="/login" element={<Container setUser={setUser} setLoggedInUser={setLoggedInUser} />}/>}   
      {!loggedInUser ?<Route path="/admin" element={<Login setUser={setUser} />}/>:<Route path="/admin" element={<Container setUser={setUser} setLoggedInUser={setLoggedInUser}/>}/>}
      {!loggedInUser?<Route path ="admin/login" element={<Login setUser={setUser} />}/>:<Route path="admin/login" element={<Container setUser={setUser} setLoggedInUser={setLoggedInUser} />}/>}
     
      {!loggedInUser && <Route path="/" element={<Navigate to="admin/login"/>}/>}
      {/* // :<Route path="/login" element={<Container setUser={setUser} />}/>} */}
     
      {/* <Route path="*" element={<Container user={user}/>}/> */}
      </Routes> 
      </businessUnitContext.Provider>
      </SnackbarContextProvider>
      
      </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
