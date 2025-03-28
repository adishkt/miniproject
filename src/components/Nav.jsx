import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <div>
           {/* <Box sx={{ flexGrow: 3}}> */}
        {/* <AppBar position="static" color="black" sx={{color:"black"}}> */}
          <Toolbar>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, color:"white", fontFamily:"cursive",}}>
              Climate chamge and GHG prediction
            </Typography>
            <Button>
              <Link
                style={{ textDecoration: "none", color: "white", fontFamily:"fantasy", fontSize:"40px"}}
                to={"/"}
              >
                Surface Temp
              </Link>
            </Button>
            <Button>
              <Link
                style={{ textDecoration: "none", color: "white", fontFamily:"fantasy", fontSize:"40px"}}
                to={"/map2"}
              >
                GHG
              </Link>
            </Button>
          </Toolbar>
        {/* </AppBar> */}
      {/* </Box> */}
    </div>
  )
}

export default Nav