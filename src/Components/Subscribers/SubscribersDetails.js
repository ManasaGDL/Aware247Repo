import { useState } from "react";
import HeaderTabs from "../common/HeaderTabs";
import SubscribersList from "./SubscribersList";
const SubscribersDetails = () =>{ // holds the DataGrid
    const [ tabValue , setTabValue ] = useState(0);
    const tabs = [
        {
        title:"Email Subscribers",
        content:<SubscribersList name="email"/>
        },
        {
         title:"SMS Subscribers",
        content:<SubscribersList name="sms"/>
        }
    ]
    return <div >
        <HeaderTabs tabs ={ tabs} tabValue={tabValue} setTabValue={setTabValue}/>
    </div>
}
export default SubscribersDetails;