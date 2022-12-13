import React, { useState } from "react"
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";


const CustomDropDown=({value,label,disabled})=>{
 const [selectedValue,setSelectedValue]= useState(value)
console.log("slected",value,label,disabled)
  const colorCodingStatus =[{name:"Operational",color:"green"},{name:"Degraded Performance",color:"black"}]
  const statusColor=colorCodingStatus.filter(item=>value===item.name)

  const handleDropDownChange=(e)=>{
  console.log([e.target.value,label])
  setSelectedValue(e.target.value)
  }
    return  <FormControl    disabled={disabled}
    sx={{ m: 1, minWidth: 200 }}
    size="small"
  >
    <InputLabel id="demo-select-small">
      Status
    </InputLabel>
    <Select 
  // sx={{color:statusColor[0].color}}
  
      label={label}
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