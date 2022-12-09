
import './App.css';
import { BrowserRouter as Router, Routes, Route ,Navigate} from "react-router-dom"
import Login from './Components/Login/Login';
import Container from './Container/Container';
import {useNavigate} from "react-router-dom"

function App(props) {
  const history=useNavigate();
  return (
    <div className="App">
     <Routes history={history}> 
     <Route path ="/login" element={<Login/>}/> 
      <Route path="/" element={<Navigate to="/login"/>}/>
      <Route path="/*" element={<Container/>}/>
    </Routes> 
 
    </div>
  );
}

export default App;
