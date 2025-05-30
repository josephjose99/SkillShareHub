import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          flexGrow: 1,
          py: 3,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default DashboardLayout; 