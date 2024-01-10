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
              DogCatPuzzle
            </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}