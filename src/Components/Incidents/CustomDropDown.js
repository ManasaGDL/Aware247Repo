import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";


const CustomDropDown=({value})=>{
  

  const colorCodingStatus =[{name:"Operational",color:"green"},{name:"Degraded Performance",color:"black"}]
  const statusColor=colorCodingStatus.filter(item=>value===item.name)
 console.log("statusColor",statusColor,value)
  const handleDropDownChange=()=>{
    return <></>
  }
    return  <FormControl
    sx={{ m: 1, minWidth: 160 }}
    size="small"
  >
    <InputLabel id="demo-select-small">
      Status
    </InputLabel>
    <Select 
  sx={{color:statusColor[0].color}}

      label="status"
      labelId="demo-select-small"
      value={value}
      onChange={handleDropDownChange}
    >
      <MenuItem value="Operational">
        Operational
      </MenuItem>
      <MenuItem value="Degraded Performance">
        Degraded Performance
      </MenuItem>
      <MenuItem value="Degraded Performance">
        Partial Outage
      </MenuItem>
      <MenuItem value="Degraded Performance">
        Major Outage
      </MenuItem>
      <MenuItem value="Degraded Performance">
        Under Maintenance
      </MenuItem>
    </Select>
  </FormControl>
}
export default CustomDropDown;