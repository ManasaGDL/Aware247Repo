import { useReducer } from "react";
import { useEffect , useState } from "react"
import api from "../Api";
import clientApi from "../api/clientApi";
const initialState = {
    data:[],
    loading:false,
    error:null
}
const ACTIONS = {
    API_REQUEST : "api-request",
    FETCH_DATA : "fetch-data",
    ERROR :"error"
}
const reducer = (state , {type , payload}) =>{
switch(type){
    case ACTIONS.API_REQUEST : 
    return { ... state , data :[],loading:true};
    case ACTIONS.FETCH_DATA :
        {
            return {...state,data:payload,loading:false}}
        case ACTIONS.ERROR:
            return { ...state , data:[],error:payload };
            default:
                return state;

}}
        const useFetch = (bu , readBusinessUnitFromUrl=false) => {
        //readBusinessUNitFromUrl picks BU from url instead from localStorage
    const [state , dispatch ] = useReducer(reducer , initialState);
const makeApiCall = () =>{
 
    dispatch({ type :ACTIONS.API_REQUEST});
    if(readBusinessUnitFromUrl)
    {
   clientApi.getComponentStatus(bu).then(res =>{ dispatch({ type :ACTIONS.FETCH_DATA, payload:res.data})}).catch((e)=>dispatch({ type:ACTIONS.ERROR,payload:e.response.data}))
    }
  else  api.getComponents().then(res =>{ dispatch({ type :ACTIONS.FETCH_DATA, payload:res.data})}).catch((e)=>dispatch({ type:ACTIONS.ERROR,payload:e.response.data}))
}
    useEffect(()=>{
      makeApiCall();
    },[bu ])
//     useEffect(()=>{
// if(callFetchApi)
// {alert("in useE")
//     dispatch({ type :ACTIONS.API_REQUEST});
//     api.getComponents().then(res =>{
     
//       dispatch({ type :ACTIONS.FETCH_DATA, payload:res.data})}).catch((e)=>dispatch({ type:ACTIONS.ERROR,payload:e.response.data}))
// }
//     },[callFetchApi])
  return [state,makeApiCall];
};
export default useFetch;
