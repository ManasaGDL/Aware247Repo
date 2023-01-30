const color = `#000000`
const redShade='#8e3b31'
const bgShade ='rgba(217, 68, 48, 0.1)'
export default {
    Operational: {
      name: "Operational",
      colour: `#247234`,//green shade
      backgroundColour: `rgba(61, 167, 81, 0.1)`,
     
    },
    'Degraded Performance': {
      name: "Degraded Performance",
      colour: redShade,
      backgroundColour: bgShade,
    
      // rgba(73, 144, 226, 0.1)
    },
    'Partial Outage': {
      name: "Partial Outage",
      colour: redShade,
   
      backgroundColour: bgShade
     
    },
    'Major Outage': {
      name: "Major Outage",
      colour: redShade,
    
      backgroundColour: bgShade,
   
    },
    'Under Maintenance': {
      name: "Under Maintenance",
      colour: color,
      backgroundColour: "#FFFBAC",
     
    },
  };
  