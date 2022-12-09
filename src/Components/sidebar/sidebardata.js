import HomeIcon from '@mui/icons-material/Home';
import { FaHome,FaGlobe,FaUsers,FaThList,FaListUl} from "react-icons/fa";
import {AiOutlineUnorderedList,AiFillWarning,AiFillBell,AiFillSetting} from "react-icons/ai"
import {HiUsers} from "react-icons/hi"
export const sidebardata=[
    {
    title: "Dashboard",
    path:   "/admin/dashboard",
    icon :<FaHome style={{color:"#656565"}}/>
    },
   
    {
title:"Incidents",
path :"/admin/incidents",
icon:<AiFillWarning style={{color:"#656565"}}/>
    },
    {
  title:"Components",
  path:"/admin/componets",
  icon:<FaListUl style={{color:"#656565"}}/>
    },
    {
      title:"Clusters",
      path:"/admin/clusters",
      icon:<FaThList style={{color:"#656565"}}/>
        },
    
    {
  title:"Company/Clients",
  path:"/admin/company_clients",
  icon:<FaGlobe style={{color:"#656565"}}/>
    },
    {
      title:"Subscribers",
      path:"/admin/subscribers",
      icon:<FaUsers style={{color:"#656565"}}/>
       },
    {
   title:"TeamMembers",
   path:"/admin/teammembers",
   icon:<HiUsers style={{color:"#656565"}}/>
    },
    
    {
   title:"Maintenance",
   path:"/admin/maintenance",
   icon:<AiFillBell style={{color:"#656565"}}/>
    },
    {
   title:"Settings",
   path:"/admin/settings",
   icon:<AiFillSetting style={{color:"#656565"}}/>
    }
]
