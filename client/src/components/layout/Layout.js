import React from 'react';
import { Container } from '@mui/material';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          minHeight: 'calc(100vh - 64px - 32px)', // Subtract navbar height and margins
        }}
      >
        {children}
      </Container>
    </>
  );
}

export default Layout; 