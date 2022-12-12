import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TabPanel from './TabPanel/TabPanel';

const HeaderTabs = ({tabs,tabValue,setTabValue}) =>{
    const handleChange =(tabIndex)=>{
       setTabValue(tabIndex)
    }
    return <><Box sx={{pl:3}}><Tabs value={tabValue} onChange={(e,newValue)=>{handleChange(newValue)}}>
   {tabs.map(tab=>{
    return <Tab label={<b>{tab.title}</b>} ></Tab>
   })}
    </Tabs>
    </Box>
    {tabs.map((tab,index)=>{
        return <TabPanel value={tabValue} index={index}>{tab.content}</TabPanel>
    })}
    </>
}
export default HeaderTabs;