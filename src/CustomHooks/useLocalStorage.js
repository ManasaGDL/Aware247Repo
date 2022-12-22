import { useState } from "react";
function getStorageValues(key, defaultVal)
{ let value;
    if(key==="Profile")
{
  value = JSON.parse(localStorage.getItem("Profile"))
}
 else   value = localStorage.getItem(key)
 return value||defaultVal;
}
const useLocalStorage =(key,defaultVal)=>{
    const [value,setValue] = useState(()=>{
        return getStorageValues(key,defaultVal)
    });
    // useEffect(()=>{
    // if(key==="Profile")
    // {
    //     localStorage.setItem("Profile",JSON.stringify(value))
    // }
    // else localStorage.setItem(key,value)

    // },[key,value])
    return [value,setValue]
}
export default useLocalStorage;