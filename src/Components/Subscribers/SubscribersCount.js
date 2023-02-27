import {
    Card,
    CardContent,
    Box,
    Grid,
  } from "@mui/material";
 
  import { Typography } from "@mui/material";
const SubscribersCount = ({subscribersCount}) =>{
    return   <Grid
    container
    spacing={5}
    sx={{ marginTop:1,textAlign:"center",justifyContent:"center"}} 
   
  >
    <Grid item md={6}>
      <Box sx={{ width: 400, marginLeft:15}}>
        <Card variant="outlined"  >
          <CardContent>
            <Typography variant="h6" component="div">
              Email Subscribers
            </Typography>
            <Typography variant="h2" sx={{ color:"#00bcd4"}}>
            {subscribersCount["email_subscibers"]}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Grid>
    <Grid item md={6}>
      <Box sx={{ width: 400 }}>
        <Card variant="outlined"> <CardContent>
            <Typography variant="h6" component="div">
             SMS Subscribers
            </Typography>
            <Typography variant="h2" sx={{ color:"#00bcd4"}}>
              {subscribersCount["sms_subscibers"]}
            </Typography>
          </CardContent></Card>
      </Box>
    </Grid>
  </Grid>
}
export default SubscribersCount;
