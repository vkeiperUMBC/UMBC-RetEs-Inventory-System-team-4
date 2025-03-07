import * as React from 'react';
import Box from '@mui/material/Box';

export function ShadowTest() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          margin: 2,
          border: "1px solid #252525",
          padding: 2,
          width: 200,
          textAlign: 'center',
          boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.5)', // Updated boxShadow
          borderRadius: 1,
          bgcolor: 'background.paper',
        }}
      >
        <p>test</p>
      </Box>
    </Box>
  );
}

export default ShadowTest;
