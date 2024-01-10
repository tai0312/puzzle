//import React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const DivRoot = styled('div')(() => ({
  flexGrow: 1,
}));

/*const DialogTypography = styled(Typography)(() => ({
  flexGrow: 1,
}));*/

export default function ButtonAppBar() {
  return (
    <DivRoot>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            News
          </Typography>
        </Toolbar>
      </AppBar>
    </DivRoot>
  );
}