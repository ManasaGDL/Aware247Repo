
import './App.css';
import React,{useState,useEffect} from "react"
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import Login from './Components/Login/Login';
import Container from './Container/Container';
import {useNavigate} from "react-router-dom"
import {SnackbarContextProvider} from "./context/SnackbarContext"
import StatusPage from './Components/Client/StatusPage';
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme';
import Subscribe from './Components/Client/Subscribe';
import ManageSubscriber from './Components/Manage/ManageSubscriber';
import UnsubscribeUser from './Components/Manage/UnsubscribeUser';

function App(props) {
  const history=useNavigate();
  const [user,setUser] = useState({email:""})
 useEffect(()=>{
document.title = "Status App"
 },[])
  return (
    <div className="App">
      <ThemeProvider theme = {theme}>
      <SnackbarContextProvider>
     
      <Routes history={history}> 
      <Route path ="Status" >
        <Route path=":businessunit/manage/*"element={<ManageSubscriber/>}/>
        <Route path = ":businessunit/unsubscribe/*" element={<UnsubscribeUser/>}/>
        <Route path = ":businessunit" element ={<StatusPage/>}/>
        <Route path ="add/:businessunit" element ={<Subscribe />}/>
        <Route path="*" element= {<div>No Page</div>}/>
      </Route> 
      <Route path ="login" element={<Login setUser={setUser} />}/>
      <Route path="/" element={<Navigate to="login"/>}/>
      <Route path="*" element={<Container user={user}/>}/>
      
      </Routes> 
      </SnackbarContextProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
