import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';

function RateChanger() {
  const [rate, setRate] = useState(0);

  const handleRateChange = (event) => {
    setRate(event.target.value);
  };

  const handleRateSubmit = async () => {
    try {
      const response = await fetch('http://localhost:6990/api/update-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rate }),
      });
      if (response.ok) {
        console.log('Rate updated successfully');
        // Optionally update local state or show a success message
      } else {
        console.error('Failed to update rate');
        // Handle error scenario
      }
    } catch (error) {
      console.error('Error updating rate:', error);
      // Handle network error scenario
    }
  };

  useEffect(() => {
    const fetchLastRate = async () => {
      try {
        const response = await fetch('http://localhost:6990/api/last-rate');
        if (response.ok) {
          const lastRate = await response.json();
          setRate(lastRate.value || 0);
        } else {
          console.error('Failed to fetch last rate');
          // Handle error scenario
        }
      } catch (error) {
        console.error('Error fetching last rate:', error);
        // Handle network error scenario
      }
    };

    fetchLastRate();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Sell Rate: {rate}
      </Typography>
      <Divider/>
      <TextField
        label="Enter Rate"
        type="number"
        value={rate}
        onChange={handleRateChange}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleRateSubmit} sx={{ mt: 2 }}>
        Update Rate
      </Button>

      <Divider/>
      
      <Typography variant="h6" sx={{ mt: 2 }}>
        Buy Rate: {rate}
      </Typography>
      <Divider/>
      <TextField
        label="Enter Rate"
        type="number"
        value={rate}
        onChange={handleRateChange}
        variant="outlined"
      />
      <Button variant="contained" onClick={handleRateSubmit} sx={{ mt: 2 }}>
        Update Rate
      </Button>
    </Box>
  );
}

export default RateChanger;
