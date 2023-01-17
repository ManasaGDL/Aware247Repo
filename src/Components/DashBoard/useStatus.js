import { useState , useEffect } from "react";
import statuses from "./statuses";

export default (labels) =>{
    const [status,setStatus] = useState();

    useEffect(()=>{
    setStatus(Object.values(statuses).find(status=>{
       
    return status.name===labels

    }
    )
    )
    },[labels])

    return [status]
}
