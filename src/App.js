
import './App.css';
import React,{useState,useEffect} from "react"
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import Login from './Components/Login/Login';
import Container from './Container/Container';
import {useNavigate} from "react-router-dom"
import {SnackbarContextProvider} from "./context/SnackbarContext"
function App(props) {
  const history=useNavigate();
  const [user,setUser] = useState({email:""})

  return (
    <div className="App">
      <SnackbarContextProvider>
      <Routes history={history}> 
      <Route path ="/login" element={<Login setUser={setUser} />}/> 
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/*" element={<Container user={user}/>}/>
      </Routes> 
      </SnackbarContextProvider>
    </div>
  );
}

export default App;
