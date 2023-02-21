

import React from "react";
const businessUnitContext = React.createContext(localStorage.getItem("BU"));
export default businessUnitContext;