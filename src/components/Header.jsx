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
          <div>
            <Typography style={{textAlign:"center"}}>
              News
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}