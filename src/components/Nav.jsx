import { AppBar, Box, Button, Toolbar, Typography, useTheme, useMediaQuery } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#000', boxShadow: 'none' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '8px' : '16px',
        gap: isMobile ? '8px' : '0'
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h4"} 
          component="div" 
          sx={{ 
            color: "white", 
            fontFamily: "'Russo One', sans-serif",
            textAlign: isMobile ? 'center' : 'left',
            marginBottom: isMobile ? '8px' : '0',
            letterSpacing: '2px',
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}
        >
          Climate change and GHG prediction
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: '16px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center'
        }}>
          <Button>
            <Link
              style={{ 
                textDecoration: "none", 
                color: "white", 
                fontFamily: "'Russo One', sans-serif",
                fontSize: isMobile ? "1rem" : "1.2rem",
                letterSpacing: '1px'
              }}
              to={"/"}
            >
              Surface Temp
            </Link>
          </Button>
          <Button>
            <Link
              style={{ 
                textDecoration: "none", 
                color: "white", 
                fontFamily: "'Russo One', sans-serif",
                fontSize: isMobile ? "1rem" : "1.2rem",
                letterSpacing: '1px'
              }}
              to={"/map2"}
            >
              GHG
            </Link>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Nav