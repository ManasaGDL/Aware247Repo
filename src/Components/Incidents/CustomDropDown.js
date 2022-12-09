import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
const CustomDropDown=({value})=>{
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