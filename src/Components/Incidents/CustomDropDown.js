import React, { useState , useEffect} from "react"
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
const CustomDropDown=({value,label,disabled,dropDownChange,name,selectAllChecked=false})=>{
 const [selectedValue,setSelectedValue]= useState(value)
 const [dropDownCalled,setDropDownCalled] =useState(false)
 
useEffect(()=>{
if( !disabled && !dropDownCalled && !selectAllChecked)  //send defaultvalue from dropdown if dropdwon in unchanged
{ 
  dropDownChange({"component_id":label,"component_status":value,"name":name})

}
},[disabled])
  const handleDropDownChange=(e)=>{
  setDropDownCalled(true)
  setSelectedValue(e.target.value)
  dropDownChange({"component_id":label,"component_status":e.target.value||value,"name":name})//name is added to identify component selected in Paraent component
  }
    return  <FormControl    disabled={disabled}
    sx={{ m: 1, minWidth: 200 }}
    size="small"
  >
   
    <Select 

      labelId="demo-select-small"
      value={selectedValue}
      onChange={handleDropDownChange}
    >
      <MenuItem value="Operational">
        Operational
      </MenuItem>
      <MenuItem value="Degraded Performance">
        Degraded Performance
      </MenuItem>
      <MenuItem value="Partial Outage">
        Partial Outage
      </MenuItem>
      <MenuItem value="Major Outage">
        Major Outage
      </MenuItem>
      <MenuItem value="Under Maintenance">
        Under Maintenance
      </MenuItem>
    </Select>
  </FormControl>
}
export default CustomDropDown;