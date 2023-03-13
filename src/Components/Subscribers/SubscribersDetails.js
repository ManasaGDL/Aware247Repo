import { useState } from "react";
import HeaderTabs from "../common/HeaderTabs";
import SubscribersList from "./SubscribersList";
const SubscribersDetails = ({handleRefresh}) =>{ // holds the DataGrid
    const [ tabValue , setTabValue ] = useState(0);
    const tabs = [
        {
        title:"Email Subscribers",
        content:<SubscribersList name="email" handleRefresh={handleRefresh}/>
        },
        {
         title:"SMS Subscribers",
        content:<SubscribersList name="sms" handleRefresh={handleRefresh}/>
        }
    ]
    return <div >
        <HeaderTabs tabs ={ tabs} tabValue={tabValue} setTabValue={setTabValue}/>
    </div>
}
export default SubscribersDetails;