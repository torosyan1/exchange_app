import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function RateChanger() {
  const [rateSell, setRateSell] = useState(0);
  const [rateBuy, setRateBuy] = useState(0);

  const handleRateChangeBuy = (event) => {
    setRateBuy(event.target.value);
  };


  const handleRateChangeSell = (event) => {
    setRateSell(event.target.value);
  };


  const handleRateSubmitBuy = async () => {
    try {
      const response = await fetch('http://51.20.225.234:6990/api/update-rate-buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ rate: rateBuy }),
      });
      if (response.ok) {
        alert('Buy rate updated')
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

  const handleRateSubmitSell = async () => {
    try {
      const response = await fetch('http://51.20.225.234:6990/api/update-rate-sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        body: JSON.stringify({ rate: rateSell }),
      });
      if (response.ok) {
        console.log('Rate updated successfully');
        alert('Sell rate updated')
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
        const responseSell = await fetch('http://51.20.225.234:6990/api/last-rate-sell', { headers: { Authorization: localStorage.getItem('token') }});
        if (responseSell.ok) {
          const lastRate = await responseSell.json();
          setRateSell(lastRate.value || 0);
        } else {
          console.error('Failed to fetch last rate');
          // Handle error scenario
        }

        const responseBuy = await fetch('http://51.20.225.234:6990/api/last-rate-buy', { headers: { Authorization: localStorage.getItem('token') }});
        if (responseBuy.ok) {
          const lastRate = await responseBuy.json();
          setRateBuy(lastRate.value || 0);
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
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 }}>
     <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'  }}>
     <div>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Buy Rate: {rateBuy}
      </Typography>
      <TextField
        label="Enter Rate"
        type="number"
        value={rateBuy}
        onChange={handleRateChangeBuy}
        variant="outlined"
      />
      <Button style={{ display: 'block', width: '100%' }} variant="contained" onClick={handleRateSubmitBuy} sx={{ mt: 2 }}>
        Update Rate
      </Button>
      </div>
      <div>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Sell Rate: {rateSell}
      </Typography>
      <TextField
        label="Enter Rate"
        type="number"
        value={rateSell}
        onChange={handleRateChangeSell}
        variant="outlined"
      />
      <Button style={{ display: 'block', width: '100%' }} variant="contained" onClick={handleRateSubmitSell} sx={{ mt: 2 }}>
        Update Rate
      </Button>
        </div>  
        </div>    
    </Box>
  );
}

export default RateChanger;
