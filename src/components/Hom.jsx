import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from '@mui/material'
import React from 'react'

const Hom = () => {
  return (
    <div style={{marginLeft:'2%' ,marginTop:"2%",marginBottom:'2%',marginRight:'2%', paddingLeft:"0%"}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6} md={8}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, color:"white", fontFamily:"cursive",}}>
                        Air quality map</Typography>
                    <Card sx={{ maxWidth: 890 }}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/map1.png"  
                                />
                            </Card>
        </Grid>
        <Grid item xs={6} md={4}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, color:"white", fontFamily:"cursive",}}>
                        climate change map</Typography>
                    <Card sx={{ maxWidth: 990 }}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/change.jpg"  
                                />
                            </Card>
        </Grid>
        <Grid item xs={6} md={8}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, color:"white", fontFamily:"cursive",}}>
                       What is climate change????</Typography>
                        <Card sx={{ maxWidth: 890}}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/climate.jpg"  
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                    Climate change is a long-term shift in global or regional climate patterns, primarily driven by human activities such as fossil fuel burning, deforestation, and industrial emissions, leading to rising temperatures, extreme weather events, and environmental disruptions.
                                    </Typography>
                                </CardContent>
                            </Card>
        </Grid>
        <Grid item xs={6} md={4} >
            <br /><br />
        <Card sx={{ maxWidth: 890 }}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/pic2.jpg"  
                                />
                            </Card>
        </Grid>
        <Grid item xs={6} md={8}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, color:"white", fontFamily:"cursive",}}>
                        What is Air quality ????</Typography>
                            <Card sx={{ maxWidth: 890 }}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/air.jpg"  
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                    Air quality refers to the cleanliness of the air we breathe, affected by pollutants like carbon dioxide, particulate matter, and toxins, which can impact human health, ecosystems, and climate.
                                    </Typography>
                                </CardContent>
                            </Card>
        </Grid>
        <Grid item xs={6} md={4}>
        <br /><br />
        <Card sx={{ maxWidth: 890 }}>
                                <CardMedia
                                    sx={{ height: 340 }}
                                    image="/air1.jpg"  
                                />
                            </Card>
        </Grid>
      </Grid>
    </Box>
    </div>
  )
}

export default Hom