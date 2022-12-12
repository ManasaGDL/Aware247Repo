
import './App.css';
import React,{useState,useEffect} from "react"
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import Login from './Components/Login/Login';
import Container from './Container/Container';
import {useNavigate} from "react-router-dom"

function App(props) {
  const history=useNavigate();
  const [user,setUser] = useState({email:""})
  useEffect(()=>{
  console.log("user is",user)
  },[user])
  return (
    <div className="App">
     <Routes history={history}> 
     <Route path ="/login" element={<Login setUser={setUser} />}/> 
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/*" element={<Container user={user}/>}/>
    </Routes> 
 
    </div>
  );
}

export default App;
