import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { keyframes } from '@mui/system';

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const Toast = ({ open, message, severity, onClose, autoHideDuration = 3000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      sx={{
        '& .MuiSnackbar-root': {
          animation: `${slideIn} 0.3s ease-out`,
        },
        '& .MuiSnackbar-root.MuiSnackbar-hidden': {
          animation: `${slideOut} 0.3s ease-in`,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast; 