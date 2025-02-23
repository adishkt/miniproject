import { Card, CardMedia, Grid, Typography } from '@mui/material'
import React from 'react'

const Team = () => {
  return (
    <div style={{marginLeft:'2%' ,marginTop:"2%",marginBottom:'2%',marginRight:'2%', paddingLeft:"0%"}}>
        <Typography variant="h1" component="div" sx={{ flexGrow: 1, color:"black", fontFamily:"fantasy",paddingTop:"20px",paddingLeft:"13%"}}>
              Introducing the delevoper team members
            </Typography>
            <br /><br /><br />
       <Grid item xs={12}sx={{paddingLeft:"30%"}} >
       <Card sx={{ maxWidth: 890 }}>
                <CardMedia
                sx={{ height: 1040 }}
                image="/team.jpg" />
                
        </Card>
       </Grid>

    </div>
  )
}

export default Team