//import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


export default function ButtonAppBar() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          
            <Typography>
              <div style={{textAlign:"center"}}>News</div>
            </Typography>
          
        </Toolbar>
      </AppBar>
    </div>
  );
}