import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LazyImage = ({
  src,
  alt,
  aspectRatio = '16/9',
  width = '100%',
  height = 'auto',
  objectFit = 'cover',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      setError(true);
      setIsLoaded(true);
    };
  }, [src]);

  if (error) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          color: 'text.secondary',
          fontSize: '0.875rem',
        }}
      >
        Failed to load image
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'grey.100',
      }}
    >
      {!isLoaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      <Box
        component="img"
        src={currentSrc}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          animation: isLoaded ? `${fadeIn} 0.3s ease-in-out` : 'none',
        }}
      />
    </Box>
  );
};

export default LazyImage; 