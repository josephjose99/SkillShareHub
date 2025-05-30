import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        animation: `${fadeIn} 0.3s ease-in-out`,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: 'primary.main',
          mb: 2,
        }}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          animation: `${fadeIn} 0.3s ease-in-out`,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner; 